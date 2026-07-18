import { motion } from "framer-motion";
import { StringFrame } from "./types";

interface StringRendererProps {
  text: string;
  pattern: string;
  frame: StringFrame | undefined;
}

export function StringRenderer({ text, pattern, frame }: StringRendererProps) {
  const width = 520;
  const height = 280;

  if (!frame) {
    return (
      <div className="card-surface p-4 flex items-center justify-center h-[280px] text-muted-foreground text-sm">
        Provide text and pattern, then press Play to start.
      </div>
    );
  }

  const N = text.length;
  const M = pattern.length;

  // Render variables depending on the algorithm
  const isZAlgo = frame.kind === "z-algo";
  const concatStr = pattern + "$" + text;
  const L = concatStr.length;

  // Compute box dimensions to fit all characters inside 520px
  const maxChars = isZAlgo ? L : N;
  const boxSize = Math.max(22, Math.min(32, (width - 40) / maxChars));
  const startX = (width - maxChars * boxSize) / 2;

  // Highlight sets
  const activeTextSet = new Set(frame.activeTextIndices);
  const activePatSet = new Set(frame.activePatIndices);
  const matchedSet = new Set(frame.matchedIndices);
  const mismatchedSet = new Set(frame.mismatchedIndices);

  const getCharColor = (
    idx: number,
    isPattern: boolean,
    isConcat: boolean = false
  ) => {
    if (isConcat) {
      const isCurrentIndex = frame.textIdx === idx;
      const isZBoxRange = frame.zBox && idx >= frame.zBox.l && idx <= frame.zBox.r;
      const val = frame.z?.[idx];
      
      if (isCurrentIndex) {
        return {
          fill: "var(--brand)",
          stroke: "var(--brand)",
          textColor: "white",
        };
      }
      if (isZBoxRange) {
        return {
          fill: "color-mix(in oklab, rgb(139 92 246) 15%, var(--card))",
          stroke: "rgb(139 92 246)",
          textColor: "hsl(var(--foreground))",
        };
      }
      if (val !== undefined && val > 0 && idx > 0) {
        return {
          fill: "color-mix(in oklab, rgb(16 185 129) 15%, var(--card))",
          stroke: "rgb(16 185 129)",
          textColor: "hsl(var(--foreground))",
        };
      }
      return {
        fill: "hsl(var(--card))",
        stroke: "hsl(var(--border))",
        textColor: "hsl(var(--foreground))",
      };
    }

    const checkIdx = isPattern ? idx : idx;
    const isActive = isPattern ? activePatSet.has(checkIdx) : activeTextSet.has(checkIdx);
    const isMatch = isPattern
      ? matchedSet.has(frame.textIdx + checkIdx)
      : matchedSet.has(checkIdx);
    const isMismatch = isPattern
      ? mismatchedSet.has(frame.textIdx + checkIdx)
      : mismatchedSet.has(checkIdx);

    if (isMismatch) {
      return {
        fill: "rgb(239 68 68)", // Red mismatch
        stroke: "rgb(239 68 68)",
        textColor: "white",
      };
    }
    if (isMatch) {
      return {
        fill: "rgb(16 185 129)", // Green match
        stroke: "rgb(16 185 129)",
        textColor: "white",
      };
    }
    if (isActive) {
      return {
        fill: "color-mix(in oklab, rgb(245 158 11) 25%, var(--card))", // Amber checking
        stroke: "rgb(245 158 11)",
        textColor: "hsl(var(--foreground))",
      };
    }
    return {
      fill: "hsl(var(--card))",
      stroke: "hsl(var(--border))",
      textColor: "hsl(var(--foreground))",
    };
  };

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      className="w-full h-auto rounded-md border border-border bg-background"
    >
      <defs>
        {/* Soft shadow for letter cells */}
        <filter id="cell-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodOpacity="0.1" floodColor="#000" />
        </filter>
      </defs>

      {/* --- RENDER OPTION A: Standard Text + Pattern Slide Vis (Naive, KMP, Rabin-Karp) --- */}
      {!isZAlgo && (
        <g>
          {/* A1. Text Row */}
          <g transform="translate(0, 45)">
            <text
              x={startX}
              y={-10}
              fontSize={10}
              fontWeight={700}
              className="fill-muted-foreground uppercase tracking-wider"
            >
              Text (T)
            </text>
            {text.split("").map((char, idx) => {
              const colors = getCharColor(idx, false);
              return (
                <g key={`t-${idx}`} transform={`translate(${startX + idx * boxSize}, 0)`}>
                  <rect
                    width={boxSize - 2}
                    height={boxSize - 2}
                    rx={4}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={1.5}
                    filter="url(#cell-shadow)"
                  />
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={colors.textColor}
                  >
                    {char}
                  </text>
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize + 11}
                    textAnchor="middle"
                    fontSize={7.5}
                    className="fill-muted-foreground/60 font-mono"
                  >
                    {idx}
                  </text>
                </g>
              );
            })}
          </g>

          {/* A2. Sliding Pattern Row */}
          <g transform={`translate(0, 120)`}>
            <text
              x={startX + frame.textIdx * boxSize}
              y={-10}
              fontSize={10}
              fontWeight={700}
              className="fill-muted-foreground uppercase tracking-wider"
            >
              Pattern (P)
            </text>
            {pattern.split("").map((char, idx) => {
              const colors = getCharColor(idx, true);
              const xPos = startX + (frame.textIdx + idx) * boxSize;

              return (
                <motion.g
                  key={`p-${idx}`}
                  animate={{ x: xPos }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  transform={`translate(${xPos}, 0)`}
                >
                  <rect
                    width={boxSize - 2}
                    height={boxSize - 2}
                    rx={4}
                    fill={colors.fill}
                    stroke={colors.stroke}
                    strokeWidth={1.5}
                    filter="url(#cell-shadow)"
                  />
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={colors.textColor}
                  >
                    {char}
                  </text>
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize + 11}
                    textAnchor="middle"
                    fontSize={7.5}
                    className="fill-muted-foreground/60 font-mono"
                  >
                    {idx}
                  </text>
                </motion.g>
              );
            })}
          </g>

          {/* A3. KMP LPS Table Panel */}
          {frame.kind === "kmp" && frame.lps && (
            <g transform="translate(0, 205)">
              <text
                x={startX}
                y={-8}
                fontSize={9}
                fontWeight={700}
                className="fill-muted-foreground uppercase tracking-wider"
              >
                LPS Table (Failure skips)
              </text>
              {pattern.split("").map((char, idx) => {
                const isActive = frame.patIdx === idx;
                return (
                  <g key={`lps-${idx}`} transform={`translate(${startX + idx * boxSize}, 0)`}>
                    <rect
                      width={boxSize - 2}
                      height={boxSize - 2}
                      rx={3}
                      fill={isActive ? "var(--brand)" : "hsl(var(--card))"}
                      stroke={isActive ? "var(--brand)" : "hsl(var(--border))"}
                      strokeWidth={isActive ? 2 : 1}
                    />
                    <text
                      x={boxSize / 2 - 1}
                      y={boxSize / 2 + 4}
                      textAnchor="middle"
                      fontSize={11}
                      fontWeight={700}
                      fill={isActive ? "white" : "hsl(var(--foreground))"}
                    >
                      {frame.lps![idx]}
                    </text>
                    <text
                      x={boxSize / 2 - 1}
                      y={boxSize + 9}
                      textAnchor="middle"
                      fontSize={7.5}
                      className="fill-muted-foreground/80 font-mono"
                    >
                      {char}
                    </text>
                  </g>
                );
              })}
            </g>
          )}

          {/* A4. Rabin-Karp Hash Info Box */}
          {frame.kind === "rabin-karp" && (
            <g transform={`translate(${startX}, 205)`}>
              <rect
                width={width - startX * 2}
                height={55}
                rx={6}
                fill="hsl(var(--card))"
                className="stroke-border/40"
                strokeWidth={1}
              />
              {/* Pattern hash */}
              <text x={15} y={23} fontSize={10} className="fill-muted-foreground font-mono">
                Pattern Hash (H_p): <tspan className="fill-foreground font-bold">{frame.pHash}</tspan>
              </text>
              {/* Current window hash */}
              <text x={15} y={42} fontSize={10} className="fill-muted-foreground font-mono">
                Window Hash (H_t): <tspan className="fill-foreground font-bold">{frame.tHash}</tspan>
              </text>

              {/* Status Indicator */}
              <g transform={`translate(${width - startX * 2 - 130}, 15)`}>
                {frame.pHash === frame.tHash ? (
                  frame.isCollision ? (
                    <g>
                      <rect width={115} height={26} rx={4} fill="rgb(239 68 68)/10" stroke="rgb(239 68 68)" strokeWidth={1} />
                      <text x={57} y={16} textAnchor="middle" fontSize={8} fontWeight={700} fill="rgb(239 68 68)">
                        HASH COLLISION!
                      </text>
                    </g>
                  ) : (
                    <g>
                      <rect width={115} height={26} rx={4} fill="rgb(16 185 129)/10" stroke="rgb(16 185 129)" strokeWidth={1} />
                      <text x={57} y={16} textAnchor="middle" fontSize={8} fontWeight={700} fill="rgb(16 185 129)">
                        HASH MATCH (Verify)
                      </text>
                    </g>
                  )
                ) : (
                  <g>
                    <rect width={115} height={26} rx={4} fill="hsl(var(--muted))/60" stroke="hsl(var(--border))" strokeWidth={1} />
                    <text x={57} y={16} textAnchor="middle" fontSize={8} fontWeight={700} className="fill-muted-foreground">
                      NO MATCH (Skip)
                    </text>
                  </g>
                )}
              </g>
            </g>
          )}
        </g>
      )}

      {/* --- RENDER OPTION B: Z-Algorithm String + Z-Array Vis --- */}
      {isZAlgo && frame.z && (
        <g>
          {/* B1. Concatenated String Row */}
          <g transform="translate(0, 45)">
            <text
              x={startX}
              y={-10}
              fontSize={10}
              fontWeight={700}
              className="fill-muted-foreground uppercase tracking-wider"
            >
              Concatenated String S (P + '$' + T)
            </text>
            {concatStr.split("").map((char, idx) => {
              const colors = getCharColor(idx, false, true);
              const isSep = char === "$";

              return (
                <g key={`c-${idx}`} transform={`translate(${startX + idx * boxSize}, 0)`}>
                  <rect
                    width={boxSize - 2}
                    height={boxSize - 2}
                    rx={4}
                    fill={isSep ? "hsl(var(--muted))" : colors.fill}
                    stroke={isSep ? "hsl(var(--border))" : colors.stroke}
                    strokeWidth={isSep ? 1 : 1.5}
                    filter="url(#cell-shadow)"
                  />
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={isSep ? "hsl(var(--muted-foreground))" : colors.textColor}
                  >
                    {char}
                  </text>
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize + 11}
                    textAnchor="middle"
                    fontSize={7.5}
                    className="fill-muted-foreground/60 font-mono"
                  >
                    {idx}
                  </text>
                </g>
              );
            })}
          </g>

          {/* B2. Z-Array Row */}
          <g transform="translate(0, 130)">
            <text
              x={startX}
              y={-10}
              fontSize={10}
              fontWeight={700}
              className="fill-muted-foreground uppercase tracking-wider"
            >
              Z-Array
            </text>
            {frame.z.map((val, idx) => {
              const isCurrent = frame.textIdx === idx;
              const hasValComputed = idx <= frame.textIdx && idx > 0;

              return (
                <g key={`z-${idx}`} transform={`translate(${startX + idx * boxSize}, 0)`}>
                  <rect
                    width={boxSize - 2}
                    height={boxSize - 2}
                    rx={4}
                    fill={isCurrent ? "var(--brand)" : hasValComputed ? "color-mix(in oklab, var(--good) 15%, var(--card))" : "hsl(var(--card))"}
                    stroke={isCurrent ? "var(--brand)" : hasValComputed ? "var(--good)" : "hsl(var(--border))"}
                    strokeWidth={isCurrent ? 2 : 1}
                  />
                  <text
                    x={boxSize / 2 - 1}
                    y={boxSize / 2 + 4}
                    textAnchor="middle"
                    fontSize={12}
                    fontWeight={700}
                    fill={isCurrent ? "white" : hasValComputed ? "var(--good)" : "hsl(var(--muted-foreground))"}
                  >
                    {idx === 0 ? "—" : val}
                  </text>
                </g>
              );
            })}
          </g>

          {/* B3. Z-Box Bounding Box */}
          {frame.zBox && frame.zBox.l > 0 && (
            <g transform={`translate(${startX + frame.zBox.l * boxSize}, 33)`}>
              <rect
                width={(frame.zBox.r - frame.zBox.l + 1) * boxSize - 2}
                height={boxSize + 12}
                rx={6}
                fill="none"
                stroke="rgb(139 92 246)"
                strokeWidth={2}
                strokeDasharray="4,3"
              />
              <text
                x={((frame.zBox.r - frame.zBox.l + 1) * boxSize) / 2}
                y={boxSize + 25}
                textAnchor="middle"
                fontSize={8}
                fontWeight={700}
                fill="rgb(139 92 246)"
                className="uppercase tracking-wider"
              >
                Z-Box [L={frame.zBox.l}, R={frame.zBox.r}]
              </text>
            </g>
          )}
        </g>
      )}
    </svg>
  );
}
