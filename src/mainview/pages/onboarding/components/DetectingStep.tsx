import { Loader2 } from "lucide-react";

export function DetectingStep() {
    return (
        <div className="flex h-full items-center justify-center bg-background p-4">
            <div className="flex flex-col items-center gap-4">
                <Loader2 className="size-6 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Checking your system...</p>
            </div>
        </div>
    );
}
