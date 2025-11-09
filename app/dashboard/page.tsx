// Se desactivan los componentes del tutorial que consultan Vercel Postgres
// para evitar errores si no hay POSTGRES_URL configurada.
// import CardWrapper from '@/app/ui/dashboard/cards';
// import RevenueChart from '@/app/ui/dashboard/revenue-chart';
// import LatestInvoices from '@/app/ui/dashboard/latest-invoices';
import { lusitana } from '@/app/ui/fonts';
import { Suspense } from 'react';
import { CardsSkeleton } from '@/app/ui/skeletons';
import type { Metadata } from 'next';
import BackendCardWrapper from '@/app/ui/dashboard/cards-backend';

export const metadata: Metadata = {
  title: 'Dashboard',
};

export default async function Page() {
  return (
    <main>
      <h1 className={`${lusitana.className} mb-4 text-xl md:text-2xl`}>
        Dashboard
      </h1>
      {/* Tarjetas en vivo contra servicios Spring (A y B) */}
      {/* Backend live data cards (A y B) */}
      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Suspense fallback={<CardsSkeleton />}>
          {/* Lee datos reales desde los servicios Spring */}
          <BackendCardWrapper />
        </Suspense>
      </div>
    </main>
  );
}
