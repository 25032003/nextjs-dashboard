"use client";
import { useActionState } from 'react';
import { crearProveedorAction, type ActionState } from '@/app/lib/actions-backend';

export default function CrearProveedorForm() {
  const initial: ActionState = { message: null, errors: {} };
  const [state, formAction] = useActionState(crearProveedorAction, initial);
  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input id="nombre" name="nombre" type="text" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="Proveedor XYZ" />
        {state.errors?.nombre?.map(e => <p key={e} className="text-sm text-red-600 mt-1">{e}</p>)}
      </div>
      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
        <input id="correo" name="correo" type="email" className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm" placeholder="contacto@proveedor.com" />
        {state.errors?.correo?.map(e => <p key={e} className="text-sm text-red-600 mt-1">{e}</p>)}
      </div>
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Crear proveedor</button>
    </form>
  );
}
