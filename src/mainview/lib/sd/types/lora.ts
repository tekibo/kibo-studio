import type { SdLoraApplyMode } from "./cli";

export type SdLoraReference = {
    name: string;
    weight?: number;
};

export type SdLoraConfig = {
    loras?: SdLoraReference[];
    modelDir?: string;
    applyMode?: SdLoraApplyMode;
};
