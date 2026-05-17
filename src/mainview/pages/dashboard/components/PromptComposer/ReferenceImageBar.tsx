import HoverImage from "@/components/base/HoverImage";
import { X } from "lucide-react";
import ReferenceStrength from "./ReferenceStrength";

export default function ReferenceImageBar({
    imageUrl,
    onClear,
}: {
    imageUrl: string;
    onClear: () => void;
}) {
    return (
        <div className="mx-auto -mb-2.5 flex w-full max-w-[720px] pl-4 items-start gap-3">
            <div className="group relative shrink-0">
                <div className="block cursor-pointer border-none p-0 bg-transparent">
                    <HoverImage
                        url={imageUrl}
                        triggerImageClassName="rounded-sm shadow-md border p-0.5 shadow-accent"
                        bottomSlot={
                            <div className="mt-2">
                                <ReferenceStrength />
                            </div>
                        }
                    />
                </div>
                <button
                    onClick={onClear}
                    className="absolute -top-1.5 -right-1.5 flex size-5 cursor-pointer items-center justify-center rounded-full bg-background border border-border text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                >
                    <X className="size-3" />
                </button>
            </div>
        </div>
    );
}
