import { Button } from "#components/ui/button";
import { useImagePreviewState } from "#store/generateStore";
import { ImageIcon, RotateCcw, Sparkles } from "lucide-react";

export function ImagePreview() {
    const { isGenerating, image, imageError, selectedRatio, setImageError } = useImagePreviewState();

    return (
        <div className="relative flex h-full min-h-0 items-center justify-center overflow-hidden rounded-xl border bg-card shadow-sm">
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,var(--muted),transparent_42%),radial-gradient(circle_at_bottom_right,var(--accent),transparent_20rem)]" />
            <div className="pointer-events-none absolute left-3 top-3 z-20 rounded-md border bg-background/80 px-2 py-0.5 text-[11px] font-medium text-muted-foreground shadow-sm backdrop-blur">
                {selectedRatio.label} {selectedRatio.description}
            </div>
            {isGenerating ? (
                <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-3 rounded-3xl border bg-card/90 px-6 py-5 shadow-2xl sm:gap-4 sm:px-8 sm:py-7">
                        <div className="relative grid size-12 place-items-center rounded-full bg-primary text-primary-foreground sm:size-14">
                            <Sparkles className="size-5 sm:size-6" />
                            <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                        </div>
                        <div className="space-y-1 text-center">
                            <p className="text-sm font-medium">Generating image</p>
                            <p className="text-xs text-muted-foreground">This usually takes a moment.</p>
                        </div>
                    </div>
                </div>
            ) : image && !imageError ? (
                <div className="relative z-10 flex h-full min-h-0 w-full items-center justify-center p-3 sm:p-6 lg:p-10">
                    <img
                        src={image}
                        alt="Generated"
                        className="max-h-full max-w-full rounded-2xl object-contain shadow-2xl ring-1 ring-border"
                        onError={() => setImageError("Failed to load image")}
                    />
                </div>
            ) : imageError ? (
                <div className="relative z-10 mx-4 max-w-lg rounded-3xl border bg-background/85 p-5 text-center shadow-xl backdrop-blur sm:p-6">
                    <div className="mx-auto mb-3 grid size-11 place-items-center rounded-full bg-destructive/10 text-destructive sm:mb-4 sm:size-12">
                        <RotateCcw className="size-5" />
                    </div>
                    <p className="font-medium text-destructive">Generation failed</p>
                    <p className="mt-2 text-xs leading-5 text-muted-foreground bg-muted/50 rounded-lg p-3 text-left font-mono">
                        {imageError}
                    </p>
                    <Button variant="outline" onClick={() => setImageError("")} className="mt-4 w-full sm:mt-5">
                        Clear error
                    </Button>
                </div>
            ) : (
                <div className="relative z-10 mx-4 max-w-sm rounded-3xl border bg-background/85 p-5 text-center shadow-xl backdrop-blur sm:p-8">
                    <div className="mx-auto mb-3 grid size-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 sm:mb-4 sm:size-14">
                        <ImageIcon className="size-6 sm:size-7" />
                    </div>
                    <h1 className="text-lg font-semibold tracking-tight sm:text-2xl">Design your next image</h1>
                    <p className="mt-1.5 text-xs leading-5 text-muted-foreground sm:mt-2 sm:text-sm sm:leading-6">
                        Write a prompt, choose a frame, and generate a polished visual.
                    </p>
                </div>
            )}
        </div>
    );
}
