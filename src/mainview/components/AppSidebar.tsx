import { useState, useEffect } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "#components/ui/sidebar";
import { useAppStore } from "#store/appStore";
import { useSdDevModeState } from "#store/sdConfigStore";
import { Settings, Sparkles, Globe, Copy, Check } from "lucide-react";
import type { AppView } from "#store/appStore";
import { getElectrobun } from "@/lib/electrobun";
import { cn } from "@/lib/utils";
import { TerminalPanel } from "#components/terminal/TerminalPanel";
import { UpdateSection } from "#components/UpdateSection";

const navItems: { id: AppView; label: string; icon: typeof Sparkles }[] = [
  { id: "dashboard" as AppView, label: "Generate", icon: Sparkles },
  { id: "settings" as AppView, label: "Settings", icon: Settings },
];

export function AppSidebar() {
  const view = useAppStore((s) => s.view);
  const setView = useAppStore((s) => s.setView);
  const { devMode } = useSdDevModeState();
  const [webUrl, setWebUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    getElectrobun().rpc.request.getWebUiUrl({}).then(({ url }) => {
      setWebUrl(url);
    }).catch(() => {});
  }, []);

  async function copyUrl() {
    try {
      await navigator.clipboard.writeText(webUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <Sidebar collapsible="icon" className="border-none">
      <SidebarHeader className="flex flex-row items-center h-12 justify-center group/header electrobun-webkit-app-region-drag">
        <img
          src="icon.png"
          className="size-7 group-data-[collapsible=icon]:group-hover/header:hidden"
        />
        <h1 className="group-data-[collapsible=icon]:hidden">KiboStudio</h1>
        <SidebarTrigger className="group-data-[collapsible=icon]:hidden group-data-[collapsible=icon]:group-hover/header:flex ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <SidebarMenuItem key={item.id}>
                    <SidebarMenuButton
                      isActive={view === item.id}
                      onClick={() => setView(item.id)}
                    >
                      <Icon />
                      <span>{item.label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

      </SidebarContent>
      {devMode && <TerminalPanel />}
      <SidebarFooter className="group-data-[collapsible=icon]:hidden space-y-2">
        {webUrl && (
          <div className="px-3 py-2">
            <div className="flex items-center gap-2 mb-1">
              <Globe className="size-3.5 text-sidebar-foreground/60" />
              <span className="text-[11px] font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                Web UI
              </span>
            </div>
            <button
              onClick={copyUrl}
              className={cn(
                "flex items-center gap-1.5 w-full text-xs rounded-lg px-2 py-1.5 transition-colors",
                "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <span className="truncate">{webUrl}</span>
              {copied ? (
                <Check className="size-3 shrink-0 text-green-500" />
              ) : (
                <Copy className="size-3 shrink-0" />
              )}
            </button>
            <p className="text-[10px] text-sidebar-foreground/40 mt-0.5 px-2">
              Open on any device on your LAN
            </p>
          </div>
        )}
        <UpdateSection />
      </SidebarFooter>
    </Sidebar>
  );
}