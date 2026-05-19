import type { SdModelPreset } from "../types";
import { modelVaePathInputs } from "./shared";

export const sdClassicPresets = {
    "sd-v1-5": {
        id: "sd-v1-5",
        family: "sd-classic",
        label: "SD 1.5",
        description: "Stable Diffusion 1.5 — classic UNet-based image generation.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelVaePathInputs,
        defaults: {
            cfgScale: 7,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "SD 1.5", url: "https://huggingface.co/runwayml/stable-diffusion-v1-5", format: "safetensors" },
        ],
    },
    "sd-v2-1": {
        id: "sd-v2-1",
        family: "sd-classic",
        label: "SD 2.1",
        description: "Stable Diffusion 2.1 — improved quality and 768px native resolution.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelVaePathInputs,
        defaults: {
            cfgScale: 7,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "SD 2.1", url: "https://huggingface.co/stabilityai/stable-diffusion-2-1", format: "safetensors" },
        ],
    },
    "sdxl-base": {
        id: "sdxl-base",
        family: "sd-classic",
        label: "SDXL Base",
        description: "Stable Diffusion XL — 1024px native with optional PhotoMaker personalization.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        supportsPhotoMaker: true,
        paths: {},
        pathInputs: modelVaePathInputs,
        defaults: {
            cfgScale: 7,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "SDXL Base", url: "https://huggingface.co/stabilityai/stable-diffusion-xl-base-1.0", format: "safetensors" },
            { label: "SDXL VAE", url: "https://huggingface.co/madebyollin/sdxl-vae-fp16-fix", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
