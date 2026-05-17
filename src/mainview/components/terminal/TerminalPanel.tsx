import { useEffect, useRef, useState } from "react";
import { getElectrobun } from "@/lib/electrobun";
import { useGenerateStore } from "#store/generateStore";
import { useSdConfigStore } from "#store/sdConfigStore";

const DEFAULT_CLI = "./sd-cli.exe";

function useCliCommand() {
    const prompt = useGenerateStore((s) => s.prompt);
    const selectedRatio = useGenerateStore((s) => s.selectedRatio);
    const seed = useGenerateStore((s) => s.seed);
    const isRandomSeed = useGenerateStore((s) => s.isRandomSeed);
    const resolutionScale = useGenerateStore((s) => s.resolutionScale);
    const steps = useGenerateStore((s) => s.steps);
    const sdCliPath = useSdConfigStore((s) => s.sdCliPath);

    const cliPath = sdCliPath.trim() || DEFAULT_CLI;
    const seedPart = isRandomSeed ? "" : ` --seed ${seed}`;
    const w = Math.round(selectedRatio.width * resolutionScale);
    const h = Math.round(selectedRatio.height * resolutionScale);
    return `${cliPath} --mode img_gen --prompt "${prompt || "..."}" --width ${w} --height ${h} --steps ${steps}${seedPart}`;
}

export function TerminalPanel() {
    const currentJobId = useGenerateStore((s) => s.currentJobId);
    const isGenerating = useGenerateStore((s) => s.isGenerating);
    const [jobCommand, setJobCommand] = useState("");
    const [output, setOutput] = useState("");
    const pollRef = useRef<ReturnType<typeof setInterval>>();
    const prevJobIdRef = useRef("");
    const bottomRef = useRef<HTMLDivElement>(null);

    const previewCommand = useCliCommand();

    useEffect(() => {
        if (currentJobId === prevJobIdRef.current) return;
        prevJobIdRef.current = currentJobId;

        if (pollRef.current) clearInterval(pollRef.current);
        pollRef.current = undefined;

        if (currentJobId && isGenerating) {
            setJobCommand("");
            setOutput("");

            pollRef.current = setInterval(async () => {
                try {
                    const data = await getElectrobun().rpc.request.getJobStatus({ jobId: currentJobId });
                    if (data.command) setJobCommand(data.command);
                    if (data.output !== undefined) setOutput(data.output);
                    if (data.status === "completed" || data.status === "failed") {
                        if (pollRef.current) clearInterval(pollRef.current);
                        pollRef.current = undefined;
                    }
                } catch { }
            }, 200);
        }

        return () => {
            if (pollRef.current) clearInterval(pollRef.current);
        };
    }, [currentJobId, isGenerating]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [output]);

    const showCommand = jobCommand || (isGenerating ? "" : previewCommand);

    return (
        <div className="border-t border-sidebar-border pt-2 mt-2 group-data-[collapsible=icon]:hidden">
            <div className="px-3 pb-1">
                <span className="text-[11px] font-medium text-sidebar-foreground/60 uppercase tracking-wider">
                    Terminal
                </span>
            </div>
            <div className="mx-2 rounded-lg bg-[#0d1117] text-[13px] font-mono leading-relaxed max-h-64 overflow-x-hidden overflow-y-auto">
                <div className="px-3 py-2">
                    {showCommand && (
                        <div className="pb-1 whitespace-pre-wrap break-all">
                            <span className="text-[#8b949e]">$ </span>
                            <span className="text-[#7ee787]">{showCommand}</span>
                        </div>
                    )}
                    {output && (
                        <pre className="whitespace-pre-wrap break-all text-[#e6edf3] m-0">
                            {output}
                        </pre>
                    )}
                    {isGenerating && !output && (
                        <div className="text-[#8b949e] italic">running...</div>
                    )}
                    <div ref={bottomRef} />
                </div>
            </div>
        </div>
    );
}
