import { useState } from "react";
import { useGenerateStore } from "#store/generateStore";
import { BlurhashImage } from "#components/BlurHash";
import { ImageModal } from "./Image/ImageModal";
import ImageCard from "./Image/ImageCard";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "#components/ui/empty";
import { cn, isVideoDataUrl } from "#lib/utils";

export function ImageGrid() {
    const workingImages = useGenerateStore((s) => s.workingImages);
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const image = useGenerateStore((s) => s.image);
    const selectedRatio = useGenerateStore((s) => s.selectedRatio);

    const [modalImage, setModalImage] = useState<string | null>(null);

    const hasContent = workingImages.length > 0 || isGenerating;
    const modalItem = modalImage ? workingImages.find((img) => img.image === modalImage) : undefined;

    return (
        <>
            <div className={cn("min-h-0 flex-1 overflow-y-auto px-4 pt-4", hasContent && "pb-70")}>
                {!hasContent && <EmptyState />}

                {hasContent && (
                    <div className="flex flex-wrap gap-3">
                        {isGenerating && (
                            <div
                                className="relative overflow-hidden rounded-xl border border-border bg-card shrink-0"
                                style={{ height: 360, aspectRatio: selectedRatio.width / selectedRatio.height }}
                            >
                                <BlurhashImage
                                    src={image || undefined}
                                    className="absolute inset-0 size-full"
                                    style={{ position: "absolute", inset: 0 }}
                                />
                                {image && isVideoDataUrl(image) && (
                                    <video
                                        src={image}
                                        className="absolute inset-0 size-full object-cover"
                                        controls
                                        autoPlay
                                        loop
                                        muted
                                    />
                                )}
                            </div>
                        )}

                        {workingImages.map((img) => (
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
        <div className="h-full items-center flex">
            <Empty>
                <EmptyHeader>
                    <EmptyMedia className="overflow-hidden">
                        <img src="icon.png" className="size-48 scale-150" />
                    </EmptyMedia>
                    <EmptyTitle>Design your next image</EmptyTitle>
                </EmptyHeader>
                <EmptyDescription>Choose a model, write a prompt, and press Enter to generate.</EmptyDescription>
            </Empty>
        </div>
    );
}
