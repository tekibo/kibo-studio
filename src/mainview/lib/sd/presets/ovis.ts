import type { SdModelPreset } from "../types";
import { diffusionVaeLlmPathInputs } from "./shared";

export const ovisPresets = {
    "ovis-image": {
        id: "ovis-image",
        family: "ovis",
        label: "Ovis-Image 7B",
        description: "Ovis-Image-7B — Flux-based model using a separate LLM encoder and VAE.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 5,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "Ovis-Image GGUF", url: "https://huggingface.co/leejet/Ovis-Image-7B-GGUF", format: "gguf" },
            { label: "Flux.1-Schnell VAE", url: "https://huggingface.co/black-forest-labs/FLUX.1-schnell/tree/main", format: "safetensors" },
            { label: "Ovis 2.5 Text Encoder", url: "https://huggingface.co/Comfy-Org/Ovis-Image/tree/main/split_files/text_encoders", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
