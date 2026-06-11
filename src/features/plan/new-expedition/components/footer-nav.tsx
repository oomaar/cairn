import { buttonVariants, Icon } from "@/components/ui";
import { cn } from "@/lib/cn";
import { Dispatch, SetStateAction } from "react";

interface FooterNavProps {
  step: number;
  setStep: Dispatch<SetStateAction<number>>;
  steps: string[];
  file: () => void;
  canFile: boolean;
}

export function FooterNav({
  step,
  setStep,
  steps,
  file,
  canFile,
}: FooterNavProps) {
  return (
    <div className="flex flex-none items-center gap-3 border-t border-border bg-surface px-5 py-3">
      <button
        type="button"
        onClick={() => setStep((s) => Math.max(0, s - 1))}
        disabled={step === 0}
        className={cn(
          buttonVariants({ variant: "secondary", size: "md" }),
          "disabled:opacity-40",
        )}
      >
        Back
      </button>
      {step < steps.length - 1 ? (
        <button
          type="button"
          onClick={() => setStep((s) => Math.min(steps.length - 1, s + 1))}
          className={cn(
            buttonVariants({ variant: "primary", size: "md" }),
            "ml-auto",
          )}
        >
          Continue
        </button>
      ) : (
        <button
          type="button"
          onClick={file}
          disabled={!canFile}
          className={cn(
            buttonVariants({ variant: "primary", size: "md" }),
            "ml-auto gap-2 disabled:opacity-40",
          )}
        >
          File expedition
          <Icon name="check" size={15} />
        </button>
      )}
    </div>
  );
}
