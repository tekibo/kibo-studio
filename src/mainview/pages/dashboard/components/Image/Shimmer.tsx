export function Shimmer({ aspectRatio }: { aspectRatio: number }) {
    return (
        <div
            className="relative overflow-hidden rounded-xl border border-border bg-card"
            style={{ aspectRatio }}
        >
            <div className="absolute inset-0 shimmer" />
        </div>
    );
}