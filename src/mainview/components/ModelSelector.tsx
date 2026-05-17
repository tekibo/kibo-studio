import { Sparkles } from "lucide-react";
import { useSdConfigStore } from "#store/sdConfigStore";
import type { SdModelFamily } from "#lib/sd/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "#components/ui/select";

export function ModelSelector() {
    const models = useSdConfigStore((s) => s.sdModels);
    const selectedModel = useSdConfigStore((s) => s.selectedModel);
    const setSelectedModel = useSdConfigStore((s) => s.setSelectedModel);

    return (
        <Select value={selectedModel} onValueChange={(v) => { if (v) setSelectedModel(v as SdModelFamily); }}>
            <SelectTrigger>
                <Sparkles className="size-3.5 text-primary shrink-0" />
                <SelectValue />
            </SelectTrigger>
            <SelectContent align="start" className="min-w-[180px]">
                {models.map((m) => (
                    <SelectItem key={m.id} value={m.id}>
                        {m.label}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
