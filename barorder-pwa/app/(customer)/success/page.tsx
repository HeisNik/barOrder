import { PickupCodeView } from "@/components/customer/PickupCodeView";
import {
  parseAmountCentsParam,
  parseOrderIdParam,
  parseOrderStatusParam,
  parsePickupCodeParam,
} from "@/lib/params";

type SuccessPageProps = {
  searchParams: Promise<{
    amount?: string;
    order?: string;
    pickup?: string;
    status?: string;
  }>;
};

export default async function SuccessPage({ searchParams }: SuccessPageProps) {
  const query = await searchParams;
  const status = parseOrderStatusParam(query.status);
  const pickupCode = parsePickupCodeParam(query.pickup);
  const orderId = parseOrderIdParam(query.order);
  const totalAmountCents = parseAmountCentsParam(query.amount);

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
