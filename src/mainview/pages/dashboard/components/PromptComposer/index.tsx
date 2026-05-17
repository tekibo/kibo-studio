import { useRef, useEffect } from "react";
import { useGenerateStore } from "#store/generateStore";
import { ASPECT_RATIOS } from "#store/generateStore";
import { readImageFile } from "#lib/sd/client";
import AspectRatioSelect from "./AspectRatioSelect";
import ReferenceImageBar from "./ReferenceImageBar";
import PromptTextarea from "./PromptTextarea";
import GenerateButton from "./GenerateButton";
import ReferenceImageSelect from "./ReferenceImageSelect";
import SeedInput from "./SeedInput";
import { cn } from "@/lib/utils";

export function PromptComposer({ onGenerate, onStop }: { onGenerate: () => void; onStop?: () => void }) {
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const initImageDataUrl = useGenerateStore((s) => s.initImageDataUrl);
    const prompt = useGenerateStore((s) => s.prompt);
    const setPrompt = useGenerateStore((s) => s.setPrompt);
    const selectedRatio = useGenerateStore((s) => s.selectedRatio);
    const setSelectedRatio = useGenerateStore((s) => s.setSelectedRatio);
    const initImagePath = useGenerateStore((s) => s.initImagePath);
    const setInitImage = useGenerateStore((s) => s.setInitImage);
    const clearInitImage = useGenerateStore((s) => s.clearInitImage);
    const seed = useGenerateStore((s) => s.seed);
    const isRandomSeed = useGenerateStore((s) => s.isRandomSeed);
    const setSeed = useGenerateStore((s) => s.setSeed);
    const toggleRandomSeed = useGenerateStore((s) => s.toggleRandomSeed);

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textareaRef.current) textareaRef.current.focus();
    }, []);

    useEffect(() => {
        if (initImagePath && !initImageDataUrl) {
            readImageFile(initImagePath).then(setInitImage.bind(null, initImagePath)).catch(() => { });
        }
    }, [initImagePath]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); onGenerate(); }
    };

    const autoResize = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        const el = e.target;
        el.style.height = "auto";
        el.style.height = Math.min(el.scrollHeight, 160) + "px";
    };

    const canGenerate = (prompt.trim().length > 0 || initImagePath) && !isGenerating;


    return (
        <div className="shrink-0 px-4 pb-4 z-50 absolute bottom-2 left-0 right-0">
            <div className="mx-auto w-full max-w-[720px] ">
                {initImagePath && initImageDataUrl && (
                    <ReferenceImageBar
                        imageUrl={initImageDataUrl}
                        onClear={clearInitImage}
                    />
                )}

                <div className={cn("flex flex-col border bg-card rounded-[calc(var(--radius-2xl)*1.2)]", initImagePath !== "" && "pt-2")}>
                    <PromptTextarea
                        inputRef={textareaRef}
                        value={prompt}
                        onChange={autoResize}
                        onKeyDown={handleKeyDown}
                        placeholder={initImagePath ? "Describe the edit..." : "Write a prompt... (Enter to generate, Shift+Enter for new line)"}
                        disabled={isGenerating}
                    />

                    <div className="flex items-center justify-between px-2 py-1.5">
                        <div className="flex items-center gap-1">
                            <ReferenceImageSelect />
                            <AspectRatioSelect
                                ratios={ASPECT_RATIOS}
                                selected={selectedRatio}
                                onSelect={setSelectedRatio}
                                disabled={isGenerating}
                            />
                            <div className="hidden sm:flex items-center gap-1">
                                <SeedInput
                                    seed={seed}
                                    isRandomSeed={isRandomSeed}
                                    onSeedChange={setSeed}
                                    onToggleRandom={toggleRandomSeed}
                                    disabled={isGenerating}
                                />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            {prompt.length > 0 && (
                                <span className="text-[11px] text-muted-foreground/60">{prompt.length}/500</span>
                            )}
                            <GenerateButton
                                onClick={onGenerate}
                                onStop={onStop}
                                disabled={!canGenerate}
                                isGenerating={isGenerating}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
