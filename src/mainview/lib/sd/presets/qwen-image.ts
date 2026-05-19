import type { SdModelPreset } from "../types";
import { diffusionVaeLlmPathInputs } from "./shared";

export const qwenImagePresets = {
    "qwen-image": {
        id: "qwen-image",
        family: "qwen-image",
        label: "Qwen Image",
        description: "Qwen Image preset with Qwen2.5-VL 7B text encoder and flow-shift tuning.",
        defaultVramProfile: "balanced",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs,
        defaults: {
            cfgScale: 2.5,
            samplingMethod: "euler",
            width: 1024,
            height: 1024,
            flowShift: 3,
            diffusionFa: true,
            offloadToCpu: true,
        },
        downloads: [
            { label: "Qwen Image", url: "https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/tree/main/split_files/diffusion_models", format: "safetensors" },
            { label: "Qwen Image GGUF", url: "https://huggingface.co/QuantStack/Qwen-Image-GGUF/tree/main", format: "gguf" },
            { label: "Qwen Image VAE", url: "https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/tree/main/split_files/vae", format: "safetensors" },
            { label: "Qwen2.5-VL 7B", url: "https://huggingface.co/Comfy-Org/Qwen-Image_ComfyUI/tree/main/split_files/text_encoders", format: "safetensors" },
            { label: "Qwen2.5-VL 7B GGUF", url: "https://huggingface.co/mradermacher/Qwen2.5-VL-7B-Instruct-GGUF/tree/main", format: "gguf" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
