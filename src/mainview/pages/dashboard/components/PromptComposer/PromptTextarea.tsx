import { RefObject } from "react";

export default function PromptTextarea({
    value,
    onChange,
    onKeyDown,
    placeholder,
    disabled,
    inputRef,
}: {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
    onKeyDown: (e: React.KeyboardEvent) => void;
    placeholder: string;
    disabled: boolean;
    inputRef: RefObject<HTMLTextAreaElement | null>;
}) {
    return (
        <textarea
            ref={inputRef as React.Ref<HTMLTextAreaElement>}
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            maxLength={500}
            placeholder={placeholder}
            disabled={disabled}
            className="
            max-h-40 min-h-[56px] 
            resize-none 
            border-none 
            bg-transparent 
            p-3 pb-2 
            text-sm leading-relaxed text-foreground 
            outline-none 
            font-inherit placeholder:text-muted-foreground
            "
        />
    );
}