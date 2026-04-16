import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

interface SalespersonSelectorProps {
  people: string[];
  selected: string;
  onSelect: (name: string) => void;
}

const SalespersonSelector = ({ people, selected, onSelect }: SalespersonSelectorProps) => {
  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-muted-foreground">Salesperson</p>
      <div className="flex flex-wrap gap-2">
        {people.map((name) => (
          <Button
            key={name}
            variant={selected === name ? "default" : "outline"}
            size="sm"
            onClick={() => onSelect(name)}
            className="gap-2"
          >
            <User className="h-3.5 w-3.5" />
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default SalespersonSelector;
