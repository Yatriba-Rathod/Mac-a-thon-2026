"use client";

import { useMemo } from "react";
import { useParkingStore } from "@/lib/store";
import type { SpotDefinition, Point } from "@/lib/types";
import { DEMO_LOT, DEMO_SPOT_STATES } from "@/lib/mock-data";

interface ParkingLotViewProps {
  onSpotClick: (spotId: string) => void;
  recommendedSpotId?: string | null;
  pathPoints?: Point[];
  entrancePoint?: Point | null;
}

const SVG_W = 1000;
const SVG_H = 600;

function toSvg(p: Point): { x: number; y: number } {
  return { x: p.x * SVG_W, y: p.y * SVG_H };
}

function SpotPolygon({
  spot,
  occupied,
  isRecommended,
  onClick,
}: {
  spot: SpotDefinition;
  occupied: boolean;
  isRecommended: boolean;
  onClick: () => void;
}) {
  const points = spot.polygon
    .map((p) => `${p.x * SVG_W},${p.y * SVG_H}`)
    .join(" ");

  const centerX =
    spot.polygon.reduce((sum, p) => sum + p.x * SVG_W, 0) / spot.polygon.length;
  const centerY =
    spot.polygon.reduce((sum, p) => sum + p.y * SVG_H, 0) / spot.polygon.length;

  const fillColor = isRecommended
    ? "hsl(210 90% 56% / 0.3)"
    : occupied
      ? "hsl(0 72% 51% / 0.25)"
      : "hsl(142 60% 45% / 0.2)";

  const strokeColor = isRecommended
    ? "hsl(210 90% 56%)"
    : occupied
      ? "hsl(0 72% 51%)"
      : "hsl(142 60% 45%)";

  const textColor = isRecommended
    ? "hsl(210 90% 80%)"
    : occupied
      ? "hsl(0 72% 80%)"
      : "hsl(142 60% 75%)";

  return (
    <g
      className="cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      aria-label={`Spot ${spot.spot_id}: ${isRecommended ? "Recommended" : occupied ? "Occupied" : "Empty"}`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {/* Glow filter for recommended spot */}
      {isRecommended && (
        <polygon
          points={points}
          fill="none"
          stroke="hsl(210 90% 56% / 0.4)"
          strokeWidth="8"
          className="animate-pulse"
        />
      )}
      <polygon
        points={points}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isRecommended ? 3 : 2}
        className="transition-all duration-300"
      />
      {/* Car icon for occupied spots */}
      {occupied && !isRecommended && (
        <rect
          x={centerX - 16}
          y={centerY - 8}
          width="32"
          height="16"
          rx="4"
          fill="hsl(0 72% 51% / 0.5)"
          className="transition-all duration-300"
        />
      )}
      {/* Type badge for special spots */}
      {spot.type && spot.type !== "standard" && (
        <text
          x={centerX}
          y={centerY - 18}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={isRecommended ? "hsl(210 90% 75%)" : "hsl(215 15% 55%)"}
          fontSize="9"
          fontFamily="var(--font-jetbrains-mono), monospace"
          className="pointer-events-none select-none uppercase"
        >
          {spot.type === "accessible" ? "ACC" : "EV"}
        </text>
      )}
      <text
        x={centerX}
        y={centerY + (occupied && !isRecommended ? 20 : 5)}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={textColor}
        fontSize="14"
        fontWeight="600"
        fontFamily="var(--font-jetbrains-mono), monospace"
        className="pointer-events-none select-none"
      >
        {spot.spot_id}
      </text>
    </g>
  );
}

export function ParkingLotView({
  onSpotClick,
  recommendedSpotId,
  pathPoints,
  entrancePoint,
}: ParkingLotViewProps) {
  const { state } = useParkingStore();

  // TODO: Remove this line to use real data from backend
  const useDummyData = true;

  const lot = useDummyData ? DEMO_LOT : state.lot;
  const spotStates = useDummyData ? DEMO_SPOT_STATES : state.spotStates;

  const spots = useMemo(() => lot?.spots ?? [], [lot]);

  if (!lot) {
    return (
      <div className="flex h-full items-center justify-center rounded-lg border border-border bg-card p-8 text-center">
        <div>
          <p className="text-sm font-medium text-foreground">
            {state.error ?? "No lot data available."}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Configure your backend connection in Settings.
          </p>
        </div>
      </div>
    );
  }

  const pathPolyline = pathPoints
    ?.map((p) => {
      const s = toSvg(p);
      return `${s.x},${s.y}`;
    })
    .join(" ");

  const entranceSvg = entrancePoint ? toSvg(entrancePoint) : null;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-[hsl(220,20%,5%)]">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern
            id="grid"
            width="50"
            height="50"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="hsl(220 14% 12%)"
              strokeWidth="0.5"
            />
          </pattern>
          <marker
            id="arrowhead"
            markerWidth="8"
            markerHeight="6"
            refX="8"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 8 3, 0 6" fill="hsl(210 90% 56%)" />
          </marker>
        </defs>
        <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

        {/* Road markings */}
        <line
          x1="0"
          y1="195"
          x2={SVG_W}
          y2="195"
          stroke="hsl(45 90% 55% / 0.3)"
          strokeWidth="2"
          strokeDasharray="20 10"
        />
        <line
          x1="0"
          y1="390"
          x2={SVG_W}
          y2="390"
          stroke="hsl(45 90% 55% / 0.3)"
          strokeWidth="2"
          strokeDasharray="20 10"
        />

        {/* Parking labels */}
        <text
          x="960"
          y="100"
          fill="hsl(215 15% 35%)"
          fontSize="12"
          fontFamily="var(--font-jetbrains-mono), monospace"
          textAnchor="end"
        >
          ROW A
        </text>
        <text
          x="960"
          y="300"
          fill="hsl(215 15% 35%)"
          fontSize="12"
          fontFamily="var(--font-jetbrains-mono), monospace"
          textAnchor="end"
        >
          ROW B
        </text>
        <text
          x="960"
          y="490"
          fill="hsl(215 15% 35%)"
          fontSize="12"
          fontFamily="var(--font-jetbrains-mono), monospace"
          textAnchor="end"
        >
          ROW C
        </text>

        {/* Spots */}
        {spots.map((spot) => {
          const spotState = spotStates.get(spot.spot_id);
          return (
            <SpotPolygon
              key={spot.spot_id}
              spot={spot}
              occupied={spotState?.occupied ?? false}
              isRecommended={spot.spot_id === recommendedSpotId}
              onClick={() => onSpotClick(spot.spot_id)}
            />
          );
        })}

        {/* Walking path overlay */}
        {pathPolyline && (
          <polyline
            points={pathPolyline}
            fill="none"
            stroke="hsl(210 90% 56%)"
            strokeWidth="3"
            strokeDasharray="10 6"
            strokeLinecap="round"
            strokeLinejoin="round"
            markerEnd="url(#arrowhead)"
            className="transition-all duration-500"
          />
        )}
      </svg>
    </div>
  );
}
