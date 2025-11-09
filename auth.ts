import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import Credentials from 'next-auth/providers/credentials';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
import postgres from 'postgres';

// Conexión condicional: si no hay POSTGRES_URL se usa modo demo en memoria.
const enableDb = !!process.env.POSTGRES_URL;
const sql = enableDb ? postgres(process.env.POSTGRES_URL!, { ssl: 'require' }) : null;

async function getUser(email: string): Promise<User | undefined> {
  if (!enableDb) {
    // Modo demo sin base de datos: usuario fijo
    if (email === 'user@nextmail.com') {
      return {
        id: 'demo-user',
        name: 'Demo User',
        email: 'user@nextmail.com',
        password: '$2b$10$abcdefghijklmnopqrstuv' // dummy hash para cumplir tipo
      } as User;
    }
    return undefined;
  }
  try {
    const user = await sql!<User[]>`SELECT * FROM users WHERE email=${email}`;
    return user[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsedCredentials = z
          .object({ email: z.string().email(), password: z.string().min(6) })
          .safeParse(credentials);

        if (parsedCredentials.success) {
          const { email, password } = parsedCredentials.data;
          const user = await getUser(email);
          if (!user) return null;
          if (!enableDb) {
            // Validación simple sin DB
            if (password === '123456' && email === 'user@nextmail.com') {
              return { id: 'demo-user', name: 'Demo User', email } as any;
            }
            return null;
          }
          const passwordsMatch = await bcrypt.compare(password, user.password);
          if (passwordsMatch) return user as any;
        }

        console.log('Invalid credentials');
        return null;
      },
    }),
  ],
});

export const { GET, POST } = handlers;
