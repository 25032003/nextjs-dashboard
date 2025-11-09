"use client";

import { useActionState } from 'react';
import { crearClienteAction, type ActionState } from '@/app/lib/actions-backend';

export default function CrearClienteForm() {
  const initial: ActionState = { message: null, errors: {} };
  const [state, formAction] = useActionState(crearClienteAction, initial);

  return (
    <form action={formAction} className="space-y-4 max-w-md">
      <div>
        <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="Juan Pérez"
          aria-describedby="nombre-error"
        />
        <div id="nombre-error" aria-live="polite" aria-atomic="true">
          {state.errors?.nombre?.map((e) => (
            <p key={e} className="mt-1 text-sm text-red-600">{e}</p>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="correo" className="block text-sm font-medium text-gray-700">Correo</label>
        <input
          id="correo"
          name="correo"
          type="email"
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          placeholder="juan.perez@example.com"
          aria-describedby="correo-error"
        />
        <div id="correo-error" aria-live="polite" aria-atomic="true">
          {state.errors?.correo?.map((e) => (
            <p key={e} className="mt-1 text-sm text-red-600">{e}</p>
          ))}
        </div>
      </div>

      {state.message && (
        <p className="text-sm text-red-600" aria-live="polite" aria-atomic="true">{state.message}</p>
      )}

      <div className="pt-2">
        <button
          type="submit"
          className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Crear cliente
        </button>
      </div>
    </form>
  );
}
