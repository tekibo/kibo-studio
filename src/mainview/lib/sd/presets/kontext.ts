import type { SdModelPreset } from "../types";
import { diffusionVaeClipLT5xxlPathInputs } from "../path-fields";

export const kontextPresets = {
    "flux1-kontext-dev": {
        id: "flux1-kontext-dev",
        family: "flux1",
        label: "Flux.1 Kontext Dev",
        description: "FLUX.1-Kontext-dev with reference-image inpainting/editing support. Uses CLIP-L and T5-XXL encoders.",
        defaultVramProfile: "low",
        runMode: "img_gen",
        paths: {},
        pathInputs: diffusionVaeClipLT5xxlPathInputs,
        defaults: {
            cfgScale: 1,
            samplingMethod: "euler",
            diffusionFa: true,
            offloadToCpu: true,
            clipOnCpu: true,
        },
        supportsRefImage: true,
        downloads: [
            { label: "Kontext Dev GGUF", url: "https://huggingface.co/QuantStack/FLUX.1-Kontext-dev-GGUF/tree/main", format: "gguf" },
            { label: "Flux.1 VAE", url: "https://huggingface.co/black-forest-labs/FLUX.1-dev/blob/main/ae.safetensors", format: "safetensors" },
            { label: "CLIP-L", url: "https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/clip_l.safetensors", format: "safetensors" },
            { label: "T5-XXL", url: "https://huggingface.co/comfyanonymous/flux_text_encoders/blob/main/t5xxl_fp16.safetensors", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
