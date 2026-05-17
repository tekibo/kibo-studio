import { useShallow } from "zustand/react/shallow";
import { useGenerateStore } from "./store";

export function useGenerateAction() {
    return useGenerateStore((state) => state.generate);
}

export function useGenerationBusy() {
    return useGenerateStore((state) => state.isGenerating);
}

export function usePromptInputState() {
    return useGenerateStore(useShallow((state) => ({
        prompt: state.prompt,
        isGenerating: state.isGenerating,
        setPrompt: state.setPrompt,
    })));
}

export function useAspectRatioState() {
    return useGenerateStore(useShallow((state) => ({
        selectedRatio: state.selectedRatio,
        isGenerating: state.isGenerating,
        setSelectedRatio: state.setSelectedRatio,
    })));
}

export function useImagePreviewState() {
    return useGenerateStore(useShallow((state) => ({
        isGenerating: state.isGenerating,
        image: state.image,
        imageError: state.imageError,
        selectedRatio: state.selectedRatio,
        setImageError: state.setImageError,
    })));
}

export function useGenerationError() {
    return useGenerateStore((state) => state.imageError);
}

export function useGenerateButtonState() {
    return useGenerateStore(useShallow((state) => ({
        prompt: state.prompt,
        isGenerating: state.isGenerating,
    })));
}
