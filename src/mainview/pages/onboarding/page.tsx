import { pickFile, pickFolder, detectSystem, startDownload, cancelDownload, extractArchive } from "#lib/sd/client";
import { onDownloadProgress } from "#lib/electrobun";
import { useAppStore } from "#store/appStore";
import { useSdConfigStore } from "#store/sdConfigStore";
import { getRecommendedDownload, getPlatform } from "#lib/sd/downloads";
import { useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { WelcomeStep } from "./components/WelcomeStep";
import { DetectingStep } from "./components/DetectingStep";
import { ChooseStep } from "./components/ChooseStep";
import { PathStep } from "./components/PathStep";
import type { DownloadProgressInfo } from "#shared/rpc.types";

type Step = "welcome" | "detecting" | "choose" | "download" | "path" | "done";

function waitForDownload(downloadId: string, onInfo: (info: DownloadProgressInfo) => void): Promise<DownloadProgressInfo> {
    return new Promise((resolve) => {
        const unsub = onDownloadProgress((data) => {
            if (data.downloadId === downloadId) {
                onInfo(data);
                if (data.status !== "downloading") {
                    unsub();
                    resolve(data);
                }
            }
        });
    });
}

export function OnboardingPage() {
    const [step, setStep] = useState<Step>("welcome");
    const [selectedUrl, setSelectedUrl] = useState("");
    const [selectedLabel, setSelectedLabel] = useState("");
    const [needsCuda, setNeedsCuda] = useState(false);
    const [cudaUrl, setCudaUrl] = useState("");
    const [installDir, setInstallDir] = useState("");
    const [sdCliPath, setSdCliPathLocal] = useState("");
    const [error, setError] = useState("");
    const [downloading, setDownloading] = useState(false);
    const [downloadPhase, setDownloadPhase] = useState("");
    const [downloadInfo, setDownloadInfo] = useState<DownloadProgressInfo | null>(null);
    const [showAll, setShowAll] = useState(false);
    const [systemInfo, setSystemInfo] = useState("");
    const currentDownloadIdRef = useRef<string | null>(null);

    const setView = useAppStore((s) => s.setView);
    const persistSdCliPath = useSdConfigStore((s) => s.setSdCliPath);

    useEffect(() => {
        const os = getPlatform();
        if (os === "win") setInstallDir("D:\\kibo-studio\\sd-master");
        else if (os === "mac") setInstallDir("/Applications/kibo-studio/sd-master");
        else setInstallDir("/opt/kibo-studio/sd-master");
    }, []);

    const handleStartDetection = useCallback(async () => {
        setStep("detecting");
        setError("");
        try {
            const info = await detectSystem();
            const parts = [`${info.platform.toUpperCase()} ${info.arch}`, `${info.cpuCores} cores`, `${info.totalMemGB} GB RAM`];
            if (info.hasCuda) parts.push("CUDA detected");
            setSystemInfo(parts.join(" · "));

            const rec = getRecommendedDownload();
            if (rec) {
                setSelectedUrl(rec.url);
                setSelectedLabel(rec.label);
                setNeedsCuda(!!rec.requiresCuda);
                setCudaUrl(rec.requiresCudaExtra ?? "");
            }
            setStep("choose");
        } catch {
            setError("Could not detect system. Please configure manually.");
            setStep("path");
        }
    }, []);

    const handleSelectDownload = (url: string, label: string, needsCudaExt?: boolean, cudaUrl?: string) => {
        setSelectedUrl(url);
        setSelectedLabel(label);
        setNeedsCuda(!!needsCudaExt);
        setCudaUrl(cudaUrl ?? "");
    };

    const handleCancel = useCallback(() => {
        const id = currentDownloadIdRef.current;
        if (id) {
            cancelDownload(id);
        }
    }, []);

    const handleDownload = useCallback(async () => {
        if (!installDir.trim() || !selectedUrl) {
            setError("Please select an install location and download option.");
            return;
        }
        setDownloading(true);
        setError("");
        setDownloadInfo(null);

        const runPhase = async (phase: string, url: string, path: string): Promise<DownloadProgressInfo | null> => {
            setDownloadPhase(phase);
            setDownloadInfo(null);
            const downloadId = await startDownload(url, path);
            currentDownloadIdRef.current = downloadId;
            const result = await waitForDownload(downloadId, setDownloadInfo);
            currentDownloadIdRef.current = null;
            return result;
        };

        try {
            const zipName = selectedUrl.split("/").pop() ?? "sd-master.zip";
            const zipPath = `${installDir}\\${zipName}`;

            const mainResult = await runPhase("Downloading...", selectedUrl, zipPath);
            if (!mainResult || mainResult.status === "cancelled") { setDownloading(false); return; }
            if (mainResult.status === "error") { setError(mainResult.error ?? "Download failed"); setDownloading(false); return; }

            if (needsCuda && cudaUrl) {
                const cudaName = cudaUrl.split("/").pop() ?? "cudart.zip";
                const cudaPath = `${installDir}\\${cudaName}`;

                const cudaResult = await runPhase("Downloading CUDA runtime...", cudaUrl, cudaPath);
                if (!cudaResult || cudaResult.status === "cancelled") { setDownloading(false); return; }
                if (cudaResult.status === "error") { setError(cudaResult.error ?? "CUDA download failed"); setDownloading(false); return; }

                setDownloadPhase("Extracting CUDA runtime...");
                setDownloadInfo(null);
                const ceErr = await extractArchive(cudaPath, installDir);
                if (ceErr) { setError(ceErr); setDownloading(false); return; }
            }

            setDownloadPhase("Extracting...");
            setDownloadInfo(null);
            const exErr = await extractArchive(zipPath, installDir);
            if (exErr) { setError(exErr); setDownloading(false); return; }

            const cliPath = `${installDir}\\sd-cli.exe`;
            setSdCliPathLocal(cliPath);
            setDownloading(false);
            setDownloadInfo(null);
            setStep("path");
            toast("Download complete! Point to sd-cli.exe to finish.", { duration: 4000 });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Something went wrong");
            setDownloading(false);
        }
    }, [installDir, selectedUrl, needsCuda, cudaUrl]);

    const handleFinish = async () => {
        if (!sdCliPath.trim()) { setError("Please confirm the path to sd-cli.exe"); return; }
        persistSdCliPath(sdCliPath.trim());
        await useSdConfigStore.getState().saveSdSettings();
        setView("dashboard");
    };

    const handleBrowseInstall = async () => {
        const dir = await pickFolder();
        if (dir) { setInstallDir(dir); setError(""); }
    };

    const handleBrowseSdCli = async () => {
        const p = await pickFile("Executable files (*.exe)|*.exe|All files (*.*)|*.*");
        if (p) { setSdCliPathLocal(p); setError(""); }
    };

    if (step === "welcome") {
        return <WelcomeStep onStartDetection={handleStartDetection} onManualSetup={() => setStep("path")} />;
    }

    if (step === "detecting") {
        return <DetectingStep />;
    }

    if (step === "choose") {
        return (
            <ChooseStep
                selectedUrl={selectedUrl}
                selectedLabel={selectedLabel}
                systemInfo={systemInfo}
                installDir={installDir}
                downloading={downloading}
                downloadPhase={downloadPhase}
                downloadInfo={downloadInfo}
                error={error}
                showAll={showAll}
                onSelectDownload={handleSelectDownload}
                onInstallDirChange={(dir) => { setInstallDir(dir); setError(""); }}
                onBrowseInstall={handleBrowseInstall}
                onDownload={handleDownload}
                onCancel={handleCancel}
                onSkip={() => setStep("path")}
                onToggleShowAll={() => setShowAll(!showAll)}
            />
        );
    }

    if (step === "path") {
        return (
            <PathStep
                sdCliPath={sdCliPath}
                error={error}
                onSdCliPathChange={(path) => { setSdCliPathLocal(path); setError(""); }}
                onBrowse={handleBrowseSdCli}
                onFinish={handleFinish}
            />
        );
    }

    return null;
}
