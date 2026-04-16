import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { LucideIcon } from "lucide-react";

interface ExpenseToggleProps {
  id: string;
  label: string;
  icon: LucideIcon;
  enabled: boolean;
  amount: number;
  onToggle: (enabled: boolean) => void;
  onAmountChange: (amount: number) => void;
}

const ExpenseToggle = ({
  id,
  label,
  icon: Icon,
  enabled,
  amount,
  onToggle,
  onAmountChange,
}: ExpenseToggleProps) => {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border p-4 transition-all duration-200 ${
        enabled
          ? "border-primary/30 bg-primary/5 shadow-sm"
          : "border-border bg-card opacity-70"
      }`}
    >
      <div className="flex items-center gap-3">
        <div
          className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
            enabled ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
          }`}
        >
          <Icon className="h-5 w-5" />
        </div>
        <Label htmlFor={id} className="cursor-pointer font-medium text-foreground">
          {label}
        </Label>
      </div>
      <div className="flex items-center gap-3">
        {enabled && (
          <div className="flex items-center gap-1">
            <span className="text-sm text-muted-foreground">$</span>
            <Input
              type="number"
              min={0}
              value={amount}
              onChange={(e) => onAmountChange(parseFloat(e.target.value) || 0)}
              className="h-8 w-24 text-right font-medium"
            />
          </div>
        )}
        <Switch id={id} checked={enabled} onCheckedChange={onToggle} />
      </div>
    </div>
  );
};

export default ExpenseToggle;
