import { BanknotesIcon, UserGroupIcon, InboxIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';
import Link from 'next/link';
import { fetchFacturas, fetchProveedores } from '@/lib/api';

async function fetchDbStatusA() {
  const base = process.env.NEXT_PUBLIC_API_A;
  const res = await fetch(`${base}/db/status`, { cache: 'no-store' });
  if (!res.ok) return { clientesCount: 0, pedidosCount: 0 };
  return res.json() as Promise<{ clientesCount: number; pedidosCount: number }>;
}

export default async function BackendCardWrapper() {
  const [statusA, proveedores, facturas] = await Promise.all([
    fetchDbStatusA(),
    fetchProveedores().catch(() => []),
    fetchFacturas().catch(() => []),
  ]);

  const clientes = statusA?.clientesCount ?? 0;
  const pedidos = statusA?.pedidosCount ?? 0;
  const provs = (proveedores as any[]).length;
  const facts = (facturas as any[]).length;

  return (
    <>
      <Card title="Clientes (A)" value={clientes} type="customers" />
      <Card title="Pedidos (A)" value={pedidos} type="invoices" />
      <Card title="Proveedores (B)" value={provs} type="customers" />
      <Card title="Facturas (B)" value={facts} type="invoices" />
      <Link href="/dashboard/datos" className="col-span-4 block text-center text-sm text-blue-600 underline mt-2">Ver detalle</Link>
    </>
  );
}

function Card({ title, value, type }: { title: string; value: number | string; type: 'invoices' | 'customers' | 'collected' }) {
  const Icon = type === 'customers' ? UserGroupIcon : type === 'invoices' ? InboxIcon : BanknotesIcon;
  return (
    <div className="rounded-xl bg-gray-50 p-2 shadow-sm">
      <div className="flex p-4">
        {Icon ? <Icon className="h-5 w-5 text-gray-700" /> : null}
        <h3 className="ml-2 text-sm font-medium">{title}</h3>
      </div>
      <p className={`${lusitana.className} truncate rounded-xl bg-white px-4 py-8 text-center text-2xl`}>
        {value}
      </p>
    </div>
  );
}
