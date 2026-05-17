import { cn } from "@/lib/utils";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";

export default function HoverImage({
    url,
    size = 14,
    bottomSlot,
    triggerClassName,
    triggerImageClassName,
    hoverImageClassName,
    hoverContentClassName
}: {
    url: string,
    size?: number,
    bottomSlot?: React.ReactNode,
    triggerClassName?: string,
    triggerImageClassName?: string,
    hoverImageClassName?: string
    hoverContentClassName?: string
}) {
    return (
        <HoverCard>
            <HoverCardTrigger render={
                <div className={cn("flex items-center justify-center", triggerClassName)}>
                    <img
                        src={url}
                        className={cn(`size-${size} shrink-0  object-contain`, triggerImageClassName)}
                    />
                </div>
            } />
            <HoverCardContent className={cn(hoverContentClassName)}>
                <img
                    src={url}
                    className={cn("rounded-md object-cover", hoverImageClassName)}
                />
                {bottomSlot}
            </HoverCardContent>
        </HoverCard>
    )
}