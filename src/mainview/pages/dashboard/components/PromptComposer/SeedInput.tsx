import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from "lucide-react";

const diceIcons = [Dice1, Dice2, Dice3, Dice4, Dice5, Dice6];

export default function SeedInput({
    seed,
    isRandomSeed,
    onSeedChange,
    onToggleRandom,
    disabled,
}: {
    seed: string;
    isRandomSeed: boolean;
    onSeedChange: (seed: string) => void;
    onToggleRandom: () => void;
    disabled: boolean;
}) {
    const DiceIcon = diceIcons[Math.floor(Math.random() * diceIcons.length)];

    return (
        <div className="flex items-center gap-1">
            <button
                onClick={onToggleRandom}
                disabled={disabled}
                title={isRandomSeed ? "Using random seed. Click to set a fixed seed." : "Reset to random seed"}
                className="flex size-6 items-center justify-center rounded-md text-muted-foreground/50 hover:text-foreground transition-colors disabled:opacity-30"
            >
                {isRandomSeed ? <DiceIcon className="size-3.5" /> : <Dice1 className="size-3.5" />}
            </button>
            {!isRandomSeed && (
                <input
                    type="number"
                    value={seed}
                    onChange={(e) => onSeedChange(e.target.value)}
                    disabled={disabled}
                    placeholder="Seed"
                    className="w-20 h-6 rounded-md border border-border bg-transparent px-1.5 text-xs text-foreground tabular-nums outline-none focus:border-ring disabled:opacity-30 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                />
            )}
        </div>
    );
}