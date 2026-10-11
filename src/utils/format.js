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

export const getExpenseFlags = (expense, policies) => policies
    .filter((policy) => policy.active)
    .flatMap((policy) => {
        if (policy.name === "Receipt required" && expense.amount > policy.limit && !expense.receipt) return ["Missing receipt"];
        if (policy.name === "Team meal limit" && expense.category === "Meals" && expense.amount > policy.limit) return ["Meal limit exceeded"];
        if (policy.name === "Hotel nightly limit" && expense.category === "Travel" && expense.merchant.toLowerCase().includes("hotel") && expense.amount > policy.limit) return ["Travel limit review"];
        return [];
    });

export const getNextExpenseId = (expenses) => {
    const latest = expenses.reduce((highest, expense) => Math.max(highest, Number(expense.id.replace("EX-", "")) || 0), 1036);
    return `EX-${latest + 1}`;
};
