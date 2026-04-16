import { useState, useMemo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ExpenseToggle from "@/calculator/components/ExpenseToggle";
import ExpenseSummary from "@/calculator/components/ExpenseSummary";
import SalespersonSelector from "@/calculator/components/SalespersonSelector";
import {
  Car,
  Utensils,
  Hotel,
  Phone,
  Plane,
  Gift,
  Fuel,
  ParkingCircle,
  RotateCcw,
  Download,
} from "lucide-react";
import { toast } from "sonner";

const SALESPEOPLE = ["Alex Johnson", "Maria Garcia", "James Lee", "Sarah Kim"];

const EXPENSE_CATEGORIES = [
  { id: "travel", label: "Travel / Mileage", icon: Car, defaultAmount: 150 },
  { id: "meals", label: "Meals & Entertainment", icon: Utensils, defaultAmount: 75 },
  { id: "lodging", label: "Lodging", icon: Hotel, defaultAmount: 200 },
  { id: "phone", label: "Phone & Internet", icon: Phone, defaultAmount: 50 },
  { id: "flights", label: "Flights", icon: Plane, defaultAmount: 400 },
  { id: "gifts", label: "Client Gifts", icon: Gift, defaultAmount: 60 },
  { id: "fuel", label: "Fuel", icon: Fuel, defaultAmount: 80 },
  { id: "parking", label: "Parking & Tolls", icon: ParkingCircle, defaultAmount: 25 },
];

type ExpenseState = Record<string, { enabled: boolean; amount: number }>;

const buildDefault = (): ExpenseState =>
  Object.fromEntries(
    EXPENSE_CATEGORIES.map((c) => [c.id, { enabled: false, amount: c.defaultAmount }])
  );

const Index = () => {
  const [selectedPerson, setSelectedPerson] = useState(SALESPEOPLE[0]);
  const [expensesByPerson, setExpensesByPerson] = useState<Record<string, ExpenseState>>(() =>
    Object.fromEntries(SALESPEOPLE.map((p) => [p, buildDefault()]))
  );

  const expenses = expensesByPerson[selectedPerson];

  const update = useCallback(
    (id: string, patch: Partial<{ enabled: boolean; amount: number }>) => {
      setExpensesByPerson((prev) => ({
        ...prev,
        [selectedPerson]: {
          ...prev[selectedPerson],
          [id]: { ...prev[selectedPerson][id], ...patch },
        },
      }));
    },
    [selectedPerson]
  );

  const total = useMemo(
    () =>
      Object.values(expenses).reduce(
        (sum, e) => sum + (e.enabled ? e.amount : 0),
        0
      ),
    [expenses]
  );

  const activeCount = useMemo(
    () => Object.values(expenses).filter((e) => e.enabled).length,
    [expenses]
  );

  const handleReset = () => {
    setExpensesByPerson((prev) => ({ ...prev, [selectedPerson]: buildDefault() }));
    toast.success(`Expenses reset for ${selectedPerson}`);
  };

  const handleExport = () => {
    const active = Object.entries(expenses)
      .filter(([, e]) => e.enabled)
      .map(([id, e]) => {
        const cat = EXPENSE_CATEGORIES.find((c) => c.id === id);
        return `${cat?.label}: $${e.amount.toFixed(2)}`;
      });
    const summary = `${selectedPerson}\n${active.join("\n")}\nTotal: $${total.toFixed(2)}`;
    navigator.clipboard.writeText(summary);
    toast.success("Expense summary copied to clipboard!");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 px-4 py-8">
      <div className="mx-auto max-w-2xl space-y-6">
        <header className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary shadow-lg">
            <Download className="h-7 w-7 text-white" />
          </div>
          <h1 className="font-heading text-3xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
            Sales Expense Calculator
          </h1>
          <p className="mt-1 text-muted-foreground">
            Toggle categories and enter amounts to calculate expenses
          </p>
        </header>

        <SalespersonSelector
          people={SALESPEOPLE}
          selected={selectedPerson}
          onSelect={setSelectedPerson}
        />

        <ExpenseSummary
          total={total}
          activeCount={activeCount}
          totalCategories={EXPENSE_CATEGORIES.length}
        />

        <Card className="border-0 shadow-xl shadow-primary/5">
          <CardHeader className="pb-3">
            <CardTitle className="font-heading text-lg text-primary">Expense Categories</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {EXPENSE_CATEGORIES.map((cat) => (
              <ExpenseToggle
                key={cat.id}
                id={cat.id}
                label={cat.label}
                icon={cat.icon}
                enabled={expenses[cat.id].enabled}
                amount={expenses[cat.id].amount}
                onToggle={(v) => update(cat.id, { enabled: v })}
                onAmountChange={(v) => update(cat.id, { amount: v })}
              />
            ))}
          </CardContent>
        </Card>

        <div className="flex gap-3">
          <Button variant="outline" className="flex-1 gap-2 border-destructive/30 text-destructive hover:bg-destructive/10" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
            Reset
          </Button>
          <Button className="flex-1 gap-2 bg-gradient-to-r from-primary to-secondary hover:opacity-90 shadow-lg shadow-primary/25" onClick={handleExport}>
            <Download className="h-4 w-4" />
            Copy Summary
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;
