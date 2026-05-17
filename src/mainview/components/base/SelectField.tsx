import { Label } from "#components/ui/label";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type SelectFieldProps = {
    label: string;
    value: string;
    disabled?: boolean;
    onValueChange: (value: string) => void;
    options: readonly { value: string; label: string; description?: string }[];
};

export function SelectField({ label, value, disabled, onValueChange, options }: SelectFieldProps) {
    return (
        <div className="space-y-1.5">
            <Label className="px-1 text-xs text-muted-foreground">{label}</Label>
            <Select value={value} onValueChange={(v) => v !== null && onValueChange(v)} disabled={disabled}>
                <SelectTrigger className="w-full">
                    <SelectValue />
                </SelectTrigger>
                <SelectContent>
                    <SelectGroup>
                        {options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {option.label}
                            </SelectItem>
                        ))}
                    </SelectGroup>
                </SelectContent>
            </Select>
        </div>
    );
}