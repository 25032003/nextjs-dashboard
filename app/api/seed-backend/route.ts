import { NextResponse } from 'next/server';

type ClienteIn = { nombre: string; correo: string };
type ProveedorIn = { nombre: string; correo: string };
type Pedido = { id: number; total?: number } & Record<string, any>;

const baseA = process.env.NEXT_PUBLIC_API_A;
const baseB = process.env.NEXT_PUBLIC_API_B;

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    throw new Error(`POST ${url} -> ${res.status} ${res.statusText} ${text}`);
  }
  return res.json().catch(() => ({}));
}

function randomName(prefix: string) {
  const n = Math.floor(Math.random() * 100000);
  return `${prefix} ${n}`;
}
function randomEmail(prefix: string) {
  const n = Math.floor(Math.random() * 100000);
  return `${prefix}${n}@example.com`;
}

export async function POST() {
  if (!baseA || !baseB) {
    return NextResponse.json(
      { error: 'Faltan NEXT_PUBLIC_API_A y/o NEXT_PUBLIC_API_B en .env.local' },
      { status: 400 }
    );
  }

  const summary: any = {
    created: { clientes: 0, proveedores: 0, facturas: 0 },
    usedPedidos: [] as number[],
  };

  try {
    // 1) Crear clientes en A
    const clientesToCreate: ClienteIn[] = Array.from({ length: 5 }).map(() => ({
      nombre: randomName('Cliente'),
      correo: randomEmail('cliente'),
    }));
    for (const c of clientesToCreate) {
      await postJson(`${baseA}/clientes`, c).catch(() => {});
      summary.created.clientes++;
    }

    // 2) Crear proveedores en B
    const proveedoresToCreate: ProveedorIn[] = Array.from({ length: 3 }).map(() => ({
      nombre: randomName('Proveedor'),
      correo: randomEmail('proveedor'),
    }));
    const proveedoresCreated: any[] = [];
    for (const p of proveedoresToCreate) {
      const created = await postJson(`${baseB}/proveedores`, p).catch(() => null);
      if (created) {
        proveedoresCreated.push(created);
        summary.created.proveedores++;
      }
    }

    // 3) Intentar crear facturas en B usando pedidos existentes en A (si los hay)
    const pedidosRes = await fetch(`${baseA}/pedidos`, { cache: 'no-store' });
    const pedidos: Pedido[] = pedidosRes.ok ? await pedidosRes.json() : [];

    if (pedidos.length > 0 && proveedoresCreated.length > 0) {
      // Tomamos hasta 2 pedidos por factura
      const pickPedidos = (count: number) => pedidos.slice(0, count);
      const pedidosForFactura1 = pickPedidos(Math.min(2, pedidos.length));
      const pedidoRefs = pedidosForFactura1.map((p) => ({ pedidoId: p.id, total: p.total ?? 0 }));
      summary.usedPedidos = pedidoRefs.map((r) => r.pedidoId);

      // Crear 1 o 2 facturas, cada una asociada a un proveedor distinto si es posible
      const facturasToCreate = Math.min(2, proveedoresCreated.length);
      for (let i = 0; i < facturasToCreate; i++) {
        const proveedor = proveedoresCreated[i];
        const payload = { proveedorId: proveedor.id ?? proveedor?.proveedorId ?? proveedor?.proveedor?.id, pedidos: pedidoRefs };
        await postJson(`${baseB}/facturas`, payload).catch(() => {});
        summary.created.facturas++;
      }
    }

    return NextResponse.json(summary, { status: 200 });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'seed error' }, { status: 500 });
  }
}

export async function GET() {
  // Permitir disparar el seed también con GET para comodidad
  return POST();
}
