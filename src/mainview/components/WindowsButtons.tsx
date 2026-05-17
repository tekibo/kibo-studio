import { getElectrobun, setOnWindowMaximizedState } from "@/lib/electrobun";
import { Copy, Minus, Square, X } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export default function WindowsButtons() {
    const eb = getElectrobun();
    const [isMaximized, setIsMaximized] = useState(false);

    useEffect(() => {
        eb.rpc.request.isMaximized({}).then(({ isMaximized }) => setIsMaximized(isMaximized));
        setOnWindowMaximizedState(({ isMaximized }) => setIsMaximized(isMaximized));
        return () => setOnWindowMaximizedState(null);
    }, []);

    const minimizeWindow = useCallback(() => eb.rpc.send.minimizeWindow({}), [])
    const maximizeWindow = useCallback(() => eb.rpc.send.maximizeWindow({}), [])
    const closeWindow = useCallback(() => eb.rpc.send.closeWindow({}), [])

    return (
        <>
            <ActionButton onClick={minimizeWindow} icon={<Minus className="size-3.5" />} />
            <ActionButton onClick={maximizeWindow}
                icon={isMaximized ? <Copy className="size-3" /> : <Square className="size-3" />} />
            <ActionButton isDanger onClick={closeWindow} icon={<X className="size-3.5" />} />
        </>
    )
}

function ActionButton({ onClick, icon, isDanger }: { onClick: () => void, icon: React.ReactNode, isDanger?: boolean }) {
    return (
        <button onClick={onClick}
            className={`
                flex size-8 items-center justify-center rounded-md
                ${isDanger ? "hover:bg-destructive hover:text-foreground " : "hover:bg-accent hover:text-foreground "}
                text-muted-foreground 
                cursor-pointer border-none
                `}
            aria-label="Minimize"
        >
            {icon}
        </button>
    )
}