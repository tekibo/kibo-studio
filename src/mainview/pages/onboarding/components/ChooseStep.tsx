import { Button } from "#components/ui/button";
import { getAllForPlatform } from "#lib/sd/downloads";
import { ChevronDown, Download, FolderOpen, Loader2 } from "lucide-react";

type Props = {
    selectedUrl: string;
    selectedLabel: string;
    systemInfo: string;
    installDir: string;
    downloading: boolean;
    downloadProgress: string;
    error: string;
    showAll: boolean;
    onSelectDownload: (url: string, label: string, needsCudaExt?: boolean, cudaUrl?: string) => void;
    onInstallDirChange: (dir: string) => void;
    onBrowseInstall: () => void;
    onDownload: () => void;
    onSkip: () => void;
    onToggleShowAll: () => void;
};

export function ChooseStep({
    selectedUrl, selectedLabel, systemInfo, installDir,
    downloading, downloadProgress, error, showAll,
    onSelectDownload, onInstallDirChange, onBrowseInstall,
    onDownload, onSkip, onToggleShowAll,
}: Props) {
    const all = getAllForPlatform();

    return (
        <div className="flex h-full items-start justify-center overflow-y-auto bg-background p-4 pt-8">
            <div className="mx-auto flex w-full max-w-lg flex-col gap-5">
                <div className="text-center space-y-1">
                    <h1 className="text-lg font-semibold">Choose your build</h1>
                    <p className="text-xs text-muted-foreground">{systemInfo}</p>
                </div>

                {selectedUrl && (
                    <div className="rounded-lg border border-primary/30 bg-primary/5 p-3 space-y-2">
                        <p className="text-xs font-medium text-primary">Recommended for your system</p>
                        <button
                            onClick={() => onSelectDownload(selectedUrl, selectedLabel)}
                            className="w-full rounded-md border border-primary/40 bg-primary/10 px-3 py-2 text-left text-sm font-medium"
                        >
                            {selectedLabel}
                        </button>
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <span className="h-px flex-1 bg-border" />
                    <button onClick={onToggleShowAll} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground">
                        {showAll ? "Hide" : "Show all"} options
                        <ChevronDown className={`size-3 transition ${showAll ? "rotate-180" : ""}`} />
                    </button>
                    <span className="h-px flex-1 bg-border" />
                </div>

                {showAll && (
                    <div className="space-y-1 max-h-60 overflow-y-auto rounded-lg border border-border/50 p-1">
                        {all.map((dl) => (
                            <button
                                key={dl.url}
                                onClick={() => onSelectDownload(dl.url, dl.label, dl.requiresCuda, dl.requiresCudaExtra)}
                                className={`w-full rounded-md px-3 py-2 text-left text-xs transition-colors ${selectedUrl === dl.url ? "bg-accent text-accent-foreground font-medium" : "hover:bg-accent/50 text-muted-foreground"}`}
                            >
                                {dl.label}
                                {dl.backend && <span className="ml-2 text-[10px] text-muted-foreground">({dl.backend})</span>}
                            </button>
                        ))}
                    </div>
                )}

                <div className="space-y-1.5">
                    <label className="text-xs font-medium text-muted-foreground">Install location</label>
                    <div className="flex gap-2">
                        <input
                            value={installDir}
                            onChange={(e) => onInstallDirChange(e.target.value)}
                            placeholder="D:\kibo-studio\sd-master"
                            className="h-10 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:opacity-50"
                            disabled={downloading}
                        />
                        <Button variant="secondary" onClick={onBrowseInstall} disabled={downloading} className="h-10 shrink-0 gap-2 rounded-lg">
                            <FolderOpen className="size-4" />
                            Browse
                        </Button>
                    </div>
                </div>

                {error && <p className="text-xs text-destructive">{error}</p>}
                {downloadProgress && <p className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="size-3 animate-spin" />{downloadProgress}</p>}

                {!downloading ? (
                    <Button onClick={onDownload} disabled={!selectedUrl || !installDir.trim()} className="h-11 w-full gap-2 rounded-lg text-sm" size="lg">
                        <Download className="size-4" />
                        Download & Install
                    </Button>
                ) : (
                    <div className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-muted text-sm text-muted-foreground">
                        <Loader2 className="size-4 animate-spin" />
                        {downloadProgress || "Working..."}
                    </div>
                )}

                <div className="relative w-full">
                    <div className="absolute inset-0 flex items-center"><span className="w-full border-t border-border" /></div>
                    <span className="relative block w-fit mx-auto px-2 text-xs text-muted-foreground bg-background">or</span>
                </div>
                <Button variant="outline" onClick={onSkip} className="h-10 w-full gap-2 rounded-lg text-xs">
                    I already have sd-cli.exe — skip download
                </Button>
            </div>
        </div>
    );
}
