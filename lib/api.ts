// Centralized backend API calls to Spring services A (MariaDB) and B (PostgreSQL)
// Adjust types if you later generate TypeScript types from OpenAPI.

export async function fetchClientes() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_A}/clientes`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error cargando clientes');
  return res.json();
}

export async function fetchPedidos() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_A}/pedidos`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error cargando pedidos');
  return res.json();
}

export async function fetchProveedores() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_B}/proveedores`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error cargando proveedores');
  return res.json();
}

export async function fetchFacturas() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_B}/facturas`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error cargando facturas');
  return res.json();
}

export async function fetchConteoClientesDesdeB() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_B}/proveedores/clientes-count-via-lib`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Error conteo clientes vía B');
  return res.json();
}

export async function crearCliente(data: { nombre: string; correo: string; }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_A}/clientes`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error creando cliente');
  return res.json();
}

export async function crearProveedor(data: { nombre: string; correo: string; }) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_B}/proveedores`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('Error creando proveedor');
  return res.json();
}
