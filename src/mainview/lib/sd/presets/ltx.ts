import type { SdModelPreset } from "../types";
import { diffusionModelVaeLlmAudioVaeEmbeddingsConnectorsPathInputs } from "./shared";

export const ltxPresets = {
    "ltx-23-dev": {
        id: "ltx-23-dev",
        family: "ltx",
        label: "LTX-2.3 Dev",
        description: "LTX-2.3 22B video generation model. Supports T2V, I2V, and FLF2V modes with optional audio VAE.",
        defaultVramProfile: "low",
        runMode: "vid_gen",
        paths: {},
        pathInputs: diffusionModelVaeLlmAudioVaeEmbeddingsConnectorsPathInputs,
        defaults: {
            cfgScale: 6,
            samplingMethod: "euler",
            diffusionFa: true,
            videoFrames: 33,
            fps: 24,
            offloadToCpu: true,
        },
        downloads: [
            { label: "LTX-2.3 GGUF", url: "https://huggingface.co/unsloth/LTX-2.3-GGUF", format: "gguf" },
            { label: "LTX-2.3 Video VAE", url: "https://huggingface.co/unsloth/LTX-2.3-GGUF/tree/main/vae", format: "safetensors" },
            { label: "LTX-2.3 Audio VAE", url: "https://huggingface.co/unsloth/LTX-2.3-GGUF/tree/main/vae", format: "safetensors" },
            { label: "Gemma 3 12B GGUF", url: "https://huggingface.co/unsloth/gemma-3-12b-it-GGUF", format: "gguf" },
            { label: "LTX-2.3 Embeddings Connectors", url: "https://huggingface.co/unsloth/LTX-2.3-GGUF/tree/main/text_encoders", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
