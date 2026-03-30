"use client";

import { ErrorState } from "@/components/customer/ErrorState";

export default function CustomerSlugError() {
  return (
    <ErrorState
      title="Jotain meni pieleen"
      description="Sivua ei voitu ladata juuri nyt. Yrita hetken kuluttua uudelleen."
    />
  );
}
