import type { SdModelPreset } from "../types";
import { diffusionVaeClipLT5xxlPathInputs } from "./shared";

export const flux1Presets = {
    "flux1-dev": {
        id: "flux1-dev",
        family: "flux1",
        label: "Flux.1 Dev",
        description: "FLUX.1-dev — the base Flux model with 28-step guidance. Uses CLIP-L and T5-XXL encoders.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeClipLT5xxlPathInputs,
        defaults: {
            cfgScale: 1,
            samplingMethod: "euler",
            clipOnCpu: true,
        },
        downloads: [
            { label: "FLUX.1-dev GGUF", url: "https://huggingface.co/leejet/FLUX.1-dev-gguf", format: "gguf" },
        ],
    },
    "flux1-schnell": {
        id: "flux1-schnell",
        family: "flux1",
        label: "Flux.1 Schnell",
        description: "FLUX.1-schnell — fast 4-step Flux variant. Same encoder setup as Dev.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeClipLT5xxlPathInputs,
        defaults: {
            cfgScale: 1,
            steps: 4,
            samplingMethod: "euler",
            clipOnCpu: true,
        },
        downloads: [
            { label: "FLUX.1-schnell GGUF", url: "https://huggingface.co/leejet/FLUX.1-schnell-gguf", format: "gguf" },
            { label: "Flux.1 VAE", url: "https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/ae.safetensors", format: "safetensors" },
            { label: "CLIP-L", url: "https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors", format: "safetensors" },
            { label: "T5-XXL", url: "https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp16.safetensors", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
