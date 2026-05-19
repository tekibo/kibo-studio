import type { ASPECT_RATIOS } from "./constants";
import type { WorkingImageEntry } from "#shared/rpc.types";

export type AspectRatio = typeof ASPECT_RATIOS[number];

export type WorkingImage = WorkingImageEntry;

export type GenerationHistoryItem = {
    jobId: string;
    prompt: string;
    image?: string;
    width: number;
    height: number;
    createdAt: number;
    status: "pending" | "completed" | "failed";
    error?: string;
    initImageDataUrl?: string;
    strength?: number;
};

export type GenerateState = {
    prompt: string;
    isGenerating: boolean;
    image: string;
    selectedRatio: AspectRatio;
    imageError: string;
    currentJobId: string;
    history: GenerationHistoryItem[];
    workingImages: WorkingImage[];
    initImagePath: string;
    initImageDataUrl: string;
    maskImagePath: string;
    strength: number;
    refImagePaths: string[];
    seed: string;
    isRandomSeed: boolean;
    resolutionScale: number;
    steps: number;
    videoFrames: number;
    fps: number;
    flowShift: number;
    pmStyleStrength: number;
    setPrompt: (prompt: string) => void;
    setIsGenerating: (isGenerating: boolean) => void;
    setImage: (image: string) => void;
    setSelectedRatio: (ratio: AspectRatio) => void;
    setImageError: (error: string) => void;
    setInitImage: (path: string, dataUrl: string) => void;
    clearInitImage: () => void;
    setMaskImage: (path: string) => void;
    clearMaskImage: () => void;
    setStrength: (strength: number) => void;
    addRefImage: (path: string) => void;
    removeRefImage: (index: number) => void;
    setSeed: (seed: string) => void;
    toggleRandomSeed: () => void;
    setResolutionScale: (scale: number) => void;
    setSteps: (steps: number) => void;
    setVideoFrames: (frames: number) => void;
    setFps: (fps: number) => void;
    setFlowShift: (shift: number) => void;
    setPmStyleStrength: (strength: number) => void;
    generate: () => Promise<void>;
    cancelGeneration: () => Promise<void>;
    pollForResult: (jobId: string) => Promise<void>;
    updateHistoryItem: (jobId: string, item: Partial<GenerationHistoryItem>) => void;
    deleteHistoryItem: (jobId: string) => void;
    loadWorkingImages: () => Promise<void>;
    removeWorkingImage: (id: string) => void;
    reset: () => void;
}
