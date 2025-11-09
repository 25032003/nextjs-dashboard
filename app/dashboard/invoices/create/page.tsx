import Form from '@/app/ui/invoices/create-form';
import Breadcrumbs from '@/app/ui/invoices/breadcrumbs';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Create Invoice',
};

export default async function Page() {
  // Legacy tutorial page: we removed Postgres integration.
  const customers: any[] = [];
  const hasPg = false;

  return (
    <main>
      <Breadcrumbs
        breadcrumbs={[
          { label: 'Invoices', href: '/dashboard/invoices' },
          {
            label: 'Create Invoice',
            href: '/dashboard/invoices/create',
            active: true,
          },
        ]}
      />
      {!hasPg ? (
        <div className="mt-4 rounded-md border border-amber-300 bg-amber-50 p-4 text-amber-800">
          <p className="font-medium">Invoices deshabilitado en este demo</p>
          <p className="mt-1 text-sm">
            Esta sección pertenece al tutorial de Next.js y requiere una base de datos PostgreSQL local
            (POSTGRES_URL). En este proyecto, las facturas reales se gestionan en el servicio B (PostgreSQL)
            vía la API <code>/facturas</code>. Puedes crear facturas desde Swagger en <code>http://localhost:8081/swagger-ui</code>
            o pedirme que agregue una pantalla “Crear Factura” conectada al backend B.
          </p>
        </div>
      ) : null}
      {/* Form retained only to avoid 404 in case of direct navigation; disabled */}
      <Form customers={customers} />
    </main>
  );
}
