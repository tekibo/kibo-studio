# Adding a New Model to KiboStudio

This document describes the process for adding a new AI model (preset) to KiboStudio.

## Overview

Models are defined as **presets** — structured objects describing the model architecture, required files, default parameters, and download links. Each preset belongs to a **model family** (e.g. `flux2`, `qwen-image-edit`). The registry of all presets is built at import time and consumed by both the Bun backend and the React frontend.

## Step-by-Step Checklist

### 1. Add the model family and preset ID to types

**File:** `src/mainview/lib/sd/types/presets.ts`

Add the new family to the `SdModelFamily` union type and any new preset IDs to the `SdPresetId` union:

```typescript
export type SdModelFamily = "flux2" | "qwen-image" | "qwen-image-edit" | "z-image" | "ernie-image";

export type SdPresetId =
    | "flux2-dev"
    | ...
    | "qwen-image-edit"
    | "qwen-image-edit-2509"
    | "qwen-image-edit-2511";
```

### 2. Add path inputs (if the model needs new file types)

**File:** `src/mainview/lib/sd/path-fields.ts`

If your model needs model file path inputs that aren't already covered, add a new array:

```typescript
export const myCustomPathInputs = [
    {
        key: "diffusionModel",
        label: "Diffusion model",
        required: true,
        placeholder: "D:\\Models\\diffusion\\model.gguf",
    },
    {
        key: "llmVision",
        label: "LLM Vision (mmproj)",
        required: true,
        placeholder: "D:\\Models\\text_encoders\\encoder.mmproj-Q8_0.gguf",
    },
] as const satisfies SdModelPathInput[];
```

The available path keys are defined in `SdModelPaths` in `presets.ts`. If you need a new key, add it to the `Pick` type there, add `--flag` mapping in `args.ts`, and add the key to `pathKeys` in `src/bun/lib/sd/settings.ts`.

### 3. Create the preset definition file

**File:** `src/mainview/lib/sd/presets/your-model.ts`

```typescript
import type { SdModelPreset } from "../types";
import { diffusionVaeLlmPathInputs } from "./shared";
import { myCustomPathInputs } from "../path-fields";

export const myModelPresets = {
    "my-preset-id": {
        id: "my-preset-id",
        family: "my-family",
        label: "My Model Label",
        description: "Description shown in the model selector and settings.",
        defaultVramProfile: "balanced",
        paths: {},
        pathInputs: diffusionVaeLlmPathInputs, // or myCustomPathInputs
        defaults: {
            cfgScale: 2.5,
            samplingMethod: "euler",
            width: 1024,
            height: 1024,
            diffusionFa: true,
            offloadToCpu: true,
            // Any model-specific CLI flags:
            qwenImageZeroCondT: true,
            flowShift: 3,
        },
        downloads: [
            { label: "Model GGUF", url: "https://huggingface.co/...", format: "gguf" },
            { label: "VAE", url: "https://huggingface.co/...", format: "safetensors" },
        ],
    },
} as const satisfies Partial<Record<string, SdModelPreset>>;
```

Key fields:

| Field | Description |
|-------|-------------|
| `id` | Must match the key and be unique across all presets |
| `family` | Groups presets into a model family for the UI selector |
| `label` | Display name in dropdowns |
| `pathInputs` | Which file paths the user must configure in Settings |
| `defaults` | Default CLI parameters (overridden by user config and request params) |
| `defaultVramProfile` | `"low"`, `"balanced"`, or `"high"` |
| `downloads` | Links shown in Settings for downloading model files |

### 4. Register presets in the registry

**File:** `src/mainview/lib/sd/presets/index.ts`

Import your presets and spread them into `sdPresetRegistry`:

```typescript
import { myModelPresets } from "./your-model";
export { myModelPresets } from "./your-model";

export const sdPresetRegistry = {
    ...flux2Presets,
    ...
    ...myModelPresets,
} as SdPresetRegistry;
```

### 5. Add display label

**File:** `src/mainview/lib/sd/options.ts`

Add the family label:

```typescript
export const sdModelFamilyLabels = {
    ...
    "my-family": "My Family Label",
} as const satisfies Record<SdModelFamily, string>;
```

### 6. If the model needs a new CLI flag

**Check:** Does the flag already exist in `SdCliOptions` (`cli.ts`) and `args.ts`?

If not:

1. **`cli.ts`** — Add the property to `SdCliOptions`:
   ```typescript
   myCustomFlag?: boolean;
   // or
   myCustomValue?: number;
   ```

2. **`args.ts`** — Add the mapping:
   - Boolean flags go in `flagOptions`: `["myCustomFlag", "--my-custom-flag"]`
   - Value flags go in `valueOptions`: `["myCustomValue", "--my-custom-value"]`

3. **`generation.ts`** — If the flag is needed in `ImageGenerationRequest`, make sure it's not in the `Omit` exclusion list.

### 7. If the model needs a new model path key

1. **`presets.ts`** — Add the key to `SdModelPaths` `Pick<>` type
2. **`args.ts`** — Add `--flag` mapping for it
3. **`settings.ts`** — Add the key to the `pathKeys` array (for config persistence)

---

## How Editing Works

Image editing models (Qwen Image Edit, Flux2) use the `--ref-image` (`-r`) CLI flag to pass reference/input images. The flow is:

1. User clicks "Reference image" button in the prompt bar
2. Native file dialog opens → user picks an image
3. The file path is stored in `generateStore.initImagePath`
4. On generate, the path is passed as `refImages: [path]` in the request
5. The Bun backend passes `--ref-image path` to `sd-cli.exe`
6. A strength slider (0-1) controls `--strength` for noising/unnoising

Multiple reference images are supported via `generateStore.refImagePaths` — each is added as an additional `--ref-image` flag.

---

## Architecture: Request Flow

```
User clicks Generate
  → PromptInput.tsx (handles init image UI)
    → generateStore.generate()
      → sdConfigStore.buildImageRequest({ prompt, width, height, refImages, ... })
        → RPC: generateImage({ request })
          → bun: applySdUserConfig(request)      # merges saved settings
            → bun: buildImageGenerationOptions()  # builds SdCliOptions
              → bun: buildSdCliArgs()             # serializes to CLI flags
                → spawn sd-cli.exe ...
```

## Key Files Reference

| File | Purpose |
|------|---------|
| `src/mainview/lib/sd/types/presets.ts` | `SdModelFamily`, `SdPresetId`, `SdModelPreset`, `SdModelPaths` types |
| `src/mainview/lib/sd/types/cli.ts` | `SdCliOptions` — all ~130 CLI flags |
| `src/mainview/lib/sd/types/generation.ts` | `ImageGenerationRequest` — what the UI sends |
| `src/mainview/lib/sd/types/settings.ts` | `SdUserConfig`, `SdSettingsResponse` |
| `src/mainview/lib/sd/path-fields.ts` | Path input definitions for Settings UI |
| `src/mainview/lib/sd/presets/index.ts` | Registry combining all presets |
| `src/mainview/lib/sd/presets/*.ts` | Individual preset definitions |
| `src/mainview/lib/sd/args.ts` | CLI flag → string mapping |
| `src/mainview/lib/sd/options.ts` | Defaults, labels, option lists |
| `src/bun/lib/sd/diffusion.ts` | CLI command builder, VRAM profiles |
| `src/bun/lib/sd/settings.ts` | Config CRUD, normalization |
| `src/bun/lib/sd/generate.ts` | Async image generation with job tracking |
| `src/bun/lib/sd/config.ts` | Backend paths (CLI binary, user config) |
| `src/shared/rpc.types.ts` | RPC schema shared between bun and view |
