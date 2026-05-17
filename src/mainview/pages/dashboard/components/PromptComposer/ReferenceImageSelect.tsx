import { pickImageFile, uploadImageToWorkspace } from "@/lib/sd/client";
import { useGenerateStore } from "@/store/generateStore";
import { Popover, PopoverTrigger, PopoverContent } from "#components/ui/popover";
import { Trash2, Upload } from "lucide-react";
import { useState } from "react";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import HoverImage from "@/components/base/HoverImage";
import ReferenceStrength from "./ReferenceStrength";

export default function ReferenceImageSelect() {
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const initImageDataUrl = useGenerateStore((s) => s.initImageDataUrl);
    const initImagePath = useGenerateStore((s) => s.initImagePath);
    const setInitImage = useGenerateStore((s) => s.setInitImage);
    const clearInitImage = useGenerateStore((s) => s.clearInitImage);
    const workingImages = useGenerateStore((s) => s.workingImages);
    const loadWorkingImages = useGenerateStore((s) => s.loadWorkingImages);

    const [uploading, setUploading] = useState(false);

    async function handleUploadReference() {
        const path = await pickImageFile();
        if (!path) return;

        setUploading(true);

        try {
            const result = await uploadImageToWorkspace(path);

            if (result) {
                setInitImage(result.id, result.image);
                await loadWorkingImages();
            }
        } finally {
            setUploading(false);
        }
    }

    function handleSelectReference(id: string, image: string) {
        setInitImage(id, image);
    }

    function handleRemoveReference() {
        clearInitImage();
    }

    return (
        <Popover >
            <PopoverTrigger
                disabled={isGenerating}
                className={cn(
                    buttonVariants({ variant: "outline" }),
                    "h-9 gap-1.5 px-3"
                )}
            >
                <Upload className="size-3.5" />
                {initImagePath ? "Change" : "Reference"}
            </PopoverTrigger>

            <PopoverContent side="top" align="start">
                <header className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">
                        Reference image
                    </span>

                    <Button
                        onClick={handleUploadReference}
                        disabled={uploading}
                    >
                        {uploading ? (
                            <div className="size-3 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        ) : (
                            <Upload className="size-3" />
                        )}

                        Upload
                    </Button>
                </header>

                {initImageDataUrl !== "" && (
                    <>
                        <div className="flex items-center justify-center">
                            <img src={initImageDataUrl} className="size-48 rounded-md object-contain" />
                        </div>
                        <ReferenceStrength />
                        <Button onClick={handleRemoveReference} variant="outline" className={'hover:text-destructive'}>
                            <Trash2 className="size-3" />
                            Remove
                        </Button>
                    </>
                )}

                <div className="min-h-0 max-h-54 overflow-y-auto rounded-lg bg-accent/30 border p-2.5">
                    <ImageGrid
                        workingImages={workingImages}
                        uploading={uploading}
                        initImagePath={initImagePath}
                        onSelect={handleSelectReference}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}


function ImageGrid({
    workingImages,
    uploading,
    initImagePath,
    onSelect,
}: {
    workingImages: any[];
    uploading: boolean;
    initImagePath: string;
    onSelect: (id: string, image: string) => void;
}) {
    if (!workingImages.length && !uploading) {
        return (
            <div className="py-8 text-center text-xs text-muted-foreground">
                No images yet — upload one above
            </div>
        );
    }

    return (
        <div className="grid grid-cols-3 gap-2">
            {workingImages.map((img) => {
                const active = initImagePath === img.id;

                return (
                    <button
                        key={img.id}
                        onClick={() => onSelect(img.id, img.image)}
                        className={cn(
                            "aspect-square overflow-hidden rounded-lg border transition-all",
                            "hover:ring-2 hover:ring-primary/50",
                            active
                                ? "border-primary ring-1 ring-primary"
                                : "border-border bg-card"
                        )}
                    >
                        <HoverImage
                            url={img.image}
                            triggerImageClassName="rounded-md"
                        />
                    </button>
                );
            })}
        </div>
    );
}