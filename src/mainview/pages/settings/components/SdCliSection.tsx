import { Button } from "#components/ui/button";
import { Input } from "#components/ui/input";
import { FileIcon } from "lucide-react";

type Props = {
    value: string;
    disabled: boolean;
    onChange: (value: string) => void;
    onBrowse: () => void;
};

export function SdCliSection({ value, disabled, onChange, onBrowse }: Props) {
    return (
        <section className="space-y-3 rounded-lg border border-border/50 bg-card p-4">
            <div>
                <h2 className="text-sm font-medium">SD Master CLI</h2>
                <p className="text-xs text-muted-foreground">Path to sd-cli.exe for running generations</p>
            </div>
            <div className="flex gap-2">
                <Input value={value} onChange={(e) => onChange(e.target.value)} disabled={disabled} placeholder="D:\kibo-studio\sd-master\sd-cli.exe" className="h-9 flex-1 rounded-md text-xs" />
                <Button variant="outline" size="sm" disabled={disabled} onClick={onBrowse} className="h-9 shrink-0 rounded-md">
                    <FileIcon className="size-4" />
                </Button>
            </div>
        </section>
    );
}
