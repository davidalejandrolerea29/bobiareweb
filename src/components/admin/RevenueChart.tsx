import React, { useId, useMemo, useState } from 'react';
import { RevenueBucket } from '../../services/statsApi';

interface RevenueChartProps {
  buckets: RevenueBucket[];
}

// Paleta de estado (no categórica a propósito — "acreditado"/"no
// acreditado" es un estado de cobro, no una serie arbitraria). Mismos
// roles que usa el resto del panel para pagado/pendiente.
const COLOR_ACCREDITED = '#0ca30c';
const COLOR_PENDING = '#fab219';

const BAR_MAX_THICKNESS = 24;
const SEGMENT_GAP = 2;
const CHART_HEIGHT = 240;
const PADDING_LEFT = 56;
const PADDING_RIGHT = 12;
const PADDING_TOP = 16;
const PADDING_BOTTOM = 28;

const formatMoney = (value: number) =>
  new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS', maximumFractionDigits: 0 }).format(value);

const formatCompact = (value: number) =>
  new Intl.NumberFormat('es-AR', { notation: 'compact', maximumFractionDigits: 1 }).format(value);

// Techo "lindo" para el eje Y (redondea hacia arriba a 1/2/5 * 10^n) — así
// las líneas de grilla caen en números redondos en vez de un máximo crudo.
const niceCeiling = (value: number): number => {
  if (value <= 0) return 10;
  const magnitude = 10 ** Math.floor(Math.log10(value));
  const normalized = value / magnitude;
  const step = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
  return step * magnitude;
};

const RevenueChart: React.FC<RevenueChartProps> = ({ buckets }) => {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const maxTotal = Math.max(1, ...buckets.map((b) => b.accredited + b.pending));
  const yMax = niceCeiling(maxTotal);
  const yTicks = [0, yMax / 4, yMax / 2, (yMax * 3) / 4, yMax];

  const plotWidth = 1000; // viewBox unit — escala con el contenedor via width=100%
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const bandWidth = buckets.length > 0 ? (plotWidth - PADDING_LEFT - PADDING_RIGHT) / buckets.length : 0;
  const barWidth = Math.min(BAR_MAX_THICKNESS, bandWidth * 0.6);

  // Con 30 buckets (vista por día) no entran todas las etiquetas sin
  // pisarse — se muestra 1 de cada N en vez de rotar o recortar texto.
  const labelStride = buckets.length > 16 ? Math.ceil(buckets.length / 10) : 1;

  const yToPixel = (value: number) => PADDING_TOP + plotHeight - (value / yMax) * plotHeight;

  const hovered = hoverIndex !== null ? buckets[hoverIndex] : null;

  const tooltipData = useMemo(() => {
    if (!hovered) return null;
    const total = hovered.accredited + hovered.pending;
    return { ...hovered, total };
  }, [hovered]);

  return (
    <div className="relative">
      <div className="mb-3 flex items-center gap-4 text-xs text-neutral-600">
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLOR_ACCREDITED }} aria-hidden="true" />
          Acreditado
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: COLOR_PENDING }} aria-hidden="true" />
          No acreditado
        </span>
      </div>

      <svg
        viewBox={`0 0 ${plotWidth} ${CHART_HEIGHT}`}
        width="100%"
        height={CHART_HEIGHT}
        role="img"
        aria-label="Ingresos por período, acreditados y no acreditados"
        preserveAspectRatio="none"
      >
        <defs>
          <clipPath id={gradientId}>
            <rect x="0" y="0" width={plotWidth} height={CHART_HEIGHT} />
          </clipPath>
        </defs>

        {/* Gridlines — hairline, recesivas, en números redondos */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={PADDING_LEFT}
              x2={plotWidth - PADDING_RIGHT}
              y1={yToPixel(tick)}
              y2={yToPixel(tick)}
              stroke="#e1e0d9"
              strokeWidth={1}
            />
            <text
              x={PADDING_LEFT - 8}
              y={yToPixel(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={11}
              fill="#898781"
            >
              {formatCompact(tick)}
            </text>
          </g>
        ))}

        {/* Baseline */}
        <line
          x1={PADDING_LEFT}
          x2={plotWidth - PADDING_RIGHT}
          y1={yToPixel(0)}
          y2={yToPixel(0)}
          stroke="#c3c2b7"
          strokeWidth={1}
        />

        {buckets.map((bucket, index) => {
          const bandX = PADDING_LEFT + index * bandWidth;
          const barX = bandX + (bandWidth - barWidth) / 2;

          const accreditedHeight = (bucket.accredited / yMax) * plotHeight;
          const pendingHeight = (bucket.pending / yMax) * plotHeight;
          const hasPending = bucket.pending > 0;
          const hasAccredited = bucket.accredited > 0;

          const accreditedY = yToPixel(0) - accreditedHeight;
          const pendingY = accreditedY - (hasAccredited && hasPending ? SEGMENT_GAP : 0) - pendingHeight;

          const isHovered = hoverIndex === index;

          return (
            <g
              key={bucket.key}
              tabIndex={0}
              role="button"
              aria-label={`${bucket.label}: acreditado ${formatMoney(bucket.accredited)}, no acreditado ${formatMoney(bucket.pending)}`}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onFocus={() => setHoverIndex(index)}
              onBlur={() => setHoverIndex(null)}
              style={{ cursor: 'pointer', outline: 'none' }}
            >
              {/* Hit area más ancha que la barra, para que el hover no exija puntería */}
              <rect x={bandX} y={PADDING_TOP} width={bandWidth} height={plotHeight} fill="transparent" />

              {hasAccredited && (
                <rect
                  x={barX}
                  y={accreditedY}
                  width={barWidth}
                  height={Math.max(accreditedHeight, 1)}
                  fill={COLOR_ACCREDITED}
                  opacity={isHovered ? 1 : 0.9}
                  rx={hasPending ? 0 : 4}
                  ry={hasPending ? 0 : 4}
                />
              )}
              {hasPending && (
                <rect
                  x={barX}
                  y={pendingY}
                  width={barWidth}
                  height={Math.max(pendingHeight, 1)}
                  fill={COLOR_PENDING}
                  opacity={isHovered ? 1 : 0.9}
                  rx={4}
                  ry={4}
                />
              )}

              {index % labelStride === 0 && (
                <text
                  x={bandX + bandWidth / 2}
                  y={CHART_HEIGHT - 8}
                  textAnchor="middle"
                  fontSize={11}
                  fill="#898781"
                >
                  {bucket.label}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {tooltipData && (
        <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 rounded-md border border-neutral-200 bg-white px-3 py-2 text-xs shadow-lg">
          <p className="mb-1 font-semibold text-neutral-800">{tooltipData.label}</p>
          <p className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: COLOR_ACCREDITED }} />
              Acreditado
            </span>
            <strong className="text-neutral-900">{formatMoney(tooltipData.accredited)}</strong>
          </p>
          <p className="flex items-center justify-between gap-4">
            <span className="flex items-center gap-1.5 text-neutral-600">
              <span className="inline-block h-2 w-2 rounded-sm" style={{ backgroundColor: COLOR_PENDING }} />
              No acreditado
            </span>
            <strong className="text-neutral-900">{formatMoney(tooltipData.pending)}</strong>
          </p>
          <p className="mt-1 border-t border-neutral-100 pt-1 text-neutral-500">
            {tooltipData.order_count} pedido{tooltipData.order_count === 1 ? '' : 's'}
          </p>
        </div>
      )}
    </div>
  );
};

export default RevenueChart;
