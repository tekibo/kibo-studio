export type SystemInfo = {
    platform: "win" | "mac" | "linux";
    arch: string;
    hasCuda: boolean;
    cpuCores: number;
    totalMemGB: number;
};

export async function detectSystem(): Promise<SystemInfo> {
    const platform = process.platform === "win32" ? "win" : process.platform === "darwin" ? "mac" : "linux";
    const arch = process.arch === "arm64" ? "arm64" : "x64";
    const cpuCores = require("os").cpus().length;
    const totalMemGB = Math.round(require("os").totalmem() / (1024 ** 3));

    let hasCuda = false;
    if (platform === "win") {
        try {
            const nvidiaSmi = Bun.spawnSync(["nvidia-smi", "--version"], {});
            hasCuda = nvidiaSmi.exitCode === 0;
        } catch {
            hasCuda = false;
        }
    }

    return { platform, arch, hasCuda, cpuCores, totalMemGB };
}
