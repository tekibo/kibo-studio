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

export const diffusionVaeLlmLlmVisionPathInputs = [
    ...diffusionVaeLlmPathInputs,
    {
        key: "llmVision",
        label: "LLM Vision (mmproj)",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\encoder.mmproj-Q8_0.gguf",
    },
] as const satisfies SdModelPathInput[];

export function getMissingPresetPathInputs(preset: SdModelPreset, paths: Partial<SdModelPaths> = {}) {
    return preset.pathInputs.filter((input) => input.required && !paths[input.key]?.trim());
}
