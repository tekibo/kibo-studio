import type {
    SdCacheMode,
    SdLoraApplyMode,
    SdModelFamily,
    SdPresetId,
    SdSamplingMethod,
    SdScmPolicy,
    SdUserConfig,
    SdVramProfile,
} from "./types";

export const DEFAULT_SD_PRESET_ID = "z-image-turbo" satisfies SdPresetId;

export const NO_CACHE_MODE = "none";

export const sdModelFamilyLabels = {
    flux2: "Flux.2",
    flux1: "Flux.1",
    "qwen-image": "Qwen Image",
    "qwen-image-edit": "Qwen Image Edit",
    "z-image": "Z-Image",
    "ernie-image": "ERNIE-Image",
    "sd-classic": "Stable Diffusion 1.x/2.x/XL",
    sd3: "Stable Diffusion 3 / 3.5",
    chroma: "Chroma",
    "chroma-radiance": "Chroma Radiance",
    anima: "Anima",
    hidream: "HiDream-O1-Image",
    ovis: "Ovis-Image",
    "distilled-sd": "Distilled SD",
    wan: "Wan",
    ltx: "LTX-2",
} as const satisfies Record<SdModelFamily, string>;

export const sdVramProfileOptions = [
    { value: "low", label: "Low VRAM", description: "CPU offload, VAE/CLIP on CPU, VAE tiling." },
    { value: "balanced", label: "Balanced", description: "CPU offload with diffusion flash attention." },
    { value: "high", label: "High VRAM", description: "Keep more work on GPU." },
] as const satisfies readonly { value: SdVramProfile; label: string; description: string }[];

export const sdSamplingMethodOptions = [
    "euler",
    "euler_a",
    "heun",
    "dpm2",
    "dpm++2s_a",
    "dpm++2m",
    "dpm++2mv2",
    "ipndm",
    "ipndm_v",
    "lcm",
    "ddim_trailing",
    "tcd",
    "res_multistep",
    "res_2s",
    "er_sde",
] as const satisfies readonly SdSamplingMethod[];

export const sdCacheModeOptions = [
    { value: NO_CACHE_MODE, label: "No cache" },
    { value: "cache-dit", label: "Cache DiT" },
    { value: "taylorseer", label: "TaylorSeer" },
    { value: "dbcache", label: "DBCache" },
    { value: "easycache", label: "EasyCache" },
    { value: "ucache", label: "UCache" },
    { value: "spectrum", label: "Spectrum" },
] as const satisfies readonly { value: SdCacheMode | typeof NO_CACHE_MODE; label: string }[];

export const sdScmPolicyOptions = ["dynamic", "static"] as const satisfies readonly SdScmPolicy[];

export const sdLoraApplyModeOptions = ["auto", "immediately", "at_runtime"] as const satisfies readonly SdLoraApplyMode[];

export const defaultSdUserConfig = {
    selectedPresetId: DEFAULT_SD_PRESET_ID,
    vramProfile: "low",
    samplingMethod: "euler",
    cacheMode: NO_CACHE_MODE,
    scmPolicy: "dynamic",
    loraApplyMode: "auto",
    loraModelDir: "",
    sdCliPath: "",
    pathsByPreset: {},
    perfFlags: {},
    devMode: false,
} as const satisfies SdUserConfig;
