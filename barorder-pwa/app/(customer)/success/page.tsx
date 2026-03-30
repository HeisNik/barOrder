import { PickupCodeView } from "@/components/customer/PickupCodeView";
import type { OrderStatus } from "@/types";

type SuccessPageProps = {
  searchParams: Promise<{
    amount?: string;
    order?: string;
    pickup?: string;
    status?: string;
  }>;
};

function toOrderStatus(status?: string): OrderStatus {
  if (status === "pending" || status === "paid" || status === "preparing" || status === "ready" || status === "delivered") {
    return status;
  }

  return "paid";
}

function toPickupCode(raw?: string): string {
  if (raw && raw.trim().length > 0) {
    return raw.startsWith("#") ? raw : `#${raw}`;
  }

  const fallback = Math.floor(100 + Math.random() * 900);
  return `#${fallback}`;
}

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const query = await searchParams;
  const status = toOrderStatus(query.status);
  const pickupCode = toPickupCode(query.pickup);
  const orderId = query.order ?? null;
  const totalAmountCents = query.amount ? Number(query.amount) : null;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-2xl flex-col items-start justify-center gap-3 px-6 py-10">
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Customer app</p>
      <h1 className="text-3xl font-semibold tracking-tight">Maksu onnistui</h1>
      <p className="text-sm text-zinc-600 dark:text-zinc-400">
        Tallenna noutokoodi ja nayta se tiskilla juomia noutaessa.
      </p>
      <PickupCodeView
        pickupCode={pickupCode}
        initialStatus={status}
        orderId={orderId}
        totalAmountCents={totalAmountCents}
      />
    </main>
  );
}
