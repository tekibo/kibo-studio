import { getElectrobun } from "@/lib/electrobun";
import { create } from "zustand";
import type { GenerateState } from "./types";
import { ASPECT_RATIOS } from "./constants";
import { useSdConfigStore } from "#store/sdConfigStore";
import { loadWorkingImages, deleteImage as deleteWorkspaceImage } from "#lib/sd/client";

export const useGenerateStore = create<GenerateState>((set, get) => ({
    prompt: "",
    isGenerating: false,
    image: "",
    selectedRatio: ASPECT_RATIOS[1],
    imageError: "",
    currentJobId: "",
    history: [],
    workingImages: [],
    initImagePath: "",
    initImageDataUrl: "",
    maskImagePath: "",
    strength: 0.75,
    refImagePaths: [],
    seed: "",
    isRandomSeed: true,
    resolutionScale: 1,
    steps: 8,
    setPrompt: (prompt) => set({ prompt }),
    setIsGenerating: (isGenerating) => set({ isGenerating }),
    setImage: (image) => set({ image }),
    setSelectedRatio: (selectedRatio) => set({ selectedRatio }),
    setImageError: (imageError) => set({ imageError }),
    setInitImage: (path, dataUrl) => set({ initImagePath: path, initImageDataUrl: dataUrl }),
    clearInitImage: () => set({ initImagePath: "", initImageDataUrl: "" }),
    setMaskImage: (path) => set({ maskImagePath: path }),
    clearMaskImage: () => set({ maskImagePath: "" }),
    setStrength: (strength) => set({ strength }),
    addRefImage: (path) => set((state) => ({ refImagePaths: [...state.refImagePaths, path] })),
    removeRefImage: (index) => set((state) => ({
        refImagePaths: state.refImagePaths.filter((_, i) => i !== index),
    })),
    setSeed: (seed) => set({ seed, isRandomSeed: false }),
    toggleRandomSeed: () => set((state) => ({ seed: "", isRandomSeed: !state.isRandomSeed })),
    setResolutionScale: (scale) => set({ resolutionScale: scale }),
    setSteps: (steps) => set({ steps }),
    cancelGeneration: async () => {
        const jobId = get().currentJobId;
        if (!jobId) return;
        try {
            await getElectrobun().rpc.request.cancelGeneration({ jobId });
        } catch { }
        set({ isGenerating: false, currentJobId: "" });
    },
    generate: async () => {
        const state = get();
        const prompt = state.prompt.trim();

        if ((!prompt && !state.initImagePath && state.refImagePaths.length === 0) || state.isGenerating) {
            return;
        }

        set({ isGenerating: true, image: "", imageError: "", currentJobId: "" });

        try {
            const configStore = useSdConfigStore.getState();

            if (configStore.isSettingsDirty) {
                await configStore.saveSdSettings();
            }

            const selectedRatio = get().selectedRatio;
            const initPath = get().initImagePath;
            const workingImages = get().workingImages;
            const initEntry = initPath ? workingImages.find(w => w.id === initPath) : undefined;
            const initRefPath = initEntry ? `workspace/${initEntry.fileName}` : undefined;
            const refImages = initRefPath
                ? [initRefPath, ...get().refImagePaths]
                : initPath
                    ? [initPath, ...get().refImagePaths]
                    : get().refImagePaths.length > 0
                        ? get().refImagePaths
                        : undefined;

            const scale = get().resolutionScale;
            const seedVal = get().isRandomSeed ? undefined : parseInt(get().seed, 10);
            const presetSteps = configStore.sdPresets
                .find((p) => p.id === configStore.selectedPresetId)
                ?.defaults?.steps;
            const effectiveSteps = get().steps ?? presetSteps ?? 8;
            const imageRequest = useSdConfigStore.getState().buildImageRequest({
                prompt,
                width: Math.round(selectedRatio.width * scale),
                height: Math.round(selectedRatio.height * scale),
                refImages,
                mask: initPath && get().maskImagePath ? get().maskImagePath : undefined,
                strength: initPath ? get().strength : undefined,
                seed: Number.isFinite(seedVal) ? seedVal : undefined,
                steps: effectiveSteps,
            });
            const data = await getElectrobun().rpc.request.generateImage({ request: imageRequest });

            if (!data.jobId) {
                throw new Error(data.error ?? "Generation did not return a job id");
            }

            set((current) => ({
                prompt: "",
                currentJobId: data.jobId!,
                history: [
                    {
                        jobId: data.jobId!,
                        prompt,
                        width: selectedRatio.width,
                        height: selectedRatio.height,
                        createdAt: Date.now(),
                        status: "pending" as const,
                        initImageDataUrl: current.initImageDataUrl || undefined,
                        strength: current.initImageDataUrl ? current.strength : undefined,
                    },
                    ...current.history,
                ].slice(0, 50),
            }));

            await get().pollForResult(data.jobId);
        } catch (error) {
            const msg = error instanceof Error ? error.message : "Generation failed";
            set({ isGenerating: false, imageError: msg });
        }
    },
    pollForResult: async (jobId) => {
        while (true) {
            await new Promise((resolve) => setTimeout(resolve, 500));

            try {
                const data = await getElectrobun().rpc.request.getJobStatus({ jobId });

                if (data.status === "completed" && data.image) {
                    get().updateHistoryItem(jobId, { image: data.image, status: "completed" });
                    set({ image: data.image, isGenerating: false });
                    // Refresh working images to include the new one
                    await get().loadWorkingImages();
                    break;
                }

                if (data.status === "failed") {
                    const errorMsg = data.error || "Generation failed";
                    get().updateHistoryItem(jobId, { status: "failed", error: errorMsg });
                    set({ isGenerating: false, imageError: errorMsg });
                    break;
                }
            } catch (error) {
                const msg = error instanceof Error ? error.message : "Polling failed";
                get().updateHistoryItem(jobId, { status: "failed", error: msg });
                set({ isGenerating: false, imageError: msg });
                break;
            }
        }
    },
    updateHistoryItem: (jobId, item) => set((state) => ({
        history: state.history.map((historyItem) => historyItem.jobId === jobId ? { ...historyItem, ...item } : historyItem),
    })),
    loadWorkingImages: async () => {
        try {
            const images = await loadWorkingImages();
            set({ workingImages: images });
        } catch { }
    },
    deleteHistoryItem: (jobId) => {
        const item = get().history.find((h) => h.jobId === jobId);
        if (item?.status === "completed") {
            void deleteWorkspaceImage(item.jobId);
        }
        set((state) => ({
            history: state.history.filter((h) => h.jobId !== jobId),
        }));
    },
    removeWorkingImage: async (id) => {
        await deleteWorkspaceImage(id);
        set((state) => ({
            workingImages: state.workingImages.filter((img) => img.id !== id),
        }));
    },
    reset: () => set({
        prompt: "",
        image: "",
        imageError: "",
        isGenerating: false,
        currentJobId: "",
        initImagePath: "",
        initImageDataUrl: "",
        maskImagePath: "",
        strength: 0.75,
        refImagePaths: [],
    }),
}));
