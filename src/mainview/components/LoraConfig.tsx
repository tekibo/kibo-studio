import type { SdLoraApplyMode } from "@/lib/sd/types";
import { Button } from "#components/ui/button";
import { SelectField } from "#components/base/SelectField";
import { Label } from "#components/ui/label";
import { Input } from "#components/ui/input";
import { pickFolder } from "#lib/sd/client";
import { useSdLoraState } from "#store/sdConfigStore";
import { FolderOpen } from "lucide-react";
import { LORA_APPLY_MODE_SELECT_OPTIONS } from "#lib/sd/utils";

export function LoraConfig({ disabled }: { disabled: boolean }) {
    const { loraApplyMode, loraModelDir, setLoraApplyMode, setLoraModelDir } = useSdLoraState();

    return (
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
            <SelectField
                label="LoRA mode"
                value={loraApplyMode}
                disabled={disabled}
                onValueChange={(value) => setLoraApplyMode(value as SdLoraApplyMode)}
                options={LORA_APPLY_MODE_SELECT_OPTIONS}
            />
            <div className="space-y-1.5">
                <Label htmlFor="lora-dir" className="px-1 text-xs text-muted-foreground">LoRA directory</Label>
                <div className="flex gap-1.5">
                    <Input
                        id="lora-dir"
                        value={loraModelDir}
                        onChange={(event) => setLoraModelDir(event.target.value)}
                        disabled={disabled}
                        placeholder="D:\\Models\\loras"
                        className="h-10 flex-1 rounded-2xl bg-background/80 text-xs"
                    />
                    <Button
                        type="button"
                        variant="outline"
                        size="icon-sm"
                        disabled={disabled}
                        onClick={async () => {
                            const path = await pickFolder();
                            if (path) {
                                setLoraModelDir(path);
                            }
                        }}
                        className="h-10 w-10 shrink-0 rounded-2xl"
                        title="Browse for folder"
                    >
                        <FolderOpen className="size-4" />
                    </Button>
                </div>
            </div>
        </div>
    );
}
