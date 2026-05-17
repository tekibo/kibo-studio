import type { SdPresetId } from "#lib/sd/types";
import { useSdPresetPathState } from "#store/sdConfigStore";
import { EMPTY_PATHS } from "#lib/sd/utils";
import { getMissingPresetPathInputs } from "#lib/sd/path-fields";

export function MissingBadge({ presetId }: { presetId: SdPresetId }) {
    const { pathsByPreset, presets } = useSdPresetPathState();
    const preset = presets.find((p) => p.id === presetId);
    const currentPaths = pathsByPreset[presetId] ?? EMPTY_PATHS;
    const missing = preset ? getMissingPresetPathInputs(preset, currentPaths) : [];
    if (missing.length === 0) return null;
    return (
        <span className="rounded bg-destructive/15 px-1.5 py-0.5 text-[10px] text-destructive">
            {missing.length} missing
        </span>
    );
}
