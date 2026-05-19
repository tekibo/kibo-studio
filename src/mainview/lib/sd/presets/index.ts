import { animaPresets } from "./anima";
import { chromaPresets } from "./chroma";
import { chromaRadiancePresets } from "./chroma-radiance";
import { distilledSdPresets } from "./distilled-sd";
import { ernieImagePresets } from "./ernie-image";
import { flux1Presets } from "./flux1";
import { flux2Presets } from "./flux2";
import { hidreamPresets } from "./hidream";
import { kontextPresets } from "./kontext";
import { ltxPresets } from "./ltx";
import { ovisPresets } from "./ovis";
import { qwenImagePresets } from "./qwen-image";
import { qwenImageEditPresets } from "./qwen-image-edit";
import { sdClassicPresets } from "./sd-classic";
import { sd3Presets } from "./sd3";
import { wanPresets } from "./wan";
import { zImagePresets } from "./z-image";
import type { SdPresetId, SdPresetRegistry } from "../types";

export { animaPresets } from "./anima";
export { chromaPresets } from "./chroma";
export { chromaRadiancePresets } from "./chroma-radiance";
export { distilledSdPresets } from "./distilled-sd";
export { ernieImagePresets } from "./ernie-image";
export { flux1Presets } from "./flux1";
export { flux2Presets } from "./flux2";
export { hidreamPresets } from "./hidream";
export { kontextPresets } from "./kontext";
export { ltxPresets } from "./ltx";
export { ovisPresets } from "./ovis";
export { qwenImagePresets } from "./qwen-image";
export { qwenImageEditPresets } from "./qwen-image-edit";
export { sdClassicPresets } from "./sd-classic";
export { sd3Presets } from "./sd3";
export { wanPresets } from "./wan";
export { zImagePresets } from "./z-image";

export const sdPresetRegistry = {
    ...flux1Presets,
    ...flux2Presets,
    ...kontextPresets,
    ...qwenImagePresets,
    ...qwenImageEditPresets,
    ...zImagePresets,
    ...ernieImagePresets,
    ...animaPresets,
    ...chromaPresets,
    ...chromaRadiancePresets,
    ...distilledSdPresets,
    ...hidreamPresets,
    ...ovisPresets,
    ...sdClassicPresets,
    ...sd3Presets,
    ...wanPresets,
    ...ltxPresets,
} as SdPresetRegistry;

export const supportedSdPresetIds = Object.keys(sdPresetRegistry) as SdPresetId[];
