"use client";

import { useMemo, useEffect, useState } from "react";
import { useParkingStore } from "@/lib/store";
import type { SpotDefinition, Point } from "@/lib/types";

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
  const centerX =
    spot.polygon.reduce((sum, p) => sum + p.x * SVG_W, 0) / spot.polygon.length;
  const centerY =
    spot.polygon.reduce((sum, p) => sum + p.y * SVG_H, 0) / spot.polygon.length;

  const squareSize = 60;

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
      aria-label={`Spot ${spot.spot_id}: ${isRecommended ? "Recommended" : occupied ? "Occupied" : "Empty"
        }`}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
    >
      {isRecommended && (
        <rect
          x={centerX - squareSize / 2 - 4}
          y={centerY - squareSize / 2 - 4}
          width={squareSize + 8}
          height={squareSize + 8}
          rx="4"
          fill="none"
          stroke="hsl(210 90% 56% / 0.4)"
          strokeWidth="8"
          className="animate-pulse"
        />
      )}
      <rect
        x={centerX - squareSize / 2}
        y={centerY - squareSize / 2}
        width={squareSize}
        height={squareSize}
        rx="4"
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={isRecommended ? 3 : 2}
        className="transition-all duration-300"
      />
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

// -------------------- BLUE DOT ANIMATION --------------------
function MovingDot({ lineY }: { lineY: number }) {
  const [x, setX] = useState(0);

  useEffect(() => {
    let id: number;
    let lastTime: number | null = null;
    const speedPerSecond = 100; // pixels per second
    const targetX = SVG_W * 0.7; // stop at 70% of the line

    const move = (time: number) => {
      if (lastTime !== null) {
        const delta = (time - lastTime) / 1000; // seconds elapsed
        setX((prev) => {
          const next = prev + speedPerSecond * delta;
          return next >= targetX ? targetX : next;
        });
      }
      lastTime = time;
      if (x < targetX) {
        id = requestAnimationFrame(move);
      }
    };

    id = requestAnimationFrame(move);
    return () => cancelAnimationFrame(id);
  }, []);

  return <circle cx={x} cy={lineY} r={10} fill="blue" />;
}

// -------------------- PARKING LOT VIEW --------------------
export function ParkingLotView({
  onSpotClick,
  recommendedSpotId,
  pathPoints,
  entrancePoint,
}: ParkingLotViewProps) {
  const { state } = useParkingStore();
  const lot = state.lot;
  const spotStates = state.spotStates;
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

  // -------------------- LINE SETTINGS --------------------
  const rotation = -6;
  const yIntercept = SVG_H / 2.4;

  return (
    <div className="relative h-full w-full overflow-hidden rounded-lg border border-border bg-[hsl(220,20%,5%)]">
      <svg
        viewBox={`0 0 ${SVG_W} ${SVG_H}`}
        className="h-full w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path
              d="M 50 0 L 0 0 0 50"
              fill="none"
              stroke="hsl(220 14% 12%)"
              strokeWidth="0.5"
            />
          </pattern>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="hsl(210 90% 56%)" />
          </marker>
        </defs>

        <rect width={SVG_W} height={SVG_H} fill="url(#grid)" />

        {/* The moving blue dot */}
        <MovingDot lineY={yIntercept} />

        {/* Horizontal line */}
        <line
          x1="0"
          y1={yIntercept}
          x2={SVG_W}
          y2={yIntercept}
          stroke="hsl(45 90% 55%)"
          strokeWidth="2"
          strokeDasharray="10 5"
          transform={`rotate(${rotation} ${SVG_W / 2} ${yIntercept})`}
          className="transition-all duration-300"
        />

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
      </svg>
    </div>
  );
}
