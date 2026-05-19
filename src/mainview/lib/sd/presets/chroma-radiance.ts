import type { SdModelPreset } from "../types";
import { diffusionModelT5xxlPathInputs } from "./shared";

export const chromaRadiancePresets = {
    "chroma-radiance": {
        id: "chroma-radiance",
        family: "chroma-radiance",
        label: "Chroma Radiance",
        description: "Chroma1-Radiance — Flux-based; requires only a diffusion model and T5-XXL (no separate VAE).",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionModelT5xxlPathInputs,
        defaults: {
            cfgScale: 4,
            samplingMethod: "euler",
        },
        downloads: [
            { label: "Chroma1-Radiance GGUF", url: "https://huggingface.co/silveroxides/Chroma1-Radiance-GGUF", format: "gguf" },
            { label: "T5-XXL", url: "https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp16.safetensors", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
