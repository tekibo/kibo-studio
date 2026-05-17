import { useAppStore } from "#store/appStore";
import { OnboardingPage } from "#pages/onboarding/page";
import { DashboardPage } from "#pages/dashboard/page";
import { SettingsPage } from "#pages/settings/page";
import { ErrorBoundary } from "#components/ErrorBoundary";
import { MainLayout } from "@/layouts/MainLayout";
import { Toaster } from "@/components/ui/sonner";
import { useEffect } from "react";
import { useSdConfigStore } from "#store/sdConfigStore";
import { useGenerateStore } from "#store/generateStore";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip";
import { SidebarProvider } from "./components/ui/sidebar";
import { AppSidebar } from "./components/AppSidebar";
import { isWebUi, getElectrobun } from "./lib/electrobun";
import { toast } from "sonner";

function App() {
    const view = useAppStore((s) => s.view);
    const setView = useAppStore((s) => s.setView);
    const hasHydrated = useSdConfigStore((s) => s.hasHydratedSettings);
    const loadSdSettings = useSdConfigStore((s) => s.loadSdSettings);
    const loadWorkingImages = useGenerateStore((s) => s.loadWorkingImages);

    useEffect(() => {
        void loadSdSettings();
    }, [loadSdSettings]);

    useEffect(() => {
        if (hasHydrated) {
            void loadWorkingImages();
            const cliPath = useSdConfigStore.getState().sdCliPath;
            if (cliPath.trim()) {
                setView("dashboard");
            }
        }
    }, [hasHydrated, setView, loadWorkingImages]);

    useEffect(() => {
        // Disable right-click menu entirely in production
        const handleContextMenu = (e: MouseEvent) => {
            if (import.meta.env.PROD) {
                e.preventDefault();
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        return () => document.removeEventListener('contextmenu', handleContextMenu);
    }, []);

    useEffect(() => {
        if (isWebUi()) return;

        const handler = (e: Event) => {
            const { status, version, error } = (e as CustomEvent).detail;
            if (status === "download-ready") {
                const eb = getElectrobun();
                toast("Update ready", {
                    description: `Version ${version} downloaded. Restart to apply.`,
                    duration: 30000,
                    action: {
                        label: "Install now",
                        onClick: () => eb.rpc.request.applyUpdate({}),
                    },
                });
            } else if (status === "error") {
                toast.error("Update check failed", {
                    description: error,
                    duration: 5000,
                });
            } else if (status === "no-update") {
                // silently ignore on auto-check
            }
        };

        window.addEventListener("update-status", handler);
        return () => window.removeEventListener("update-status", handler);
    }, []);

    if (!hasHydrated) {
        return (
            <div className="flex h-screen min-h-0 bg-background">
                <div className="flex min-w-0 min-h-0 flex-1 flex-col bg-background h-full overflow-hidden">
                    <div className="flex flex-1 items-center justify-center">
                        <div className="flex flex-col items-center gap-3">
                            <div className="size-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                            <p className="m-0 text-sm text-muted-foreground">Loading...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const webUI = isWebUi()

    return (
        <ErrorBoundary>
            <TooltipProvider>
                <SidebarProvider>
                    {view !== "onboarding" && <AppSidebar />}
                    <MainLayout>
                        {view === "dashboard" && <DashboardPage />}
                        {view === "settings" && <SettingsPage />}
                        {webUI && view === "onboarding" && (
                            <div className="flex flex-1 flex-col items-center justify-center p-12">
                                <h1 className="text-xl font-black text-center">Complete Set-Up on your main hardware first and then refresh the page.</h1>
                            </div>
                        )}
                        {view === "onboarding" && <OnboardingPage />}
                    </MainLayout>
                </SidebarProvider>
                <Toaster position="bottom-right" richColors closeButton />
            </TooltipProvider>
        </ErrorBoundary>
    );
}

export default App;
