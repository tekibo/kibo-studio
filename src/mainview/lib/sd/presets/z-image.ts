import type { SdModelPreset } from "../types";
import { diffusionVaeLlmPathInputs } from "./shared";

export const zImagePresets = {
    "z-image-turbo": {
        id: "z-image-turbo",
        family: "z-image",
        label: "Z-Image Turbo",
        description: "Low-VRAM-friendly Z-Image Turbo preset.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 1,
            width: 512,
            height: 1024,
            steps: 8,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "Z-Image Turbo", url: "https://huggingface.co/Comfy-Org/z_image_turbo/tree/main/split_files/diffusion_models", format: "safetensors" },
            { label: "Z-Image Turbo GGUF", url: "https://huggingface.co/leejet/Z-Image-Turbo-GGUF/tree/main", format: "gguf" },
            { label: "Flux VAE", url: "https://huggingface.co/black-forest-labs/FLUX.1-schnell/tree/main", format: "safetensors" },
            { label: "Qwen3 4B", url: "https://huggingface.co/Comfy-Org/z_image_turbo/tree/main/split_files/text_encoders", format: "safetensors" },
            { label: "Qwen3 4B GGUF", url: "https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-GGUF/tree/main", format: "gguf" },
        ],
    },
    "z-image-base": {
        id: "z-image-base",
        family: "z-image",
        label: "Z-Image Base",
        description: "Base Z-Image preset with higher CFG guidance.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 5,
            width: 512,
            height: 1024,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "Z-Image", url: "https://huggingface.co/Comfy-Org/z_image/tree/main/split_files/diffusion_models", format: "safetensors" },
            { label: "Z-Image GGUF", url: "https://huggingface.co/unsloth/Z-Image-GGUF/tree/main", format: "gguf" },
            { label: "Flux VAE", url: "https://huggingface.co/black-forest-labs/FLUX.1-schnell/tree/main", format: "safetensors" },
            { label: "Qwen3 4B", url: "https://huggingface.co/Comfy-Org/z_image_turbo/tree/main/split_files/text_encoders", format: "safetensors" },
            { label: "Qwen3 4B GGUF", url: "https://huggingface.co/unsloth/Qwen3-4B-Instruct-2507-GGUF/tree/main", format: "gguf" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
