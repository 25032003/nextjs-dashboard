import { fetchClientes, fetchPedidos, fetchProveedores, fetchFacturas } from '@/lib/api';
import CrearClienteForm from '@/app/ui/clientes/create-form';
import CrearProveedorForm from '@/app/ui/proveedores/create-form';
import CrearPedidoForm from '@/app/ui/pedidos/create-form';
import CrearFacturaForm from '@/app/ui/facturas/create-form';

export const dynamic = 'force-dynamic';

export default async function DatosPage() {
  const [clientes, pedidos, proveedores, facturas] = await Promise.all([
    fetchClientes().catch(() => []),
    fetchPedidos().catch(() => []),
    fetchProveedores().catch(() => []),
    fetchFacturas().catch(() => []),
  ]);

  return (
    <main className="space-y-10">
      <div>
        <h1 className="text-2xl font-semibold mb-2">Datos detallados backend</h1>
        <p className="text-sm text-gray-600">Crea clientes y observa la actualización inmediata. Luego genera pedidos en Swagger para poder facturarlos en B.</p>
      </div>
      <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
        <h2 className="text-lg font-medium mb-3">Crear nuevo cliente (A)</h2>
        <CrearClienteForm />
      </div>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
          <h2 className="text-lg font-medium mb-3">Crear proveedor (B)</h2>
          <CrearProveedorForm />
        </div>
        <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
          <h2 className="text-lg font-medium mb-3">Crear pedido (A)</h2>
          <CrearPedidoForm clientes={clientes as any[]} />
        </div>
      </div>
      <div className="rounded-md border border-gray-200 p-4 bg-gray-50">
        <h2 className="text-lg font-medium mb-3">Crear factura (B)</h2>
        <CrearFacturaForm proveedores={proveedores as any[]} pedidos={pedidos as any[]} />
      </div>
      <Section title="Clientes (A)" items={clientes} empty="Sin clientes" />
      <Section title="Pedidos (A)" items={pedidos} empty="Sin pedidos" />
      <Section title="Proveedores (B)" items={proveedores} empty="Sin proveedores" />
      <Section title="Facturas (B)" items={facturas} empty="Sin facturas" />
    </main>
  );
}

function Section({ title, items, empty }: { title: string; items: any[]; empty: string }) {
  return (
    <div>
      <h2 className="mb-2 text-xl font-medium">{title} <span className="text-sm text-gray-500">({items.length})</span></h2>
      {items.length === 0 ? (
        <p className="text-sm text-gray-500">{empty}</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                {Object.keys(items[0]).map((k) => (
                  <th key={k} className="px-3 py-2 font-semibold capitalize">{k}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((row, idx) => (
                <tr key={idx} className="odd:bg-white even:bg-gray-50">
                  {Object.values(row).map((v, i) => (
                    <td key={i} className="px-3 py-2 whitespace-nowrap max-w-[240px] truncate" title={String(v)}>
                      {stringify(v)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function stringify(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}