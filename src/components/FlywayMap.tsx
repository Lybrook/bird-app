import React, { useCallback, useRef } from "react";
import { MapView } from "@/components/Map";
import { Card, CardContent } from "@/components/ui/card";
import { Compass, Globe, Info } from "lucide-react";

export default function FlywayMap() {
  const mapRef = useRef<google.maps.Map | null>(null);
  const markersRef = useRef<google.maps.Marker[]>([]);
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  const handleMapReady = useCallback((map: google.maps.Map) => {
    mapRef.current = map;

    // Set map style to match the warm editorial, nature-themed design (light warm colors, soft greens)
    const natureStyledMapType = new google.maps.StyledMapType(
      [
        {
          elementType: "geometry",
          stylers: [{ color: "#ebe3cd" }], // Warm cream background
        },
        {
          elementType: "labels.text.fill",
          stylers: [{ color: "#523735" }],
        },
        {
          elementType: "labels.text.stroke",
          stylers: [{ color: "#f5f1e6" }],
        },
        {
          featureType: "administrative",
          elementType: "geometry.stroke",
          stylers: [{ color: "#c9b2a6" }],
        },
        {
          featureType: "landscape.natural",
          elementType: "geometry",
          stylers: [{ color: "#dfd2ae" }], // Muted natural land
        },
        {
          featureType: "water",
          elementType: "geometry.fill",
          stylers: [{ color: "#b9d3c2" }], // Soft sage water
        },
        {
          featureType: "water",
          elementType: "labels.text.fill",
          stylers: [{ color: "#92998d" }],
        },
      ],
      { name: "Nature Styled Map" }
    );

    map.mapTypes.set("nature_styled", natureStyledMapType);
    map.setMapTypeId("nature_styled");

    // Center map to show both Europe and East Africa clearly
    map.setCenter({ lat: 25.0, lng: 20.0 });
    map.setZoom(3.5);

    // Key Flyway Sighting Points
    const flywayHubs = [
      {
        name: "London, UK (Summer Grounds)",
        lat: 51.5074,
        lng: -0.1278,
        desc: "Nesting grounds for Common Swifts & Swallows before their long autumn journey.",
      },
      {
        name: "Munich, Germany (Transit Point)",
        lat: 48.1351,
        lng: 11.582,
        desc: "Rest stop for migrating warblers traversing Central Europe.",
      },
      {
        name: "Rome, Italy (Mediterranean Crossing)",
        lat: 41.9028,
        lng: 12.4964,
        desc: "Staging area for waterbirds before they cross the Mediterranean Sea.",
      },
      {
        name: "Lake Nakuru, Kenya (Wintering Haven)",
        lat: -0.3726,
        lng: 36.0797,
        desc: "Rift Valley alkaline lake hosting millions of flamingos and European migrants.",
      },
      {
        name: "Mida Creek, Kenya (Coastal Flyway)",
        lat: -3.3333,
        lng: 40.0,
        desc: "UNESCO Biosphere Reserve and crucial coastal wintering ground for Palearctic waders.",
      },
    ];

    // Clear any previous markers/lines
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    // Add elegant custom markers
    flywayHubs.forEach((hub, idx) => {
      // Use custom colored dots matching our tricolor theme (Sage Green for Europe, Rose for Kenya)
      const color = idx >= 3 ? "#556B2F" : "#E8C3C3"; // Sage Green for Kenya hubs, Blush Rose for Europe

      const marker = new google.maps.Marker({
        position: { lat: hub.lat, lng: hub.lng },
        map: map,
        title: hub.name,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          fillColor: color,
          fillOpacity: 0.9,
          strokeColor: "#ffffff",
          strokeWeight: 2,
          scale: 8,
        },
      });

      const infoWindow = new google.maps.InfoWindow({
        content: `
          <div style="font-family: 'Plus Jakarta Sans', sans-serif; padding: 6px; max-width: 220px;">
            <h4 style="font-family: 'Cormorant Garamond', serif; font-size: 16px; font-weight: bold; margin: 0 0 4px 0; color: #556B2F;">${hub.name}</h4>
            <p style="font-size: 12px; margin: 0; color: #4A4A4A; line-height: 1.4;">${hub.desc}</p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });

    // Draw Flyway Path lines
    const flywayCoordinates = flywayHubs.map(h => ({ lat: h.lat, lng: h.lng }));

    // Polyline connecting Europe to Kenya
    const flywayPath = new google.maps.Polyline({
      path: flywayCoordinates,
      geodesic: true,
      strokeColor: "#D4AF37", // Sunlit Ochre Gold
      strokeOpacity: 0.7,
      strokeWeight: 3,
      map: map,
    });

    // Add moving dashes animation to simulate bird migration flight
    let count = 0;
    const interval = setInterval(() => {
      count = (count + 1) % 200;
      const icons = flywayPath.get("icons");
      if (icons) {
        icons[0].offset = count / 2 + "%";
        flywayPath.set("icons", icons);
      }
    }, 40);

    flywayPath.set("icons", [
      {
        icon: {
          path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
          scale: 2,
          strokeColor: "#556B2F",
          fillColor: "#556B2F",
          fillOpacity: 1,
        },
        offset: "0%",
        repeat: "100px",
      },
    ]);

    polylinesRef.current.push(flywayPath);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl md:text-4xl font-serif text-primary font-bold flex items-center gap-2">
            <Globe className="h-7 w-7 text-accent animate-spin-slow" />
            The Great African-Eurasian Flyway
          </h2>
          <p className="text-sm md:text-base text-muted-foreground font-sans mt-1">
            Visualizing the seasonal migration corridor of over 170 species
            flying from European summer nesting grounds to wintering havens in
            Kenya.
          </p>
        </div>
      </div>

      <Card className="overflow-hidden rounded-3xl border-secondary/15 bg-card text-card-foreground editorial-shadow">
        <CardContent className="p-0 relative">
          {/* Map Container */}
          <div className="h-[450px] md:h-[550px] w-full relative z-10">
            <MapView onMapReady={handleMapReady} />
          </div>

          {/* Elegant Floating Map Legend Card */}
          <div className="absolute bottom-4 left-4 right-4 md:right-auto md:max-w-xs bg-background/90 backdrop-blur-md border border-secondary/15 p-4 rounded-2xl shadow-lg z-20 space-y-3">
            <div className="flex items-center gap-2 text-primary">
              <Compass className="h-5 w-5 text-accent animate-pulse" />
              <h3 className="font-serif font-semibold text-lg">
                Flyway Legend
              </h3>
            </div>

            <div className="space-y-2 text-xs md:text-sm font-sans">
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-secondary border border-white shrink-0" />
                <span className="text-foreground/80">
                  European Summer Grounds
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-3 w-3 rounded-full bg-primary border border-white shrink-0" />
                <span className="text-foreground/80">
                  Kenyan Wintering Havens
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="h-0.5 w-6 bg-accent border-t border-dashed shrink-0" />
                <span className="text-foreground/80">
                  Active Migration Path
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-border/60 flex gap-1.5 items-start text-[11px] text-muted-foreground leading-relaxed">
              <Info className="h-3.5 w-3.5 text-primary shrink-0 mt-0.5" />
              <span>
                Click on any node to view real & hypothetical migration logs.
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
