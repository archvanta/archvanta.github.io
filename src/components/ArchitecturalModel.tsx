import { useRef, type PointerEvent } from "react";
type Point = [number, number, number];
const project = ([x, y, z]: Point): [number, number] => [
  500 + (x - y) * 0.94,
  470 + (x + y) * 0.43 - z,
];
const points = (ps: Point[]) => ps.map((p) => project(p).join(",")).join(" ");
function Box({
  x,
  y,
  z,
  w,
  d,
  h,
  kind = "solid",
}: {
  x: number;
  y: number;
  z: number;
  w: number;
  d: number;
  h: number;
  kind?: string;
}) {
  return (
    <g className={`model-box ${kind}`}>
      <polygon
        className="box-left"
        points={points([
          [x, y + d, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
      <polygon
        className="box-right"
        points={points([
          [x + w, y, z],
          [x + w, y + d, z],
          [x + w, y + d, z + h],
          [x + w, y, z + h],
        ])}
      />
      <polygon
        className="box-top"
        points={points([
          [x, y, z + h],
          [x + w, y, z + h],
          [x + w, y + d, z + h],
          [x, y + d, z + h],
        ])}
      />
    </g>
  );
}
function Line({
  a,
  b,
  className = "",
}: {
  a: Point;
  b: Point;
  className?: string;
}) {
  const p = project(a),
    q = project(b);
  return <line className={className} x1={p[0]} y1={p[1]} x2={q[0]} y2={q[1]} />;
}
export function ArchitecturalModel({
  mode = 0,
  interactive = false,
  id = "main",
}: {
  mode?: number;
  interactive?: boolean;
  id?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const tilt = (e: PointerEvent<HTMLDivElement>) => {
    if (
      !interactive ||
      e.pointerType !== "mouse" ||
      matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const r = e.currentTarget.getBoundingClientRect();
    root.current?.style.setProperty(
      "--tilt-x",
      `${((e.clientY - r.top) / r.height - 0.5) * -3}deg`,
    );
    root.current?.style.setProperty(
      "--tilt-y",
      `${((e.clientX - r.left) / r.width - 0.5) * 4}deg`,
    );
  };
  const reset = () => {
    root.current?.style.setProperty("--tilt-x", "0deg");
    root.current?.style.setProperty("--tilt-y", "0deg");
  };
  const levels = [0, 1, 2, 3];
  const explode = mode === 2 ? 22 : 0;
  return (
    <div
      ref={root}
      className={`architectural-model model-mode-${mode}`}
      onPointerMove={tilt}
      onPointerLeave={reset}
      aria-hidden="true"
    >
      <svg viewBox="0 0 1000 760" className="model-svg" fill="none">
        <defs>
          <radialGradient id={`${id}-light`}>
            <stop stopColor="var(--model-glow)" stopOpacity=".18" />
            <stop offset="1" stopColor="var(--model-glow)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse
          cx="510"
          cy="430"
          rx="440"
          ry="280"
          fill={`url(#${id}-light)`}
        />
        <g className="model-ground">
          {Array.from({ length: 13 }, (_, i) => {
            const v = -330 + i * 55;
            return (
              <g key={i}>
                <Line a={[v, -330, 0]} b={[v, 330, 0]} />
                <Line a={[-330, v, 0]} b={[330, v, 0]} />
              </g>
            );
          })}
        </g>
        <g className="model-building">
          <Box x={-225} y={-150} z={-14} w={450} d={300} h={14} kind="plinth" />
          <g className="rear-wing">
            <Box
              x={-195}
              y={-125}
              z={0}
              w={350}
              d={90}
              h={mode === 0 ? 198 : 16}
              kind="concrete"
            />
          </g>
          {levels.map((level) => {
            const z = level * (61 + explode);
            return (
              <g key={level} className="building-level">
                <Box
                  x={-195}
                  y={-125}
                  z={z}
                  w={390}
                  d={250}
                  h={7}
                  kind={mode === 2 ? `bim-${level}` : "slab"}
                />
                {[-180, -60, 60, 180].map((x) =>
                  [-110, 110].map((y) => (
                    <Box
                      key={`${x}:${y}`}
                      x={x}
                      y={y}
                      z={z + 7}
                      w={7}
                      d={7}
                      h={54}
                      kind="column"
                    />
                  )),
                )}
                {mode !== 1 && mode !== 3 && (
                  <>
                    <Box
                      x={-180}
                      y={109}
                      z={z + 7}
                      w={355}
                      d={2}
                      h={49}
                      kind={mode === 2 ? "glass-blue" : "glass"}
                    />
                    {Array.from({ length: 18 }, (_, i) => (
                      <Line
                        key={i}
                        a={[-175 + i * 20, 112, z + 7]}
                        b={[-175 + i * 20, 112, z + 56]}
                        className="mullion"
                      />
                    ))}
                  </>
                )}
                {mode === 1 && (
                  <>
                    <Line
                      a={[-180, 113, z + 7]}
                      b={[-55, 113, z + 58]}
                      className="brace"
                    />
                    <Line
                      a={[-55, 113, z + 58]}
                      b={[65, 113, z + 7]}
                      className="brace"
                    />
                    <Line
                      a={[65, 113, z + 7]}
                      b={[185, 113, z + 58]}
                      className="brace"
                    />
                  </>
                )}
                {mode === 3 &&
                  level < 3 &&
                  [-130, -55, 20, 95].map((x) =>
                    [-60, 15, 80].map((y) => (
                      <g key={`${x}:${y}`}>
                        <Box
                          x={x}
                          y={y}
                          z={z + 7}
                          w={34}
                          d={42}
                          h={44}
                          kind="server"
                        />
                        {[15, 25, 35].map((dz) => (
                          <Line
                            key={dz}
                            a={[x + 36, y + 3, z + dz]}
                            b={[x + 36, y + 38, z + dz]}
                            className="server-led"
                          />
                        ))}
                      </g>
                    )),
                  )}
              </g>
            );
          })}
          <Box
            x={-215}
            y={-145}
            z={4 * (61 + explode)}
            w={430}
            d={290}
            h={10}
            kind="roof"
          />
          {mode === 0 && (
            <>
              <Box x={-215} y={-145} z={250} w={430} d={8} h={28} kind="roof" />
              <Box x={207} y={-145} z={250} w={8} d={290} h={28} kind="roof" />
              {Array.from({ length: 13 }, (_, i) => (
                <Box
                  key={i}
                  x={-195 + i * 31}
                  y={-135}
                  z={254}
                  w={4}
                  d={270}
                  h={5}
                  kind="column"
                />
              ))}
            </>
          )}
          {mode === 3 && (
            <g className="cooling-paths">
              <Line a={[-230, -80, 12]} b={[230, -80, 12]} />
              <Line a={[-230, 0, 12]} b={[230, 0, 12]} />
              <Line a={[-230, 80, 12]} b={[230, 80, 12]} />
              <Line a={[230, -80, 12]} b={[230, 80, 12]} />
            </g>
          )}
        </g>
        <g className="model-dimensions">
          <Line a={[-240, 165, 0]} b={[230, 165, 0]} />
          <Line a={[-240, 155, 0]} b={[-240, 175, 0]} />
          <Line a={[230, 155, 0]} b={[230, 175, 0]} />
          <Line a={[-240, -150, 0]} b={[-240, -150, 295 + explode * 4]} />
          <Line a={[-250, -150, 0]} b={[-230, -150, 0]} />
          <Line
            a={[-250, -150, 295 + explode * 4]}
            b={[-230, -150, 295 + explode * 4]}
          />
        </g>
        <g
          className="model-labels"
          fontFamily="monospace"
          fontSize="10"
          fill="currentColor"
        >
          <text x="220" y="645">
            X / 01
          </text>
          <text x="754" y="568">
            Y / 02
          </text>
          <text x="376" y="108">
            Z / +04
          </text>
          <text x="100" y="235">
            SECTION A—A
          </text>
          <path d="M100 246h114l39 25" stroke="currentColor" strokeWidth=".6" />
          <text x="755" y="254">
            {
              [
                "SPATIAL VOLUME",
                "STRUCTURAL FRAME",
                "COORDINATED LAYERS",
                "TECHNICAL SYSTEMS",
              ][mode]
            }
          </text>
          <path
            d="M755 264h-80l-34 26"
            stroke="currentColor"
            strokeWidth=".6"
          />
        </g>
        {mode === 2 && (
          <g className="bim-nodes">
            {[
              [170, 110, 180],
              [-180, 110, 90],
              [180, -110, 305],
            ].map((p, i) => {
              const [x, y] = project(p as Point);
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r="5" />
                  <path d={`M${x} ${y}h45v-20`} stroke="currentColor" />
                  <text x={x + 48} y={y - 17} fontSize="10" fill="currentColor">
                    0{i + 1}
                  </text>
                </g>
              );
            })}
          </g>
        )}
      </svg>
    </div>
  );
}
