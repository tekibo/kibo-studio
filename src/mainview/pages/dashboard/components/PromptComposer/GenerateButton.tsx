import { ArrowUp, Square } from "lucide-react";

export default function GenerateButton({
    onClick,
    onStop,
    disabled,
    isGenerating,
}: {
    onClick: () => void;
    onStop?: () => void;
    disabled: boolean;
    isGenerating: boolean;
}) {
    return (
        <button
            onClick={isGenerating ? (onStop ?? onClick) : onClick}
            disabled={disabled && !isGenerating}
            className={`flex size-8 items-center justify-center rounded-lg border-none transition-colors duration-150 ${isGenerating
                ? "bg-destructive text-destructive-foreground cursor-pointer"
                : disabled
                    ? "bg-secondary text-muted-foreground cursor-default"
                    : "bg-primary text-primary-foreground cursor-pointer"
                }`}
        >
            {isGenerating ? (
                <Square className="size-3.5" />
            ) : (
                <ArrowUp className="size-4" />
            )}
        </button>
    );
}