import type { SdModelPreset } from "../types";
import { modelClipLClipGT5xxlPathInputs } from "./shared";

export const sd3Presets = {
    "sd3-2b": {
        id: "sd3-2b",
        family: "sd3",
        label: "SD 3 Medium 2B",
        description: "Stable Diffusion 3 Medium 2B — MMDiT with bundled text encoders.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelClipLClipGT5xxlPathInputs,
        defaults: {
            cfgScale: 4.5,
            samplingMethod: "euler",
            clipOnCpu: true,
        },
        downloads: [
            { label: "SD3 Medium 2B", url: "https://huggingface.co/stabilityai/stable-diffusion-3-medium", format: "safetensors" },
        ],
    },
    "sd3-5-large": {
        id: "sd3-5-large",
        family: "sd3",
        label: "SD 3.5 Large",
        description: "Stable Diffusion 3.5 Large — requires separate CLIP-L, CLIP-G and T5-XXL encoders.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: modelClipLClipGT5xxlPathInputs,
        defaults: {
            cfgScale: 4.5,
            samplingMethod: "euler",
            clipOnCpu: true,
        },
        downloads: [
            { label: "SD 3.5 Large", url: "https://huggingface.co/stabilityai/stable-diffusion-3.5-large", format: "safetensors" },
            { label: "CLIP-L", url: "https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8/blob/main/text_encoders/clip_l.safetensors", format: "safetensors" },
            { label: "CLIP-G", url: "https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8/blob/main/text_encoders/clip_g.safetensors", format: "safetensors" },
            { label: "T5-XXL", url: "https://huggingface.co/Comfy-Org/stable-diffusion-3.5-fp8/blob/main/text_encoders/t5xxl_fp16.safetensors", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
