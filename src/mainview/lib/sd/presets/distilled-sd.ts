import type { SdModelPreset } from "../types";
import { modelPathInput } from "./shared";

export const distilledSdPresets = {
    "ssd-1b": {
        id: "ssd-1b",
        family: "distilled-sd",
        label: "SSD-1B",
        description: "Segmind SSD-1B — distilled SDXL with reduced UNet for ~33% faster inference.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelPathInput,
        defaults: {
            cfgScale: 7,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "SSD-1B", url: "https://huggingface.co/segmind/SSD-1B", format: "safetensors" },
        ],
    },
    vega: {
        id: "vega",
        family: "distilled-sd",
        label: "Segmind Vega",
        description: "Segmind Vega — distilled SDXL alternative with LoRA support.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelPathInput,
        defaults: {
            cfgScale: 7,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "Segmind Vega", url: "https://huggingface.co/segmind/Segmind-Vega", format: "safetensors" },
        ],
    },
    "sdxs-512": {
        id: "sdxs-512",
        family: "distilled-sd",
        label: "SDXS-512",
        description: "SDXS-512 — real-time one-step latent diffusion. Uses cfg-scale 1 and 1 step (mandatory).",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelPathInput,
        defaults: {
            cfgScale: 1,
            steps: 1,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "SDXS-512", url: "https://huggingface.co/akleine/sdxs-512", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
