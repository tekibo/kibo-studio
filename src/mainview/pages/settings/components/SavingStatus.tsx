import { useSdConfigHeaderState } from "@/store/sdConfigStore";
import { Loader2 } from "lucide-react";

export function SavingStatus() {
    const { isSaving, settingsError } = useSdConfigHeaderState();

    if (settingsError) {
        return <span className="text-xs text-destructive">{settingsError}</span>;
    }

    if (isSaving) {
        return (
            <span className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Loader2 className="size-3 animate-spin" />
                Saving...
            </span>
        );
    }

    return null;
}
