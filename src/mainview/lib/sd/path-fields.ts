import type { SdModelPathInput, SdModelPaths, SdModelPreset } from "./types";

export const diffusionVaeLlmPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\model.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\vae.safetensors",
    },
    {
        key: "llm",
        label: "Text encoder / LLM",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\encoder.gguf",
    },
] as const satisfies SdModelPathInput[];

export const diffusionVaeClipLT5xxlPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\model.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\ae.safetensors",
    },
    {
        key: "clipL",
        label: "CLIP-L",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\clip_l.safetensors",
    },
    {
        key: "t5xxl",
        label: "T5-XXL",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\t5xxl_fp16.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const diffusionVaeLlmLlmVisionPathInputs = [
    ...diffusionVaeLlmPathInputs,
    {
        key: "llmVision",
        label: "LLM Vision (mmproj)",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\encoder.mmproj-Q8_0.gguf",
    },
] as const satisfies SdModelPathInput[];

export const modelPathInput = [
    {
        key: "model",
        label: "Model checkpoint",
        required: true,
        placeholder: "D:\\Models\\sd\\model.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const modelVaePathInputs = [
    {
        key: "model",
        label: "Model checkpoint",
        required: true,
        placeholder: "D:\\Models\\sd\\model.safetensors",
    },
    {
        key: "vae",
        label: "VAE",
        required: false,
        placeholder: "D:\\Models\\vae\\vae.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const modelClipLClipGT5xxlPathInputs = [
    {
        key: "model",
        label: "Model checkpoint",
        required: true,
        placeholder: "D:\\Models\\sd3\\sd3_medium.safetensors",
    },
    {
        key: "clipL",
        label: "CLIP-L",
        required: false,
        placeholder: "D:\\Models\\text_encoders\\clip_l.safetensors",
    },
    {
        key: "clipG",
        label: "CLIP-G",
        required: false,
        placeholder: "D:\\Models\\text_encoders\\clip_g.safetensors",
    },
    {
        key: "t5xxl",
        label: "T5-XXL",
        required: false,
        placeholder: "D:\\Models\\text_encoders\\t5xxl_fp16.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelVaeT5xxlPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\model.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\ae.safetensors",
    },
    {
        key: "t5xxl",
        label: "T5-XXL / UMT5-XXL",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\t5xxl_fp16.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelT5xxlPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\model.gguf",
    },
    {
        key: "t5xxl",
        label: "T5-XXL",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\t5xxl_fp16.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const modelVaePhotoMakerPathInputs = [
    {
        key: "model",
        label: "SDXL model checkpoint",
        required: true,
        placeholder: "D:\\Models\\sd\\sdxl_base.safetensors",
    },
    {
        key: "vae",
        label: "VAE",
        required: false,
        placeholder: "D:\\Models\\vae\\sdxl_vae.safetensors",
    },
    {
        key: "photoMaker",
        label: "PhotoMaker model",
        required: false,
        placeholder: "D:\\Models\\photomaker\\photomaker-v1.safetensors",
    },
    {
        key: "pmIdImagesDir",
        label: "PhotoMaker ID images directory",
        required: false,
        placeholder: "D:\\Models\\photomaker\\id_images",
    },
    {
        key: "pmIdEmbedPath",
        label: "PhotoMaker ID embed path (V2 only)",
        required: false,
        placeholder: "D:\\Models\\photomaker\\id_embeds.bin",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelVaeT5xxlPathInputsVideo = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\wan_2.1_vae.safetensors",
    },
    {
        key: "t5xxl",
        label: "UMT5-XXL encoder",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\umt5-xxl-encoder.gguf",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelVaeT5xxlClipVisionPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\wan_2.1_vae.safetensors",
    },
    {
        key: "clipVision",
        label: "CLIP Vision",
        required: true,
        placeholder: "D:\\Models\\clip_vision\\clip_vision_h.safetensors",
    },
    {
        key: "t5xxl",
        label: "UMT5-XXL encoder",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\umt5-xxl-encoder.gguf",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelHighNoiseVaeT5xxlPathInputs = [
    {
        key: "diffusionModel",
        label: "Low-noise diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan-low-noise.gguf",
    },
    {
        key: "highNoiseDiffusionModel",
        label: "High-noise diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan-high-noise.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\wan_2.1_vae.safetensors",
    },
    {
        key: "t5xxl",
        label: "UMT5-XXL encoder",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\umt5-xxl-encoder.gguf",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelHighNoiseVaeT5xxlClipVisionPathInputs = [
    {
        key: "diffusionModel",
        label: "Low-noise diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan-low-noise.gguf",
    },
    {
        key: "highNoiseDiffusionModel",
        label: "High-noise diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan-high-noise.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\wan_2.1_vae.safetensors",
    },
    {
        key: "clipVision",
        label: "CLIP Vision",
        required: true,
        placeholder: "D:\\Models\\clip_vision\\clip_vision_h.safetensors",
    },
    {
        key: "t5xxl",
        label: "UMT5-XXL encoder",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\umt5-xxl-encoder.gguf",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelVaeLlmAudioVaeEmbeddingsConnectorsPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\ltx.gguf",
    },
    {
        key: "vae",
        label: "Video VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\ltx_video_vae.safetensors",
    },
    {
        key: "audioVae",
        label: "Audio VAE",
        required: false,
        placeholder: "D:\\Models\\vae\\ltx_audio_vae.safetensors",
    },
    {
        key: "llm",
        label: "LLM / Text encoder",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\gemma-3-12b.gguf",
    },
    {
        key: "embeddingsConnectors",
        label: "Embeddings connectors",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\ltx_embeddings_connectors.safetensors",
    },
] as const satisfies SdModelPathInput[];

export const diffusionModelVaeT5xxlPathInputsSmallVideo = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\wan-1.3b.gguf",
    },
    {
        key: "vae",
        label: "VAE",
        required: true,
        placeholder: "D:\\Models\\vae\\wan_2.1_vae.safetensors",
    },
    {
        key: "t5xxl",
        label: "UMT5-XXL encoder",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\umt5-xxl-encoder.gguf",
    },
] as const satisfies SdModelPathInput[];

export function getMissingPresetPathInputs(preset: SdModelPreset, paths: Partial<SdModelPaths> = {}) {
    return preset.pathInputs.filter((input) => input.required && !paths[input.key]?.trim());
}
