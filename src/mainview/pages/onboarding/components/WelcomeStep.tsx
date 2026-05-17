import { Button } from "#components/ui/button";
import { Download } from "lucide-react";

type Props = {
    onStartDetection: () => void;
    onManualSetup: () => void;
};

export function WelcomeStep({ onStartDetection, onManualSetup }: Props) {
    return (
        <div className="flex h-full items-center justify-center bg-background p-4">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
                <img src="icon.png" className="size-48" />
                <div className="space-y-1.5">
                    <h1 className="text-2xl font-semibold tracking-tight">Welcome to KiboStudio</h1>
                    <p className="text-sm text-muted-foreground">Local AI image generation powered by stable-diffusion.cpp</p>
                </div>
                <Button onClick={onStartDetection} className="h-11 w-full gap-2 rounded-lg text-sm" size="lg">
                    <Download className="size-4" />
                    Set up with recommended download
                </Button>
                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <span className="relative block w-fit mx-auto px-2 text-xs text-muted-foreground bg-background">or</span>
                </div>
                <Button variant="outline" onClick={onManualSetup} className="h-11 w-full gap-2 rounded-lg text-sm">
                    I already have sd-cli.exe
                </Button>
            </div>
        </div>
    );
}
