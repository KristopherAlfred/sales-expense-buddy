interface ExpenseSummaryProps {
  total: number;
  activeCount: number;
  totalCategories: number;
}

const ExpenseSummary = ({ total, activeCount, totalCategories }: ExpenseSummaryProps) => {
  return (
    <div className="rounded-xl bg-gradient-to-r from-primary via-primary to-secondary p-6 text-primary-foreground shadow-xl shadow-primary/30">
      <p className="text-sm font-medium uppercase tracking-wider opacity-80">
        Total Expenses
      </p>
      <p className="mt-2 font-heading text-4xl font-bold">
        ${total.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </p>
      <div className="mt-4 flex items-center gap-1 text-sm opacity-80">
        <span className="font-semibold">{activeCount}</span> of {totalCategories} categories active
      </div>
    </div>
  );
};

export default ExpenseSummary;
