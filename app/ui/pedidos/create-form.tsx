"use client";
import { useState, useActionState } from 'react';
import { crearPedidoAction, type ActionState } from '@/app/lib/actions-backend';

type Cliente = { id: number; nombre?: string; correo?: string };

export default function CrearPedidoForm({ clientes }: { clientes: Cliente[] }) {
  const initial: ActionState = { message: null, errors: {} };
  const [state, formAction] = useActionState(crearPedidoAction as any, initial);
  const [productos, setProductos] = useState<{ nombre: string; precio: string }[]>([
    { nombre: '', precio: '' },
  ]);
  const [clienteId, setClienteId] = useState<string>('');

  function addProducto() {
    setProductos((p) => [...p, { nombre: '', precio: '' }]);
  }
  function updateProducto(idx: number, field: 'nombre' | 'precio', value: string) {
    setProductos((arr) => arr.map((p, i) => (i === idx ? { ...p, [field]: value } : p)));
  }
  function buildPayload() {
    return JSON.stringify({
      clienteId: Number(clienteId),
      productos: productos
        .filter((p) => p.nombre.trim() && p.precio.trim())
        .map((p) => ({ nombre: p.nombre.trim(), precio: Number(p.precio) })),
    });
  }

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      <input type="hidden" name="payload" value={buildPayload()} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Cliente</label>
        <select
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Seleccione cliente</option>
          {clientes.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre ?? `ID ${c.id}`}</option>
          ))}
        </select>
  {state.errors?.clienteId?.map((e: string) => <p key={e} className="text-sm text-red-600 mt-1">{e}</p>)}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Productos</label>
        {productos.map((prod, idx) => (
          <div key={idx} className="mb-2 flex gap-2">
            <input
              type="text"
              placeholder="Nombre"
              value={prod.nombre}
              onChange={(e) => updateProducto(idx, 'nombre', e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm"
            />
            <input
              type="number"
              placeholder="Precio"
              value={prod.precio}
              onChange={(e) => updateProducto(idx, 'precio', e.target.value)}
              className="w-1/2 rounded-md border border-gray-300 px-3 py-2 text-sm"
              step="0.01"
            />
          </div>
        ))}
        <button type="button" onClick={addProducto} className="text-xs text-blue-600 underline">Añadir producto</button>
  {state.errors?.productos?.map((e: string) => <p key={e} className="text-sm text-red-600 mt-1">{e}</p>)}
      </div>
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Crear pedido</button>
    </form>
  );
}
