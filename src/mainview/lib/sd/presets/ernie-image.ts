import type { SdModelPreset } from "../types";
import { diffusionVaeLlmPathInputs } from "./shared";

export const ernieImagePresets = {
    "ernie-image-turbo": {
        id: "ernie-image-turbo",
        family: "ernie-image",
        label: "ERNIE-Image Turbo",
        description: "Low-VRAM-friendly ERNIE-Image Turbo preset with Ministral 3B encoder.",
        defaultVramProfile: "low",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 1,
            steps: 8,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "ERNIE-Image Turbo", url: "https://huggingface.co/Comfy-Org/ERNIE-Image/tree/main/diffusion_models", format: "safetensors" },
            { label: "ERNIE-Image Turbo GGUF", url: "https://huggingface.co/unsloth/ERNIE-Image-Turbo-GGUF/tree/main", format: "gguf" },
            { label: "ERNIE-Image VAE", url: "https://huggingface.co/Comfy-Org/ERNIE-Image/tree/main/vae", format: "safetensors" },
            { label: "Ministral 3B", url: "https://huggingface.co/Comfy-Org/ERNIE-Image/tree/main/text_encoders", format: "safetensors" },
            { label: "Ministral 3B GGUF", url: "https://huggingface.co/unsloth/Ministral-3-3B-Instruct-2512-GGUF/tree/main", format: "gguf" },
        ],
    },
    "ernie-image-base": {
        id: "ernie-image-base",
        family: "ernie-image",
        label: "ERNIE-Image Base",
        description: "Base ERNIE-Image preset with higher CFG guidance.",
        defaultVramProfile: "low",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 5,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "ERNIE-Image", url: "https://huggingface.co/Comfy-Org/ERNIE-Image/tree/main/diffusion_models", format: "safetensors" },
            { label: "ERNIE-Image GGUF", url: "https://huggingface.co/unsloth/ERNIE-Image-GGUF/tree/main", format: "gguf" },
            { label: "ERNIE-Image VAE", url: "https://huggingface.co/Comfy-Org/ERNIE-Image/tree/main/vae", format: "safetensors" },
            { label: "Ministral 3B", url: "https://huggingface.co/Comfy-Org/ERNIE-Image/tree/main/text_encoders", format: "safetensors" },
            { label: "Ministral 3B GGUF", url: "https://huggingface.co/unsloth/Ministral-3-3B-Instruct-2512-GGUF/tree/main", format: "gguf" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
