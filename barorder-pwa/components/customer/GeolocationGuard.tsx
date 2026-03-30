"use client";

import { useEffect, useMemo, useState } from "react";

type GuardState = "checking" | "allowed" | "blocked";

type GeolocationGuardProps = {
  barLat: number | null;
  barLong: number | null;
  children: React.ReactNode;
};

const ALLOWED_RADIUS_METERS = 500;

function toRadians(value: number): number {
  return (value * Math.PI) / 180;
}

function distanceInMeters(
  lat1: number,
  long1: number,
  lat2: number,
  long2: number,
): number {
  const earthRadius = 6371000;
  const dLat = toRadians(lat2 - lat1);
  const dLong = toRadians(long2 - long1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLong / 2) *
      Math.sin(dLong / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return earthRadius * c;
}

export function GeolocationGuard({ barLat, barLong, children }: GeolocationGuardProps) {
  const [guardState, setGuardState] = useState<GuardState>("checking");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [distanceMeters, setDistanceMeters] = useState<number | null>(null);

  const isDebugBypassEnabled = useMemo(
    () => process.env.NEXT_PUBLIC_GEOLOCATION_DEBUG_BYPASS === "true",
    [],
  );

  useEffect(() => {
    if (isDebugBypassEnabled || barLat == null || barLong == null) {
      return;
    }

    if (!navigator.geolocation) {
      const frameId = window.requestAnimationFrame(() => {
        setGuardState("blocked");
        setErrorMessage("Selaimesi ei tue sijainnin tarkistusta.");
      });
      return () => window.cancelAnimationFrame(frameId);
    }

    const timeoutId = window.setTimeout(() => {
      setGuardState("checking");
      setErrorMessage(null);
      setDistanceMeters(null);
    }, 0);

    const clearPending = () => {
      window.clearTimeout(timeoutId);
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        clearPending();
        const meters = distanceInMeters(
          barLat,
          barLong,
          position.coords.latitude,
          position.coords.longitude,
        );
        setDistanceMeters(meters);

        if (meters <= ALLOWED_RADIUS_METERS) {
          setGuardState("allowed");
          return;
        }

        setGuardState("blocked");
        setErrorMessage("Tilaus sallitaan vain baarin lahialueelta.");
      },
      (error) => {
        clearPending();
        setGuardState("blocked");
        if (error.code === error.PERMISSION_DENIED) {
          setErrorMessage("Sijaintilupa tarvitaan tilauksen tekemiseen.");
          return;
        }
        setErrorMessage("Sijaintia ei voitu tarkistaa. Yrita hetken kuluttua uudelleen.");
      },
      {
        enableHighAccuracy: true,
        timeout: 8000,
        maximumAge: 30000,
      },
    );

    return () => {
      clearPending();
    };
  }, [barLat, barLong, isDebugBypassEnabled]);

  if (isDebugBypassEnabled || barLat == null || barLong == null) {
    return <>{children}</>;
  }

  if (guardState === "checking") {
    return (
      <section className="mt-4 w-full rounded-xl border border-zinc-200 p-4 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
        Tarkistetaan sijaintia...
      </section>
    );
  }

  if (guardState === "blocked") {
    return (
      <section className="mt-4 w-full rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900/60 dark:bg-red-950/20">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-300">Tilaus estetty</h2>
        <p className="mt-1 text-sm text-red-700/90 dark:text-red-200">{errorMessage}</p>
        {distanceMeters != null ? (
          <p className="mt-2 text-xs text-red-700/80 dark:text-red-300/80">
            Etäisyys baariin noin {Math.round(distanceMeters)} m (sallittu {ALLOWED_RADIUS_METERS} m).
          </p>
        ) : null}
      </section>
    );
  }

  return <>{children}</>;
}
