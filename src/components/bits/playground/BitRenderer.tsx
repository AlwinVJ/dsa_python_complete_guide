import { motion } from "framer-motion";
import { BitFrame } from "./types";

interface BitRendererProps {
  frame: BitFrame | undefined;
}

export function BitRenderer({ frame }: BitRendererProps) {
  const width = 520;
  const height = 280;

  if (!frame) {
    return (
      <div className="card-surface p-4 flex items-center justify-center h-[280px] text-muted-foreground text-sm">
        Select operation and press Play to start visualization.
      </div>
    );
  }

  const isBitwise = frame.kind === "bitwise";
  const isShift = frame.kind === "shift";
  const isModify = frame.kind === "modify";
  const isPopcount = frame.kind === "popcount";
  const isPower2 = frame.kind === "power2";
  const isMask = frame.kind === "mask";
  const isSubsets = frame.kind === "subsets";

  const boxSize = 30;
  const startX = 140;

  const renderBitRegister = (
    label: string,
    bits: number[],
    y: number,
    decimalLabel?: string,
    activeIdx?: number,
    highlighted?: number[],
    isMaskRow?: boolean
  ) => {
    return (
      <g transform={`translate(0, ${y})`}>
        {/* Label */}
        <text
          x={10}
          y={20}
          fontSize={10}
          fontWeight={700}
          className="fill-muted-foreground uppercase tracking-wider"
        >
          {label}
        </text>

        {/* Bits row */}
        {bits.map((bit, idx) => {
          const bitPos = bits.length - 1 - idx;
          const isActive = activeIdx === bitPos;
          const isHighlighted = highlighted && highlighted.includes(idx);

          // styling colors
          let fillVal = "hsl(var(--card))";
          let strokeVal = "hsl(var(--border))";
          let textVal = "hsl(var(--foreground))";
          let strokeWidthVal = 1;

          if (bit === 1) {
            fillVal = isMaskRow
              ? "color-mix(in oklab, rgb(139 92 246) 20%, var(--card))"
              : "color-mix(in oklab, var(--brand) 20%, var(--card))";
            strokeVal = isMaskRow ? "rgb(139 92 246)" : "var(--brand)";
            textVal = isMaskRow ? "rgb(139 92 246)" : "var(--brand)";
            strokeWidthVal = 1.5;
          }

          if (isActive) {
            strokeVal = "rgb(245 158 11)"; // Amber active outline
            strokeWidthVal = 2.5;
          } else if (isHighlighted) {
            fillVal = "color-mix(in oklab, rgb(16 185 129) 15%, var(--card))";
            strokeVal = "rgb(16 185 129)";
            textVal = "rgb(16 185 129)";
            strokeWidthVal = 1.5;
          }

          return (
            <g key={`${label}-${idx}`} transform={`translate(${startX + idx * (boxSize + 4)}, 0)`}>
              <rect
                width={boxSize}
                height={boxSize}
                rx={4}
                fill={fillVal}
                stroke={strokeVal}
                strokeWidth={strokeWidthVal}
                className="transition-all duration-150"
              />
              <text
                x={boxSize / 2}
                y={boxSize / 2 + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight={700}
                fill={textVal}
              >
                {bit}
              </text>
              <text
                x={boxSize / 2}
                y={boxSize + 9}
                textAnchor="middle"
                fontSize={6.5}
                className="fill-muted-foreground/50 font-mono"
              >
                {bitPos}
              </text>
            </g>
          );
        })}

        {/* Decimal value badge */}
        {decimalLabel !== undefined && (
          <g transform={`translate(${startX + bits.length * (boxSize + 4) + 15}, 4)`}>
            <rect
              width={45}
              height={22}
              rx={4}
              fill="hsl(var(--muted))"
              stroke="hsl(var(--border))"
              strokeWidth={1}
            />
            <text
              x={22.5}
              y={14}
              textAnchor="middle"
              fontSize={10}
              fontWeight={700}
              className="fill-foreground font-mono"
            >
              {decimalLabel}
            </text>
          </g>
        )}
      </g>
    );
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto rounded-md border border-border bg-background"
    >
      <defs>
        {/* Drop shadow */}
        <filter id="box-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" floodOpacity="0.08" floodColor="#000" />
        </filter>
      </defs>

      {/* RENDER FOR TYPE 1: Standard double-input operators (Bitwise, Mask) */}
      {(isBitwise || isMask) && frame.bitsB && (
        <g>
          {renderBitRegister(
            isMask ? "Set Mask A" : "Value A",
            frame.bitsA,
            35,
            String(frame.valA),
            frame.activeBitIdx,
            []
          )}

          {/* Operation symbol indicator */}
          <g transform={`translate(${startX - 28}, 80)`}>
            <circle cx={10} cy={10} r={10} fill="hsl(var(--muted))" className="stroke-border" strokeWidth={1} />
            <text x={10} y={13.5} textAnchor="middle" fontSize={10} fontWeight={700} className="fill-muted-foreground">
              {frame.operationName === "AND" || frame.operationName === "INTERSECT"
                ? "&"
                : frame.operationName === "OR" || frame.operationName === "UNION"
                ? "|"
                : frame.operationName === "XOR"
                ? "^"
                : frame.operationName === "DIFFERENCE"
                ? "-"
                : "~"}
            </text>
          </g>

          {renderBitRegister(
            isMask ? "Set Mask B" : "Value B",
            frame.bitsB,
            85,
            String(frame.valB),
            frame.activeBitIdx,
            []
          )}

          <line x1={20} y1={130} x2={width - 20} y2={130} className="stroke-border/40" strokeWidth={1} strokeDasharray="3,3" />

          {renderBitRegister(
            "Result",
            frame.bitsResult,
            145,
            String(frame.resultVal),
            -1,
            frame.highlightIndices
          )}
        </g>
      )}

      {/* RENDER FOR TYPE 2: Single value with mask transitions (Modify - Set/Clear/Toggle) */}
      {isModify && frame.bitsMask && (
        <g>
          {renderBitRegister("Input Value", frame.bitsA, 35, String(frame.valA), frame.activeBitIdx, [])}

          {/* Operation type indicator */}
          <text x={startX - 15} y={97} fontSize={10} fontWeight={700} className="fill-muted-foreground font-mono">
            {frame.operationName === "GET"
              ? ">>"
              : frame.operationName === "SET"
              ? "|"
              : frame.operationName === "CLEAR"
              ? "&"
              : "^"}
          </text>

          {renderBitRegister(
            frame.operationName === "CLEAR" ? "~Mask (Inverted)" : "Mask (1 << i)",
            frame.bitsMask,
            80,
            undefined,
            frame.activeBitIdx,
            [],
            true
          )}

          <line x1={20} y1={125} x2={width - 20} y2={125} className="stroke-border/40" strokeWidth={1} strokeDasharray="3,3" />

          {renderBitRegister(
            frame.operationName === "GET" ? "Result Bit" : "Result Value",
            frame.bitsResult,
            140,
            String(frame.resultVal),
            -1,
            frame.highlightIndices
          )}
        </g>
      )}

      {/* RENDER FOR TYPE 3: Shifts (Left Shift & Right Shift) */}
      {isShift && (
        <g>
          {renderBitRegister("Input Value", frame.bitsA, 50, String(frame.valA), -1, [])}

          {/* Shift direction symbol */}
          <g transform={`translate(${startX - 28}, 102)`}>
            <circle cx={10} cy={10} r={10} fill="hsl(var(--muted))" className="stroke-border" strokeWidth={1} />
            <text x={10} y={13.5} textAnchor="middle" fontSize={8} fontWeight={700} className="fill-muted-foreground">
              {frame.operationName === "LSHIFT" ? "<<" : ">>"}
            </text>
          </g>

          {renderBitRegister("Shift Result", frame.bitsResult, 115, String(frame.resultVal), -1, [])}

          <g transform={`translate(${startX}, 180)`}>
            <rect width={width - startX * 2} height={40} rx={4} fill="hsl(var(--card))" className="stroke-border" strokeWidth={1} />
            <text x={15} y={23} fontSize={10} className="fill-muted-foreground font-mono">
              Shift amount: <tspan className="fill-foreground font-bold">{frame.valB}</tspan> positions
            </text>
            <text x={width - startX * 2 - 140} y={23} fontSize={10} className="fill-muted-foreground font-mono">
              Math: {frame.operationName === "LSHIFT" ? "× 2^" : "÷ 2^"}
              {frame.valB} ({1 << (frame.valB ?? 0)})
            </text>
          </g>
        </g>
      )}

      {/* RENDER FOR TYPE 4: Kernighan Popcount & Power of Two Checker */}
      {(isPopcount || isPower2) && (
        <g>
          {renderBitRegister("Value n", frame.bitsA, 40, String(frame.valA), -1, [])}

          {frame.bitsMask && (
            <>
              <text x={startX - 15} y={105} fontSize={10} fontWeight={700} className="fill-muted-foreground font-mono">
                &
              </text>
              {renderBitRegister("Value n - 1", frame.bitsMask, 85, String(Math.max(0, frame.resultVal)), -1, [], true)}
            </>
          )}

          <line x1={20} y1={130} x2={width - 20} y2={130} className="stroke-border/40" strokeWidth={1} strokeDasharray="3,3" />

          {renderBitRegister(
            "AND Result",
            frame.bitsResult,
            145,
            String(frame.resultVal),
            -1,
            []
          )}

          {/* popcount status */}
          {isPopcount && (
            <g transform={`translate(${startX}, 205)`}>
              <rect width={150} height={25} rx={4} fill="var(--brand)/10" stroke="var(--brand)" strokeWidth={1} />
              <text x={75} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="var(--brand)">
                Accumulated popcount: {frame.setBitsCount}
              </text>
            </g>
          )}

          {/* power of two status */}
          {isPower2 && frame.isPower2 !== undefined && (
            <g transform={`translate(${startX}, 205)`}>
              {frame.isPower2 ? (
                <>
                  <rect width={210} height={26} rx={4} fill="rgb(16 185 129)/10" stroke="rgb(16 185 129)" strokeWidth={1} />
                  <text x={105} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="rgb(16 185 129)">
                    ✓ Result is 0 (Power of Two!)
                  </text>
                </>
              ) : (
                <>
                  <rect width={210} height={26} rx={4} fill="rgb(239 68 68)/10" stroke="rgb(239 68 68)" strokeWidth={1} />
                  <text x={105} y={16} textAnchor="middle" fontSize={9} fontWeight={700} fill="rgb(239 68 68)">
                    ✗ Result non-zero (Not Power of Two)
                  </text>
                </>
              )}
            </g>
          )}
        </g>
      )}

      {/* RENDER FOR TYPE 5: Subsets Generation */}
      {isSubsets && (
        <g>
          {/* Active elements list */}
          <g transform="translate(45, 30)">
            <text x={10} y={15} fontSize={9} fontWeight={700} className="fill-muted-foreground uppercase tracking-wider">
              Set Elements
            </text>
            {["A", "B", "C"].map((el, idx) => {
              const maskVal = frame.subsetMask ?? 0;
              const isIncluded = (maskVal & (1 << idx)) !== 0;

              return (
                <g key={`el-${el}`} transform={`translate(${startX + idx * 55}, 0)`}>
                  <rect
                    width={40}
                    height={24}
                    rx={4}
                    fill={isIncluded ? "color-mix(in oklab, var(--good) 15%, var(--card))" : "hsl(var(--card))"}
                    stroke={isIncluded ? "var(--good)" : "hsl(var(--border))"}
                    strokeWidth={isIncluded ? 2 : 1}
                  />
                  <text
                    x={20}
                    y={16}
                    textAnchor="middle"
                    fontSize={10}
                    fontWeight={700}
                    fill={isIncluded ? "var(--good)" : "hsl(var(--foreground))"}
                  >
                    {el}
                  </text>
                  <text
                    x={20}
                    y={32}
                    textAnchor="middle"
                    fontSize={6.5}
                    className="fill-muted-foreground font-mono"
                  >
                    bit {idx}
                  </text>
                </g>
              );
            })}
          </g>

          {/* Mask and Z-array alignment */}
          {renderBitRegister(
            "Current Mask",
            frame.bitsResult,
            80,
            String(frame.subsetMask),
            -1,
            []
          )}

          {/* Generated Subsets list box */}
          <g transform={`translate(${startX}, 145)`}>
            <rect width={width - startX - 20} height={105} rx={6} fill="hsl(var(--card))" className="stroke-border" strokeWidth={1} />
            <text x={15} y={18} fontSize={9} fontWeight={700} className="fill-muted-foreground uppercase tracking-wider">
              Subsets List ({frame.subsetsFound?.length ?? 0} found)
            </text>

            <foreignObject x={15} y={25} width={width - startX - 50} height={70}>
              <div className="flex flex-wrap gap-1 font-mono text-[10px] text-foreground max-h-[70px] overflow-y-auto pr-1">
                {frame.subsetsFound?.map((sub, idx) => (
                  <span
                    key={idx}
                    className="rounded border border-border bg-background px-1.5 py-0.5 text-muted-foreground font-semibold"
                  >
                    {sub}
                  </span>
                ))}
              </div>
            </foreignObject>
          </g>
        </g>
      )}

      {/* RENDER FOR TYPE 6: Decimal to Binary Division visualization */}
      {frame.kind === "converter" && (
        <g>
          <g transform={`translate(${startX}, 35)`}>
            <rect width={width - startX - 20} height={100} rx={6} fill="hsl(var(--card))" className="stroke-border/40" strokeWidth={1} />
            <text x={15} y={23} fontSize={9} fontWeight={700} className="fill-muted-foreground uppercase">
              Division Step
            </text>
            <text x={15} y={50} fontSize={12} className="fill-foreground font-mono">
              n = {frame.valA}
            </text>
            {frame.valA > 0 && (
              <>
                <text x={15} y={75} fontSize={11} className="fill-muted-foreground font-mono">
                  {frame.valA} ÷ 2 = <tspan className="fill-foreground font-bold">{Math.floor(frame.valA / 2)}</tspan> (remainder: <tspan className="fill-amber-500 font-bold">{frame.valA % 2}</tspan>)
                </text>
              </>
            )}
          </g>

          {renderBitRegister(
            "Binary Output",
            frame.bitsResult,
            155,
            undefined,
            -1,
            []
          )}
        </g>
      )}
    </svg>
  );
}
