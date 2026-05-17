import type { SdWeightType } from "./cli";

export type SdConversionModelType = "diffusion" | "llm" | "vae" | "lora";

export type SdConversionRequest = {
    modelPath: string;
    modelType: SdConversionModelType;
    modelName?: string;
    quant?: SdWeightType;
};
