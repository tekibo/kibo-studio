import type { SdCliOptions, SdLoraConfig, SdLoraReference } from "./types";

export function formatLoraToken(lora: SdLoraReference) {
    if (!lora.name || lora.name.includes(">")) {
        throw new Error(`Invalid LoRA name: ${lora.name}`);
    }

    return `<lora:${lora.name}:${lora.weight ?? 1}>`;
}

export function appendLorasToPrompt(prompt: string, loras: SdLoraReference[] = []) {
    if (loras.length === 0) {
        return prompt;
    }

    return `${prompt}${loras.map(formatLoraToken).join("")}`;
}

export function getLoraCliOptions(config: SdLoraConfig = {}): Pick<SdCliOptions, "loraApplyMode" | "loraModelDir"> {
    return {
        loraApplyMode: config.applyMode,
        loraModelDir: config.modelDir || undefined,
    };
}
