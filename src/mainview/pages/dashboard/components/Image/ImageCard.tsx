import { ImageCardMenu } from "./ImageCardMenu";

type Props = {
    item: {
        id: string;
        image: string;
        prompt: string;
        width: number;
        height: number;
        source: "generated" | "imported";
    };
    onClick: () => void;
};

export default function ImageCard({ item, onClick }: Props) {
    return (
        <button
            onClick={onClick}
            className="group relative shrink-0 overflow-hidden rounded-xl border border-border bg-card cursor-pointer hover:ring-2 hover:ring-primary/50 transition-all"
            style={{ height: 360, aspectRatio: item.width / item.height }}
        >
            <img
                src={item.image}
                alt={item.prompt}
                className="size-full object-cover"
                loading="lazy"
            />

            <div className="absolute inset-x-0 bottom-0 translate-y-full bg-linear-to-t from-black/70 to-transparent p-3 pt-8 transition-transform group-hover:translate-y-0">
                <p className="truncate text-xs text-white">{item.prompt || "Untitled"}</p>
                <p className="text-[10px] text-white/60">{item.width}x{item.height}</p>
            </div>

            <div className="absolute right-2 top-2 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={(e) => e.stopPropagation()}
            >
                <ImageCardMenu id={item.id} image={item.image} prompt={item.prompt} source={item.source} />
            </div>
        </button>
    );
}
