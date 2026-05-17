import { pickFile, pickFolder, detectSystem, downloadFile, extractArchive } from "#lib/sd/client";
import { useAppStore } from "#store/appStore";
import { useSdConfigStore } from "#store/sdConfigStore";
import { getRecommendedDownload, getPlatform } from "#lib/sd/downloads";
import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { WelcomeStep } from "./components/WelcomeStep";
import { DetectingStep } from "./components/DetectingStep";
import { ChooseStep } from "./components/ChooseStep";
import { PathStep } from "./components/PathStep";

type Step = "welcome" | "detecting" | "choose" | "download" | "path" | "done";

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
    const [downloadProgress, setDownloadProgress] = useState("");
    const [showAll, setShowAll] = useState(false);
    const [systemInfo, setSystemInfo] = useState("");

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

    const handleDownload = useCallback(async () => {
        if (!installDir.trim() || !selectedUrl) {
            setError("Please select an install location and download option.");
            return;
        }
        setDownloading(true);
        setError("");

        try {
            const zipName = selectedUrl.split("/").pop() ?? "sd-master.zip";
            const zipPath = `${installDir}\\${zipName}`;

            setDownloadProgress("Downloading...");
            const dlError = await downloadFile(selectedUrl, zipPath);
            if (dlError) { setError(dlError); setDownloading(false); return; }

            if (needsCuda && cudaUrl) {
                setDownloadProgress("Downloading CUDA runtime...");
                const cudaName = cudaUrl.split("/").pop() ?? "cudart.zip";
                const cudaPath = `${installDir}\\${cudaName}`;
                const cudaErr = await downloadFile(cudaUrl, cudaPath);
                if (cudaErr) { setError(cudaErr); setDownloading(false); return; }

                setDownloadProgress("Extracting CUDA runtime...");
                const ceErr = await extractArchive(cudaPath, installDir);
                if (ceErr) { setError(ceErr); setDownloading(false); return; }
            }

            setDownloadProgress("Extracting...");
            const exErr = await extractArchive(zipPath, installDir);
            if (exErr) { setError(exErr); setDownloading(false); return; }

            const cliPath = `${installDir}\\sd-cli.exe`;
            setSdCliPathLocal(cliPath);
            setDownloading(false);
            setDownloadProgress("");
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
                downloadProgress={downloadProgress}
                error={error}
                showAll={showAll}
                onSelectDownload={handleSelectDownload}
                onInstallDirChange={(dir) => { setInstallDir(dir); setError(""); }}
                onBrowseInstall={handleBrowseInstall}
                onDownload={handleDownload}
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
