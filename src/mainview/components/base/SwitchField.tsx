export function SwitchField({
    label,
    checked,
    disabled,
    onCheckedChange,
}: {
    label: string;
    checked: boolean;
    disabled?: boolean;
    onCheckedChange: (checked: boolean) => void;
}) {
    return (
        <label className="flex items-center justify-between gap-2 rounded-xl border bg-card px-3 py-2.5 cursor-pointer">
            <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {label}
            </span>
            <button
                role="switch"
                aria-checked={checked}
                disabled={disabled}
                onClick={() => onCheckedChange(!checked)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${checked ? "bg-primary" : "bg-input"}`}
            >
                <span className={`pointer-events-none block size-4 rounded-full bg-background shadow-lg ring-0 transition-transform duration-200 ${checked ? "translate-x-4" : "translate-x-0"}`} />
            </button>
        </label>
    );
}
