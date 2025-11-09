"use client";
import { useMemo, useState, useActionState } from 'react';
import { crearFacturaAction, type ActionState } from '@/app/lib/actions-backend';

type Proveedor = { id: number; nombre?: string };
type Pedido = { id: number; total?: number };

export default function CrearFacturaForm({ proveedores, pedidos }: { proveedores: Proveedor[]; pedidos: Pedido[] }) {
  const initial: ActionState = { message: null, errors: {} };
  const [state, formAction] = useActionState(crearFacturaAction as any, initial);
  const [proveedorId, setProveedorId] = useState<string>('');
  const [seleccionados, setSeleccionados] = useState<Record<number, boolean>>({});

  const pedidosSeleccionados = useMemo(() => {
    return pedidos.filter((p) => seleccionados[p.id]);
  }, [seleccionados, pedidos]);

  function togglePedido(id: number) {
    setSeleccionados((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  function buildPayload() {
    return JSON.stringify({
      proveedorId: Number(proveedorId),
      pedidos: pedidosSeleccionados.map((p) => ({ pedidoId: p.id, total: Number(p.total ?? 0) })),
    });
  }

  return (
    <form action={formAction} className="space-y-4 max-w-xl">
      <input type="hidden" name="payload" value={buildPayload()} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Proveedor</label>
        <select
          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          value={proveedorId}
          onChange={(e) => setProveedorId(e.target.value)}
        >
          <option value="">Seleccione proveedor</option>
          {proveedores.map((p) => (
            <option key={p.id} value={p.id}>{p.nombre ?? `Proveedor ${p.id}`}</option>
          ))}
        </select>
        {state.errors?.proveedorId?.map((e: string) => <p key={e} className="text-sm text-red-600 mt-1">{e}</p>)}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Pedidos disponibles</label>
        <div className="max-h-48 overflow-auto rounded-md border border-gray-200 p-2">
          {pedidos.length === 0 ? (
            <p className="text-sm text-gray-500">No hay pedidos en A. Crea pedidos primero.</p>
          ) : (
            pedidos.map((p) => (
              <label key={p.id} className="flex items-center gap-2 py-1">
                <input type="checkbox" checked={!!seleccionados[p.id]} onChange={() => togglePedido(p.id)} />
                <span>Pedido #{p.id} - total {p.total ?? 0}</span>
              </label>
            ))
          )}
        </div>
        {state.errors?.pedidos?.map((e: string) => <p key={e} className="text-sm text-red-600 mt-1">{e}</p>)}
      </div>
      {state.message && <p className="text-sm text-red-600">{state.message}</p>}
      <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Crear factura</button>
    </form>
  );
}
