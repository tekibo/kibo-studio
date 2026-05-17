import { Button } from "#components/ui/button";
import { ArrowRight, CheckCircle, FileIcon } from "lucide-react";

type Props = {
    sdCliPath: string;
    error: string;
    onSdCliPathChange: (path: string) => void;
    onBrowse: () => void;
    onFinish: () => void;
};

export function PathStep({ sdCliPath, error, onSdCliPathChange, onBrowse, onFinish }: Props) {
    return (
        <div className="flex h-full items-center justify-center bg-background p-4">
            <div className="mx-auto flex w-full max-w-lg flex-col items-center gap-6 text-center">
                <div className="grid size-14 place-items-center rounded-2xl bg-primary/10 text-primary">
                    {sdCliPath ? <CheckCircle className="size-6" /> : <FileIcon className="size-6" />}
                </div>
                <div className="space-y-1">
                    <h1 className="text-xl font-semibold">Point to sd-cli.exe</h1>
                    <p className="text-sm text-muted-foreground">
                        {sdCliPath ? "We found it! Confirm the path below." : "Select the stable-diffusion.cpp executable."}
                    </p>
                </div>
                <div className="w-full space-y-1.5 text-left">
                    <label className="text-xs font-medium text-muted-foreground">sd-cli.exe path</label>
                    <div className="flex gap-2">
                        <input
                            value={sdCliPath}
                            onChange={(e) => onSdCliPathChange(e.target.value)}
                            placeholder="D:\kibo-studio\sd-master\sd-cli.exe"
                            className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                        />
                        <Button variant="secondary" onClick={onBrowse} className="h-10 shrink-0 gap-2 rounded-lg">
                            <FileIcon className="size-4" />
                            Browse
                        </Button>
                    </div>
                    {error && <p className="text-xs text-destructive">{error}</p>}
                </div>
                <Button onClick={onFinish} disabled={!sdCliPath.trim()} className="h-11 w-full gap-2 rounded-lg text-sm" size="lg">
                    Finish setup
                    <ArrowRight className="size-4" />
                </Button>
            </div>
        </div>
    );
}
