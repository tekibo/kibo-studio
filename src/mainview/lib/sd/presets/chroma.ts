import type { SdModelPreset } from "../types";
import { diffusionModelVaeT5xxlPathInputs } from "./shared";

export const chromaPresets = {
    chroma: {
        id: "chroma",
        family: "chroma",
        label: "Chroma",
        description: "Chroma — Flux-based model optimised for 4-6 GB VRAM with chroma-disable-dit-mask.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionModelVaeT5xxlPathInputs,
        defaults: {
            cfgScale: 4,
            samplingMethod: "euler",
            clipOnCpu: true,
            chromaDisableDitMask: true,
        },
        downloads: [
            { label: "Chroma GGUF", url: "https://huggingface.co/silveroxides/Chroma-GGUF", format: "gguf" },
            { label: "Flux.1 VAE", url: "https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/ae.safetensors", format: "safetensors" },
            { label: "T5-XXL", url: "https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp16.safetensors", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
