import { ernieImagePresets } from "./ernie-image";
import { flux2Presets } from "./flux2";
import { qwenImagePresets } from "./qwen-image";
import { qwenImageEditPresets } from "./qwen-image-edit";
import { zImagePresets } from "./z-image";
import type { SdPresetId, SdPresetRegistry } from "../types";

export { ernieImagePresets } from "./ernie-image";
export { flux2Presets } from "./flux2";
export { qwenImagePresets } from "./qwen-image";
export { qwenImageEditPresets } from "./qwen-image-edit";
export { zImagePresets } from "./z-image";

export const sdPresetRegistry = {
    ...flux2Presets,
    ...qwenImagePresets,
    ...qwenImageEditPresets,
    ...zImagePresets,
    ...ernieImagePresets,
} as SdPresetRegistry;

export const supportedSdPresetIds = Object.keys(sdPresetRegistry) as SdPresetId[];
