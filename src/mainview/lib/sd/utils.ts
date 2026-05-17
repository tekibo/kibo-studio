import {
    sdLoraApplyModeOptions,
    sdSamplingMethodOptions,
    sdScmPolicyOptions,
} from "#lib/sd/options";
import type { SdModelPaths } from "#store/sdConfigStore";

export function formatOption(value: string) {
    return value
        .replaceAll("_", " ")
        .replaceAll("++", "++ ")
        .replace(/\b\w/g, (match) => match.toUpperCase());
}

export const EMPTY_PATHS: Partial<SdModelPaths> = {};

export const SAMPLING_METHOD_SELECT_OPTIONS = sdSamplingMethodOptions.map((method) => ({
    value: method,
    label: formatOption(method),
}));

export const SCM_POLICY_SELECT_OPTIONS = sdScmPolicyOptions.map((policy) => ({
    value: policy,
    label: formatOption(policy),
}));

export const LORA_APPLY_MODE_SELECT_OPTIONS = sdLoraApplyModeOptions.map((mode) => ({
    value: mode,
    label: formatOption(mode),
}));

export function getMissingPathsForPreset(
    preset: { pathInputs: { key: string; required?: boolean }[] },
    paths: Partial<Record<string, string>>,
) {
    return preset.pathInputs.filter((i) => i.required && !paths[i.key]?.trim());
}
