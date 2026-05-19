import type { SdModelPreset } from "../types";
import { diffusionVaeLlmPathInputs } from "./shared";

export const animaPresets = {
    anima: {
        id: "anima",
        family: "anima",
        label: "Anima Preview",
        description: "Anima — image model using a Qwen3-0.6B LLM encoder. Requires offload-to-cpu.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 6,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "Anima GGUF", url: "https://huggingface.co/Bedovyy/Anima-GGUF", format: "gguf" },
            { label: "Anima VAE", url: "https://huggingface.co/circlestone-labs/Anima/tree/main/split_files/vae", format: "safetensors" },
            { label: "Qwen3-0.6B GGUF", url: "https://huggingface.co/mradermacher/Qwen3-0.6B-Base-GGUF", format: "gguf" },
        ],
    },
    anima2: {
        id: "anima2",
        family: "anima",
        label: "Anima 2",
        description: "Anima 2 — improved version with separate GGUF downloads available.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 6,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "Anima 2 GGUF", url: "https://huggingface.co/JusteLeo/Anima2-GGUF", format: "gguf" },
            { label: "Anima VAE", url: "https://huggingface.co/circlestone-labs/Anima/tree/main/split_files/vae", format: "safetensors" },
            { label: "Qwen3-0.6B GGUF", url: "https://huggingface.co/mradermacher/Qwen3-0.6B-Base-GGUF", format: "gguf" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
