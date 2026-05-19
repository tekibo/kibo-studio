import { spawn } from "bun";
import { mkdirSync, existsSync } from "fs";
import { dirname, join } from "path";
import { buildImageGenerationCommand, getSdPreset } from "./diffusion";
import { applySdUserConfig } from "./settings";
import { addGeneratedImage, WORKSPACE_DIR } from "../workspace";
import type { ImageGenerationJob, ImageRequest, ImageResponse } from "../../../mainview/lib/sd/types";

const jobs = new Map<string, ImageGenerationJob>();

export function getJobStatus(jobId: string): ImageResponse {
    const job = jobs.get(jobId);

    if (!job) {
        return { success: false, status: "failed", jobId, error: "Unknown job" };
    }

    return {
        success: job.status === "completed",
        image: job.image,
        jobId,
        status: job.status,
        error: job.error,
        output: job.output,
        command: job.command,
    };
}

export function cancelGeneration(jobId: string): boolean {
    const job = jobs.get(jobId);
    if (!job || !job.proc) return false;

    try {
        job.proc.kill();
        job.status = "failed";
        job.error = "Cancelled";
        return true;
    } catch {
        return false;
    }
}

const WS_PREFIX = /^workspace\//;

export default async function generateImage(request: ImageRequest): Promise<ImageResponse> {
    const jobId = `job_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const generationRequest = await applySdUserConfig(request);

    const preset = getSdPreset(generationRequest.presetId);
    const isVideo = preset.runMode === "vid_gen";
    const ext = isVideo ? ".webm" : ".png";
    const output = join(WORKSPACE_DIR, `${jobId}${ext}`);

    // Resolve workspace-relative paths to absolute WORKSPACE_DIR paths
    const resolvePath = (p: string) => WS_PREFIX.test(p) ? join(WORKSPACE_DIR, p.slice(10)) : p;
    const generationRequestResolved = {
        ...generationRequest,
        refImages: generationRequest.refImages?.map(resolvePath),
        referenceImage: generationRequest.referenceImage ? resolvePath(generationRequest.referenceImage) : undefined,
    };

    const cmd = await buildImageGenerationCommand(generationRequestResolved, output);
    const cmdStr = cmd.join(" ");
    jobs.set(jobId, { status: "pending", command: cmdStr });

    setImmediate(() => {
        void runImageGeneration(jobId, generationRequestResolved, output, cmd);
    });

    return {
        success: true,
        jobId,
        status: "pending",
        command: cmdStr,
    };
}

async function runImageGeneration(jobId: string, request: ImageRequest, output: string, cmd: string[]) {
    try {
        if (!existsSync(dirname(output))) {
            mkdirSync(dirname(output), { recursive: true });
        }

        const proc = spawn(cmd, {
            stdout: "pipe",
            stderr: "pipe",
        });

        const job = jobs.get(jobId);
        if (job) job.proc = proc;

        const decoder = new TextDecoder();
        let outputBuffer = "";

        async function readStream(stream: ReadableStream<Uint8Array>) {
            const reader = stream.getReader();
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                const chunk = decoder.decode(value, { stream: true });
                outputBuffer += chunk;
                const job = jobs.get(jobId);
                if (job) job.output = outputBuffer;
            }
            const final = decoder.decode();
            if (final) {
                outputBuffer += final;
                const job = jobs.get(jobId);
                if (job) job.output = outputBuffer;
            }
        }

        const [exitCode] = await Promise.all([
            proc.exited,
            readStream(proc.stderr),
            readStream(proc.stdout),
        ]);

        if (exitCode !== 0) {
            const current = jobs.get(jobId);
            if (current && !current.error) {
                current.status = "failed";
                current.error = outputBuffer.trim() || "Generation failed";
            }
            return;
        }

        const file = Bun.file(output);
        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString("base64");
        const mimeType = output.endsWith(".webm") ? "video/webm" : "image/png";
        const dataUrl = `data:${mimeType};base64,${base64}`;

        const genExt = output.endsWith(".webm") ? "webm" : "png";
        addGeneratedImage(jobId, request.prompt, request.width ?? 0, request.height ?? 0, genExt);

        const current = jobs.get(jobId);
        if (current) {
            current.status = "completed";
            current.image = dataUrl;
        }
    } catch (error) {
        const current = jobs.get(jobId);
        if (current && !current.error) {
            current.status = "failed";
            current.error = error instanceof Error ? error.message : "Generation failed";
        }
    }
}
