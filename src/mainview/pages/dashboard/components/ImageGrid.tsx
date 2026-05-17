import { useState, useEffect, useRef } from "react";
import { useGenerateStore } from "#store/generateStore";
import { BlurHash } from "#components/BlurHash";
import { ImageModal } from "./Image/ImageModal";
import ImageCard from "./Image/ImageCard";

export function ImageGrid() {
    const workingImages = useGenerateStore((s) => s.workingImages);
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const image = useGenerateStore((s) => s.image);
    const selectedRatio = useGenerateStore((s) => s.selectedRatio);

    const currentJobId = useGenerateStore((s) => s.currentJobId);
    const [modalImage, setModalImage] = useState<string | null>(null);
    const [fadeOut, setFadeOut] = useState(false);
    const [showPlaceholder, setShowPlaceholder] = useState(false);
    const wasGenerating = useRef(false);

    useEffect(() => {
        if (isGenerating) {
            setShowPlaceholder(true);
            setFadeOut(false);
        } else if (wasGenerating.current && image) {
            setFadeOut(true);
            const timer = setTimeout(() => {
                setShowPlaceholder(false);
                setFadeOut(false);
            }, 1500);
            return () => clearTimeout(timer);
        }
        wasGenerating.current = isGenerating;
    }, [isGenerating, image]);

    const displayImages = showPlaceholder && currentJobId
        ? workingImages.filter((img) => img.id !== currentJobId)
        : workingImages;

    const hasContent = workingImages.length > 0 || isGenerating || showPlaceholder;
    const modalItem = modalImage ? workingImages.find((img) => img.image === modalImage) : undefined;

    return (
        <>
            <div className="min-h-0 flex-1 overflow-y-auto pb-70 px-4 pt-4">
                {!hasContent && <EmptyState />}

                {hasContent && (
                    <div className="flex flex-wrap gap-3">
                        {(isGenerating || showPlaceholder) && (
                            <div
                                className="relative overflow-hidden rounded-xl border border-border bg-card"
                                style={{ height: 360, aspectRatio: selectedRatio.width / selectedRatio.height }}
                            >
                                <BlurHash
                                    className="absolute inset-0 size-full"
                                    style={{
                                        transition: "opacity 1.5s ease-out",
                                        opacity: fadeOut ? 0 : 1,
                                    }}
                                />
                                {image && (
                                    <img
                                        src={image}
                                        className="absolute inset-0 size-full object-cover"
                                    />
                                )}
                            </div>
                        )}

                        {displayImages.map((img) => (
                            <ImageCard key={img.id} item={{
                                id: img.id,
                                image: img.image,
                                prompt: img.prompt ?? "",
                                width: img.width,
                                height: img.height,
                                source: img.source,
                            }} onClick={() => setModalImage(img.image)} />
                        ))}
                    </div>
                )}
            </div>

            {modalItem && (
                <ImageModal
                    image={modalItem.image}
                    prompt={modalItem.prompt ?? ""}
                    onClose={() => setModalImage(null)}
                    id={modalItem.id}
                    source={modalItem.source}
                />
            )}
        </>
    );
}

function EmptyState() {
    return (
        <div className="flex h-full w-full items-center justify-center">
            <div className="flex flex-col items-center text-center">
                <img src="icon.png" className="block size-48" />
                <p className="m-0 text-xl font-semibold tracking-tight text-foreground">Design your next image</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">Choose a model, write a prompt, and press Enter to generate.</p>
            </div>
        </div>
    );
}