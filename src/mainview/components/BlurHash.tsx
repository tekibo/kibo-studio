import { useEffect, useRef, useState } from "react";
import { decode } from "blurhash";

const DEFAULT_BLURHASH = "LEHV6nWB2yk8pyo0adR*.7kCMdnj";

type Props = {
    src?: string;
    blurhash?: string;
    className?: string;
    style?: React.CSSProperties;
    alt?: string;
};

export function BlurhashImage({ src, blurhash = DEFAULT_BLURHASH, className, style, alt }: Props) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const size = 32;
        const pixels = decode(blurhash, size, size);
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        const imageData = ctx.createImageData(size, size);
        imageData.data.set(pixels);
        canvas.width = size;
        canvas.height = size;
        ctx.putImageData(imageData, 0, 0);
    }, [blurhash]);

    useEffect(() => {
        if (!src) { setLoaded(false); return; }
        setLoaded(false);
        const img = new Image();
        img.onload = () => setLoaded(true);
        img.onerror = () => setLoaded(true);
        img.src = src;
    }, [src]);

    return (
        <div className={className} style={{ position: "relative", overflow: "hidden", ...style }}>
            <canvas
                ref={canvasRef}
                style={{
                    position: "absolute", inset: 0, width: "100%", height: "100%",
                    objectFit: "cover", transition: "opacity 0.5s ease-out",
                    opacity: loaded ? 0 : 1,
                }}
            />
            {src && (
                <img
                    src={src}
                    alt={alt ?? ""}
                    className="absolute inset-0 size-full object-cover"
                    style={{
                        transition: "opacity 0.5s ease-out",
                        opacity: loaded ? 1 : 0,
                    }}
                    loading="lazy"
                />
            )}
        </div>
    );
}
