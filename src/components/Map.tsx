/**
 * GOOGLE MAPS FRONTEND INTEGRATION - ESSENTIAL GUIDE
 *
 * USAGE FROM PARENT COMPONENT:
 * ======
 *
 * const mapRef = useRef<google.maps.Map | null>(null);
 *
 * <MapView
 *   initialCenter={{ lat: 40.7128, lng: -74.0060 }}
 *   initialZoom={15}
 *   onMapReady={(map) => {
 *     mapRef.current = map; // Store to control map from parent anytime, google map itself is in charge of the re-rendering, not react state.
 * </MapView>
 *
 * ======
 * Available Libraries and Core Features:
 * -------------------------------
 * 📍 MARKER (from `marker` library)
 * - Attaches to map using { map, position }
 * new google.maps.marker.AdvancedMarkerElement({
 *   map,
 *   position: { lat: 37.7749, lng: -122.4194 },
 *   title: "San Francisco",
 * });
 *
 * -------------------------------
 * 🏢 PLACES (from `places` library)
 * - Does not attach directly to map; use data with your map manually.
 * const place = new google.maps.places.Place({ id: PLACE_ID });
 * await place.fetchFields({ fields: ["displayName", "location"] });
 * map.setCenter(place.location);
 * new google.maps.marker.AdvancedMarkerElement({ map, position: place.location });
 *
 * -------------------------------
 * 🧭 GEOCODER (from `geocoding` library)
 * - Standalone service; manually apply results to map.
 * const geocoder = new google.maps.Geocoder();
 * geocoder.geocode({ address: "New York" }, (results, status) => {
 *   if (status === "OK" && results[0]) {
 *     map.setCenter(results[0].geometry.location);
 *     new google.maps.marker.AdvancedMarkerElement({
 *       map,
 *       position: results[0].geometry.location,
 *     });
 *   }
 * });
 *
 * -------------------------------
 * 📐 GEOMETRY (from `geometry` library)
 * - Pure utility functions; not attached to map.
 * const dist = google.maps.geometry.spherical.computeDistanceBetween(p1, p2);
 *
 * -------------------------------
 * 🛣️ ROUTES (from `routes` library)
 * - Combines DirectionsService (standalone) + DirectionsRenderer (map-attached)
 * const directionsService = new google.maps.DirectionsService();
 * const directionsRenderer = new google.maps.DirectionsRenderer({ map });
 * directionsService.route(
 *   { origin, destination, travelMode: "DRIVING" },
 *   (res, status) => status === "OK" && directionsRenderer.setDirections(res)
 * );
 *
 * -------------------------------
 * 🌦️ MAP LAYERS (attach directly to map)
 * - new google.maps.TrafficLayer().setMap(map);
 * - new google.maps.TransitLayer().setMap(map);
 * - new google.maps.BicyclingLayer().setMap(map);
 *
 * -------------------------------
 * ✅ SUMMARY
 * - “map-attached” → AdvancedMarkerElement, DirectionsRenderer, Layers.
 * - “standalone” → Geocoder, DirectionsService, DistanceMatrixService, ElevationService.
 * - “data-only” → Place, Geometry utilities.
 */

"use client";

/// <reference types="google.maps" />

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

declare global {
  interface Window {
    google?: typeof google;
  }
}

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const MAPS_PROXY_URL =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_PROXY_URL ||
  "https://forge.butterfly-effect.dev/v1/maps/proxy";
const DEFAULT_CENTER: google.maps.LatLngLiteral = {
  lat: 37.7749,
  lng: -122.4194,
};

let mapScriptPromise: Promise<void> | undefined;

function loadMapScript(): Promise<void> {
  if (window.google?.maps) {
    return Promise.resolve();
  }

  if (!API_KEY) {
    return Promise.reject(
      new Error("Set NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to enable the map.")
    );
  }

  if (mapScriptPromise) {
    return mapScriptPromise;
  }

  mapScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    const scriptUrl = new URL(
      `${MAPS_PROXY_URL.replace(/\/+$/, "")}/maps/api/js`
    );
    scriptUrl.searchParams.set("key", API_KEY);
    scriptUrl.searchParams.set("v", "weekly");
    scriptUrl.searchParams.set(
      "libraries",
      "marker,places,geocoding,geometry"
    );
    script.src = scriptUrl.toString();
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => {
      script.remove();
      if (window.google?.maps) {
        resolve();
      } else {
        mapScriptPromise = undefined;
        reject(new Error("Google Maps loaded without initializing its API."));
      }
    };
    script.onerror = () => {
      script.remove();
      mapScriptPromise = undefined;
      reject(new Error("Failed to load the Google Maps script."));
    };
    document.head.appendChild(script);
  });

  return mapScriptPromise;
}

interface MapViewProps {
  className?: string;
  initialCenter?: google.maps.LatLngLiteral;
  initialZoom?: number;
  onMapReady?: (map: google.maps.Map) => void | (() => void);
}

export function MapView({
  className,
  initialCenter = DEFAULT_CENTER,
  initialZoom = 12,
  onMapReady,
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<google.maps.Map | null>(null);
  const mapCleanup = useRef<(() => void) | undefined>(undefined);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    const initializeMap = async () => {
      await loadMapScript();
      if (cancelled || !mapContainer.current) {
        return;
      }

      const maps = window.google?.maps;
      if (!maps) {
        throw new Error("Google Maps is not available in the browser.");
      }

      map.current = new maps.Map(mapContainer.current, {
        zoom: initialZoom,
        center: initialCenter,
        mapTypeControl: true,
        fullscreenControl: true,
        zoomControl: true,
        streetViewControl: true,
        mapId: "DEMO_MAP_ID",
      });
      mapCleanup.current = onMapReady?.(map.current) || undefined;
    };

    void initializeMap().catch((error: unknown) => {
      console.error("Unable to initialize the Google Map.", error);
      if (!cancelled) {
        setLoadError(
          error instanceof Error ? error.message : "Unable to initialize the map."
        );
      }
    });

    return () => {
      cancelled = true;
      mapCleanup.current?.();
      mapCleanup.current = undefined;
      map.current = null;
    };
  }, [initialCenter, initialZoom, onMapReady]);

  return (
    <div
      ref={mapContainer}
      className={cn("relative h-[500px] w-full", className)}
    >
      {loadError && (
        <div
          role="alert"
          className="absolute inset-0 flex items-center justify-center rounded-lg bg-muted p-6 text-center text-sm text-muted-foreground"
        >
          {loadError}
        </div>
      )}
    </div>
  );
}
