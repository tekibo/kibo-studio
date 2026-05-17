import { useCallback } from "react";
import { getElectrobun } from "../lib/electrobun";

const HANDLE_THICKNESS = 5;
const CORNER_SIZE = 10;
const RESIZE_EDGES = ["top", "bottom", "left", "right", "top-left", "top-right", "bottom-left", "bottom-right"] as const;

type ResizeEdge = (typeof RESIZE_EDGES)[number];

const edgeCursors: Record<ResizeEdge, string> = {
    top: "n-resize",
    bottom: "s-resize",
    left: "w-resize",
    right: "e-resize",
    "top-left": "nw-resize",
    "top-right": "ne-resize",
    "bottom-left": "sw-resize",
    "bottom-right": "se-resize",
};

function edgeStyle(edge: ResizeEdge): React.CSSProperties {
    const base: React.CSSProperties = {
        position: "fixed",
        zIndex: 9999,
        cursor: edgeCursors[edge],
    };
    switch (edge) {
        case "top":
            return { ...base, top: 0, left: CORNER_SIZE, right: CORNER_SIZE, height: HANDLE_THICKNESS };
        case "bottom":
            return { ...base, bottom: 0, left: CORNER_SIZE, right: CORNER_SIZE, height: HANDLE_THICKNESS };
        case "left":
            return { ...base, left: 0, top: CORNER_SIZE, bottom: CORNER_SIZE, width: HANDLE_THICKNESS };
        case "right":
            return { ...base, right: 0, top: CORNER_SIZE, bottom: CORNER_SIZE, width: HANDLE_THICKNESS };
        case "top-left":
            return { ...base, top: 0, left: 0, width: CORNER_SIZE, height: CORNER_SIZE };
        case "top-right":
            return { ...base, top: 0, right: 0, width: CORNER_SIZE, height: CORNER_SIZE };
        case "bottom-left":
            return { ...base, bottom: 0, left: 0, width: CORNER_SIZE, height: CORNER_SIZE };
        case "bottom-right":
            return { ...base, bottom: 0, right: 0, width: CORNER_SIZE, height: CORNER_SIZE };
    }
}

export default function WindowResizer() {
    const eb = getElectrobun();

    const onMouseDown = useCallback((edge: ResizeEdge, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        eb.rpc.send.startResize({ edge, mouseX: e.screenX, mouseY: e.screenY });

        const onMouseMove = (ev: MouseEvent) => {
            eb.rpc.send.updateResize({ mouseX: ev.screenX, mouseY: ev.screenY });
        };

        const onMouseUp = () => {
            eb.rpc.send.stopResize({});
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    }, [eb.rpc.send]);

    return (
        <>
            {RESIZE_EDGES.map((edge) => (
                <div
                    key={edge}
                    style={edgeStyle(edge)}
                    onMouseDown={(e) => onMouseDown(edge, e)}
                />
            ))}
        </>
    );
}
