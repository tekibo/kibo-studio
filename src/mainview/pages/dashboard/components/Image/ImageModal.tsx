import { useEffect, useState } from "react";
import { Download, RefreshCw, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { pickSavePath, writeBase64File } from "#lib/sd/client";
import { useGenerateStore } from "#store/generateStore";

type Props = {
    image: string;
    prompt: string;
    onClose: () => void;
    id?: string;
    source?: "generated" | "imported";
};

export function ImageModal({ image, prompt, onClose, id, source }: Props) {
    const [saving, setSaving] = useState(false);
    const setPrompt = useGenerateStore((s) => s.setPrompt);
    const setInitImage = useGenerateStore((s) => s.setInitImage);
    const setStrength = useGenerateStore((s) => s.setStrength);
    const removeWorkingImage = useGenerateStore((s) => s.removeWorkingImage);

    useEffect(() => {
        function handleKey(e: KeyboardEvent) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", handleKey);
        return () => document.removeEventListener("keydown", handleKey);
    }, [onClose]);

    const handleDownload = async () => {
        const base64 = image.split(",")[1];
        if (!base64) return;

        setSaving(true);
        const filePath = await pickSavePath("generated-image.png");
        if (!filePath) { setSaving(false); return; }

        const error = await writeBase64File(filePath, base64);
        setSaving(false);

        if (error) {
            toast.error("Failed to save image", { description: error });
        } else {
            toast.success("Image saved", { description: filePath });
        }
    };

    const handleReuse = () => {
        setPrompt(prompt);
        onClose();
        const history = useGenerateStore.getState().history;
        const match = history.find((h) => h.image === image);
        if (match?.initImageDataUrl) {
            setInitImage("reused", match.initImageDataUrl);
            if (match.strength != null) setStrength(match.strength);
        }
    };

    const handleDelete = () => {
        if (id) void removeWorkingImage(id);
        onClose();
    };

    return (
        <div
            className="fixed inset-0 z-999 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
        >
            <div className="relative flex max-h-[90vh] max-w-[90vw] flex-col items-center">
                <div className="absolute -top-10 right-0 flex gap-2">
                    {source === "generated" && (
                        <button onClick={handleReuse}
                            className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 cursor-pointer border-none"
                            aria-label="Reuse prompt"
                            title="Reuse prompt"
                        >
                            <RefreshCw className="size-4" />
                        </button>
                    )}
                    <button onClick={handleDownload} disabled={saving}
                        className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 cursor-pointer border-none"
                        aria-label="Download"
                    >
                        <Download className="size-4" />
                    </button>
                    {id && (
                        <button onClick={handleDelete}
                            className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white hover:bg-destructive cursor-pointer border-none"
                            aria-label="Delete"
                        >
                            <Trash2 className="size-4" />
                        </button>
                    )}
                    <button onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-md bg-white/10 text-white hover:bg-white/20 cursor-pointer border-none"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                {saving ? (
                    <div className="flex items-center gap-3 rounded-lg bg-card px-6 py-4 text-sm text-muted-foreground">
                        <div className="size-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                        Saving...
                    </div>
                ) : (
                    <img src={image} alt={prompt}
                        className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl" />
                )}
            </div>
        </div>
    );
}
