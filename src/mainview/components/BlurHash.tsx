const GRID = [
    ["#1c1c1c", "#2a2a2a", "#1a1a1a", "#333333", "#1c1c1c", "#222222", "#2e2e2e"],
    ["#202020", "#1c1c1c", "#3a3a3a", "#202020", "#2e2e2e", "#1a1a1a", "#222222"],
    ["#1a1a1a", "#333333", "#222222", "#444444", "#2e2e2e", "#1c1c1c", "#2a2a2a"],
    ["#1c1c1c", "#222222", "#2e2e2e", "#1a1a1a", "#333333", "#3a3a3a", "#1a1a1a"],
    ["#2a2a2a", "#1a1a1a", "#2e2e2e", "#2e2e2e", "#1c1c1c", "#202020", "#333333"],
    ["#202020", "#333333", "#1c1c1c", "#3a3a3a", "#222222", "#2a2a2a", "#1c1c1c"],
    ["#1a1a1a", "#1c1c1c", "#2e2e2e", "#222222", "#2a2a2a", "#1a1a1a", "#202020"],
];

export function BlurHash({ className, style }: { className?: string; style?: React.CSSProperties }) {
    const rows = GRID.length;
    const cols = GRID[0].length;
    const tileW = `${100 / cols}%`;
    const tileH = `${100 / rows}%`;

    return (
        <svg
            className={className}
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ ...style, filter: "blur(24px)" }}
        >
            {GRID.map((row, ri) =>
                row.map((color, ci) => (
                    <rect
                        key={`${ri}-${ci}`}
                        x={`${(ci * 100) / cols}%`}
                        y={`${(ri * 100) / rows}%`}
                        width={tileW}
                        height={tileH}
                        fill={color}
                    />
                ))
            )}
        </svg>
    );
}