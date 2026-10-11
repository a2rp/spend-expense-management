export const formatCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
}).format(Number(amount) || 0);

export const formatCompactCurrency = (amount) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 1,
}).format(Number(amount) || 0);

export const formatDate = (date, options = { month: "short", day: "numeric" }) => {
    if (!date) return "No date";
    return new Intl.DateTimeFormat("en-US", options).format(new Date(`${date}T12:00:00`));
};

export const isExpenseInBudgetPeriod = (expense, period) => {
    if (!expense.date) return false;
    const date = new Date(`${expense.date}T12:00:00`);
    const now = new Date();
    const sameYear = date.getFullYear() === now.getFullYear();
    if (period === "October") return sameYear && date.getMonth() === 9;
    if (period === "Quarterly") return sameYear && Math.floor(date.getMonth() / 3) === Math.floor(now.getMonth() / 3);
    return sameYear && date.getMonth() === now.getMonth();
};

export const getExpenseFlags = (expense, policies) => policies
    .filter((policy) => policy.active)
    .flatMap((policy) => {
        const name = policy.name.trim().toLowerCase();
        const overLimit = expense.amount > policy.limit;
        const categoryMatches = policy.category === "All categories" || policy.category === expense.category;
        if (name === "receipt required") return overLimit && !expense.receipt ? ["Missing receipt"] : [];
        if (name === "team meal limit") return expense.category === "Meals" && overLimit ? ["Meal limit exceeded"] : [];
        if (name === "hotel nightly limit") return expense.category === "Travel" && expense.merchant.toLowerCase().includes("hotel") && overLimit ? ["Travel limit review"] : [];
        if (name === "small expense auto-approval") return [];
        if (categoryMatches && overLimit) return [`${policy.name} threshold exceeded`];
        return [];
    });

export const getNextExpenseId = (expenses) => {
    const latest = expenses.reduce((highest, expense) => Math.max(highest, Number(expense.id.replace("EX-", "")) || 0), 1036);
    return `EX-${latest + 1}`;
};
