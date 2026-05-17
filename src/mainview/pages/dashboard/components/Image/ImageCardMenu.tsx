import { useState } from "react";
import { Ellipsis, RefreshCw, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "#components/ui/dropdown-menu";
import { pickSavePath, writeBase64File } from "#lib/sd/client";
import { useGenerateStore } from "#store/generateStore";

type Props = {
    id: string;
    image: string;
    prompt: string;
    source: "generated" | "imported";
};

export function ImageCardMenu({ id, image, prompt, source }: Props) {
    const [saving, setSaving] = useState(false);
    const [open, setOpen] = useState(false);
    const setPrompt = useGenerateStore((s) => s.setPrompt);
    const setInitImage = useGenerateStore((s) => s.setInitImage);
    const setStrength = useGenerateStore((s) => s.setStrength);
    const removeWorkingImage = useGenerateStore((s) => s.removeWorkingImage);

    const handleReuse = () => {
        setPrompt(prompt);
        setOpen(false);
        const history = useGenerateStore.getState().history;
        const match = history.find((h) => h.image === image);
        if (match?.initImageDataUrl) {
            setInitImage("reused", match.initImageDataUrl);
            if (match.strength != null) setStrength(match.strength);
        }
    };

    const handleDownload = async () => {
        const base64 = image.split(",")[1];
        if (!base64) return;

        setSaving(true);
        const filePath = await pickSavePath("generated-image.png");
        if (!filePath) { setSaving(false); setOpen(false); return; }

        const error = await writeBase64File(filePath, base64);
        setSaving(false);
        setOpen(false);

        if (error) {
            toast.error("Failed to save image", { description: error });
        } else {
            toast.success("Image saved", { description: filePath });
        }
    };

    const handleDelete = () => {
        void removeWorkingImage(id);
        setOpen(false);
    };

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger render={(props: any) => {
                const { onClick, ...rest } = props;
                return <button {...rest} className="flex size-7 items-center justify-center rounded-md bg-black/50 text-white hover:bg-white/20 cursor-pointer border-none transition-colors" aria-label="More actions" onClick={(e: React.MouseEvent) => { e.stopPropagation(); onClick?.(e); }} />;
            }}>
                <Ellipsis className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                {source === "generated" && (
                <DropdownMenuItem onClick={handleReuse} className="cursor-pointer">
                    <RefreshCw className="size-3.5" />
                    Reuse prompt
                </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={handleDownload} disabled={saving} className="cursor-pointer">
                    <Download className="size-3.5" />
                    {saving ? "Saving..." : "Download"}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleDelete} variant="destructive" className="cursor-pointer">
                    <Trash2 className="size-3.5" />
                    Delete
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
