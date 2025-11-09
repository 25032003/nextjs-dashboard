"use server";

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const API_A = process.env.NEXT_PUBLIC_API_A;
const API_B = process.env.NEXT_PUBLIC_API_B;

const ClienteSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo inválido'),
});

export type ActionState = {
  // Campos de error genéricos por nombre de campo
  errors?: Record<string, string[]>;
  message?: string | null;
};

export async function crearClienteAction(prev: ActionState, formData: FormData) {
  if (!API_A) {
    return { message: 'Falta NEXT_PUBLIC_API_A en .env.local' } satisfies ActionState;
  }

  const parsed = ClienteSchema.safeParse({
    nombre: formData.get('nombre') ?? '',
    correo: formData.get('correo') ?? '',
  });

  if (!parsed.success) {
    return {
      errors: parsed.error.flatten().fieldErrors,
      message: 'Faltan campos. No se pudo crear el cliente.',
    } satisfies ActionState;
  }

  try {
    const res = await fetch(`${API_A}/clientes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { message: `Error creando cliente: ${res.status} ${res.statusText} ${text}` } satisfies ActionState;
    }
  } catch (e: any) {
    return { message: `Error de red: ${e?.message ?? e}` } satisfies ActionState;
  }

  // Actualiza la página de datos y vuelve allí
  revalidatePath('/dashboard/datos');
  redirect('/dashboard/datos');
}

// --- Proveedores (B) ---
const ProveedorSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido'),
  correo: z
    .string()
    .min(1, 'El correo es requerido')
    .email('Correo inválido'),
});

export async function crearProveedorAction(prev: ActionState, formData: FormData) {
  if (!API_B) return { message: 'Falta NEXT_PUBLIC_API_B en .env.local' } satisfies ActionState;
  const parsed = ProveedorSchema.safeParse({
    nombre: formData.get('nombre') ?? '',
    correo: formData.get('correo') ?? '',
  });
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: 'Faltan campos. No se pudo crear el proveedor.' };
  }
  try {
    const res = await fetch(`${API_B}/proveedores`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { message: `Error creando proveedor: ${res.status} ${res.statusText} ${text}` };
    }
  } catch (e: any) {
    return { message: `Error de red: ${e?.message ?? e}` };
  }
  revalidatePath('/dashboard/datos');
  redirect('/dashboard/datos');
}

// --- Pedidos (A) ---
const PedidoPayloadSchema = z.object({
  clienteId: z.coerce.number().int().positive('clienteId requerido'),
  productos: z
    .array(
      z.object({
        nombre: z.string().min(1, 'Nombre requerido'),
        precio: z.coerce.number().gt(0, 'Precio debe ser mayor que 0'),
      })
    )
    .min(1, 'Debe agregar al menos un producto'),
});

export async function crearPedidoAction(prev: ActionState, formData: FormData) {
  if (!API_A) return { message: 'Falta NEXT_PUBLIC_API_A en .env.local' } satisfies ActionState;
  const raw = String(formData.get('payload') ?? '');
  let data: unknown;
  try {
    data = JSON.parse(raw);
  } catch {
    return { message: 'Payload inválido' } satisfies ActionState;
  }
  const parsed = PedidoPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: 'Validación fallida en productos o cliente' };
  }
  try {
    const res = await fetch(`${API_A}/pedidos`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { message: `Error creando pedido: ${res.status} ${res.statusText} ${text}` };
    }
  } catch (e: any) {
    return { message: `Error de red: ${e?.message ?? e}` };
  }
  revalidatePath('/dashboard/datos');
  redirect('/dashboard/datos');
}

// --- Facturas (B) ---
const FacturaPayloadSchema = z.object({
  proveedorId: z.coerce.number().int().positive('proveedorId requerido'),
  pedidos: z
    .array(
      z.object({
        pedidoId: z.coerce.number().int().positive('pedidoId requerido'),
        total: z.coerce.number().min(0, 'total no puede ser negativo'),
      })
    )
    .min(1, 'Seleccione al menos un pedido'),
});

export async function crearFacturaAction(prev: ActionState, formData: FormData) {
  if (!API_B) return { message: 'Falta NEXT_PUBLIC_API_B en .env.local' } satisfies ActionState;
  const raw = String(formData.get('payload') ?? '');
  let data: unknown;
  try { data = JSON.parse(raw); } catch { return { message: 'Payload inválido' }; }
  const parsed = FacturaPayloadSchema.safeParse(data);
  if (!parsed.success) {
    return { errors: parsed.error.flatten().fieldErrors, message: 'Validación fallida en proveedor o pedidos' };
  }
  try {
    const res = await fetch(`${API_B}/facturas`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsed.data),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => '');
      return { message: `Error creando factura: ${res.status} ${res.statusText} ${text}` };
    }
  } catch (e: any) {
    return { message: `Error de red: ${e?.message ?? e}` };
  }
  revalidatePath('/dashboard/datos');
  redirect('/dashboard/datos');
}
