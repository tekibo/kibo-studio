interface SdDownloadEntry {
    platform: "win" | "mac" | "linux";
    arch: string;
    label: string;
    url: string;
    requiresCuda?: boolean;
    requiresCudaExtra?: string;
    cpuFeature?: "avx512" | "avx2" | "avx" | "noavx";
    backend?: "cuda" | "rocm" | "vulkan" | "cpu";
}

const BASE = "https://github.com/leejet/stable-diffusion.cpp/releases/download/master-596-90e87bc";

const CUDA_RUNTIME_URL = `${BASE}/cudart-sd-bin-win-cu12-x64.zip`;

export const SD_DOWNLOADS: SdDownloadEntry[] = [
    {
        platform: "win", arch: "x64", label: "Windows CUDA 12", url: `${BASE}/sd-master-90e87bc-bin-win-cuda12-x64.zip`,
        requiresCuda: true, requiresCudaExtra: CUDA_RUNTIME_URL, backend: "cuda", cpuFeature: "avx2",
    },
    {
        platform: "win", arch: "x64", label: "Windows AVX2 (recommended)", url: `${BASE}/sd-master-90e87bc-bin-win-avx2-x64.zip`,
        backend: "cpu", cpuFeature: "avx2",
    },
    {
        platform: "win", arch: "x64", label: "Windows AVX", url: `${BASE}/sd-master-90e87bc-bin-win-avx-x64.zip`,
        backend: "cpu", cpuFeature: "avx",
    },
    {
        platform: "win", arch: "x64", label: "Windows AVX-512", url: `${BASE}/sd-master-90e87bc-bin-win-avx512-x64.zip`,
        backend: "cpu", cpuFeature: "avx512",
    },
    {
        platform: "win", arch: "x64", label: "Windows (no AVX)", url: `${BASE}/sd-master-90e87bc-bin-win-noavx-x64.zip`,
        backend: "cpu", cpuFeature: "noavx",
    },
    {
        platform: "win", arch: "x64", label: "Windows ROCm", url: `${BASE}/sd-master-90e87bc-bin-win-rocm-x64.zip`,
        backend: "rocm",
    },
    {
        platform: "win", arch: "x64", label: "Windows Vulkan", url: `${BASE}/sd-master-90e87bc-bin-win-vulkan-x64.zip`,
        backend: "vulkan",
    },
    {
        platform: "mac", arch: "arm64", label: "macOS Apple Silicon", url: `${BASE}/sd-master-90e87bc-bin-Darwin-macOS-15.7.4-arm64.zip`,
        backend: "cpu",
    },
    {
        platform: "linux", arch: "x64", label: "Linux ROCm", url: `${BASE}/sd-master-90e87bc-bin-Linux-Ubuntu-24.04-x86_64-rocm.zip`,
        backend: "rocm",
    },
    {
        platform: "linux", arch: "x64", label: "Linux Vulkan", url: `${BASE}/sd-master-90e87bc-bin-Linux-Ubuntu-24.04-x86_64-vulkan.zip`,
        backend: "vulkan",
    },
    {
        platform: "linux", arch: "x64", label: "Linux CPU", url: `${BASE}/sd-master-90e87bc-bin-Linux-Ubuntu-24.04-x86_64.zip`,
        backend: "cpu",
    },
];

export function getPlatform(): "win" | "mac" | "linux" {
    if (navigator.userAgent.includes("Win")) return "win";
    if (navigator.userAgent.includes("Mac")) return "mac";
    return "linux";
}

export function getArch(): string {
    return navigator.userAgent.includes("arm64") || navigator.userAgent.includes("aarch64") ? "arm64" : "x64";
}

export function detectCpuFeature(): string {
    if (typeof document !== "undefined" && "cpu" in navigator) {
        const cpu = (navigator as any).cpu as { architecture?: string } | undefined;
        if (cpu?.architecture) return cpu.architecture;
    }
    return "avx2";
}

export function getRecommendedDownload(): SdDownloadEntry | null {
    const platform = getPlatform();
    const arch = getArch();
    const candidates = SD_DOWNLOADS.filter((d) => d.platform === platform && d.arch === arch);
    if (platform === "win") {
        const cuda = candidates.find((d) => d.backend === "cuda" && d.cpuFeature === "avx2");
        if (cuda) return cuda;
    }
    const recommended = candidates.find((d) => d.backend === "cpu" && d.cpuFeature === "avx2");
    return recommended ?? candidates[0] ?? null;
}

export function getAllForPlatform(): SdDownloadEntry[] {
    const platform = getPlatform();
    const arch = getArch();
    return SD_DOWNLOADS.filter((d) => d.platform === platform && d.arch === arch);
}
