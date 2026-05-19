import type { SdModelPreset } from "../types";
import { modelPathInput } from "./shared";

export const hidreamPresets = {
    "hidream-dev": {
        id: "hidream-dev",
        family: "hidream",
        label: "HiDream-O1-Image Dev",
        description: "HiDream-O1-Image-Dev — standalone checkpoint with cfg_scale 1.0.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelPathInput,
        defaults: {
            cfgScale: 1,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "HiDream-O1-Image-Dev", url: "https://huggingface.co/Comfy-Org/HiDream-O1-Image/tree/main/checkpoints", format: "safetensors" },
        ],
    },
    hidream: {
        id: "hidream",
        family: "hidream",
        label: "HiDream-O1-Image Full",
        description: "HiDream-O1-Image — full checkpoint without cfg_scale restriction.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelPathInput,
        defaults: {
            cfgScale: 4.5,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "HiDream-O1-Image", url: "https://huggingface.co/Comfy-Org/HiDream-O1-Image/tree/main/checkpoints", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
