import { type ReactNode } from "react";
import { SidebarInset } from "@/components/ui/sidebar";
import WindowResizer from "@/components/WindowResizer";
import { ModelSelector } from "@/components/ModelSelector";
import { PresetSelector } from "@/components/PresetSelector";
import { useAppStore } from "@/store/appStore";
import WindowsButtons from "@/components/WindowsButtons";
import RefreshButton from "@/components/RefreshButton";
import MissingModels from "@/components/MissingModels";
import { SavingStatus } from "@/pages/settings/components/SavingStatus";
import { isWebUi } from "@/lib/electrobun";

const isWin = navigator.platform?.startsWith("Win");
const webUi = isWebUi();

export function MainLayout({ children }: { children: ReactNode }) {
    const view = useAppStore((s) => s.view)
    return (
        <SidebarInset className="max-h-screen">
            <header className="sticky top-0 flex justify-between h-12 shrink-0 items-center gap-2 pl-3 pr-2 electrobun-webkit-app-region-drag">
                <div className="flex items-center gap-1.5">
                    {view === "dashboard" && (
                        <>
                            <ModelSelector />
                            <PresetSelector />
                        </>
                    )}
                </div>

                <div className="electrobun-webkit-app-region-no-drag flex items-center gap-1">
                    {view === "dashboard" && <MissingModels />}
                    {view === "settings" && <SavingStatus />}
                    {!webUi && <RefreshButton />}
                    {!webUi && <WindowsButtons />}
                </div>
            </header>
            <div className={`
                flex flex-1 flex-col gap-4 overflow-y-auto
                ${view !== "onboarding" && "bg-card/24"}
                ${!webUi && view !== "onboarding" && "rounded-tl-2xl border-l border-t"}
                `}>
                {children}
            </div>
            {isWin && <WindowResizer />}
        </SidebarInset>
    );
}
