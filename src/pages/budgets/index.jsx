import { useMemo, useState } from "react";
import { FiAlertTriangle, FiPlus, FiTrash2 } from "react-icons/fi";
import Button from "../../components/button/index.jsx";
import BudgetForm from "../../components/budgetForm/index.jsx";
import Modal from "../../components/modal/index.jsx";
import { formatCurrency } from "../../utils/format.js";
import styles from "./styles.module.css";

const Budgets = ({ budgets, expenses, categories, onSaveBudget, onDeleteBudget }) => {
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const [view, setView] = useState("All categories");
    const [sort, setSort] = useState("usage");
    const rows = useMemo(() => budgets.map((budget) => {
        const spent = expenses.filter((expense) => expense.category === budget.category && expense.status !== "Declined").reduce((sum, expense) => sum + expense.amount, 0);
        const usage = budget.limit > 0 ? spent / budget.limit * 100 : 0;
        return { ...budget, spent, usage, remaining: budget.limit - spent };
    }).filter((budget) => view === "All categories" || budget.category === view).sort((a, b) => {
        if (sort === "amount-high") return b.limit - a.limit;
        if (sort === "amount-low") return a.limit - b.limit;
        if (sort === "category") return a.category.localeCompare(b.category);
        return b.usage - a.usage;
    }), [budgets, expenses, view, sort]);
    const totalLimit = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const plannedCategories = new Set(budgets.map((budget) => budget.category));
    const totalSpent = expenses.filter((expense) => plannedCategories.has(expense.category) && expense.status !== "Declined").reduce((sum, expense) => sum + expense.amount, 0);
    const overLimit = rows.filter((budget) => budget.usage > 100).length;
    const closeForm = () => setEditing(null);
    const saveBudget = (draft) => {
        onSaveBudget(editing?.budget || null, draft);
        closeForm();
    };
    const removeBudget = () => {
        onDeleteBudget(confirmDelete.id);
        setConfirmDelete(null);
    };

    return (
        <div className={styles.page}>
            <header className={styles.heading}>
                <div><p>Spend / Planning</p><h1>Budget plan</h1><span>Compare recorded expenses with team limits and reset plans as work changes.</span></div>
                <Button icon={<FiPlus />} onClick={() => setEditing({ type: "create" })} variant="primary">Create budget</Button>
            </header>

            <section aria-label="Budget plan summary" className={styles.summary}>
                <div><span>Total planned</span><strong>{formatCurrency(totalLimit)}</strong><small>Across {budgets.length} active budget records</small></div>
                <div><span>Recorded spend</span><strong>{formatCurrency(totalSpent)}</strong><small>Based on non-declined expense records</small></div>
                <div className={overLimit ? styles.overSummary : ""}><span>{overLimit ? "Over limit" : "Budgets over limit"}</span><strong>{overLimit}</strong><small>{overLimit ? "Review categories above their plan" : "All shown budgets are within limit"}</small></div>
            </section>

            <section className={styles.toolbar} aria-label="Filter and sort budgets">
                <label>Category<select onChange={(event) => setView(event.target.value)} value={view}><option>All categories</option>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label>Sort by<select onChange={(event) => setSort(event.target.value)} value={sort}><option value="usage">Highest use</option><option value="amount-high">Largest limit</option><option value="amount-low">Smallest limit</option><option value="category">Category name</option></select></label>
                <span>{rows.length} {rows.length === 1 ? "budget" : "budgets"}</span>
            </section>

            {rows.length ? <section aria-label="Budget categories" className={styles.list}>
                {rows.map((budget) => {
                    const exceeded = budget.usage > 100;
                    const nearLimit = budget.usage >= 80;
                    return <article className={`${styles.budget} ${exceeded ? styles.exceeded : nearLimit ? styles.nearLimit : ""}`} key={budget.id}>
                        <div className={styles.budgetHeading}><div><span className={styles.category}>{budget.category}</span><h2>{budget.owner}</h2><small>{budget.period} plan</small></div><div className={styles.limit}><span>Budget limit</span><strong>{formatCurrency(budget.limit)}</strong></div></div>
                        <div className={styles.spendLine}><span>{formatCurrency(budget.spent)} <small>used</small></span><span className={exceeded ? styles.overText : ""}>{exceeded ? `${formatCurrency(Math.abs(budget.remaining))} over limit` : `${formatCurrency(budget.remaining)} remaining`}</span></div>
                        <div aria-label={`${Math.round(budget.usage)} percent of ${budget.category} budget used`} className={styles.track}><i style={{ width: `${Math.min(budget.usage, 100)}%` }} /></div>
                        <div className={styles.budgetFoot}><span>{nearLimit && <><FiAlertTriangle aria-hidden="true" /> {exceeded ? "Limit exceeded" : "Approaching limit"}</>}</span><div>
                            <button aria-label={`Edit ${budget.category} budget`} onClick={() => setEditing({ type: "edit", budget })} type="button">Edit plan</button>
                            <button aria-label={`Remove ${budget.category} budget`} className={styles.remove} onClick={() => setConfirmDelete(budget)} title="Remove budget" type="button"><FiTrash2 aria-hidden="true" /></button>
                        </div></div>
                    </article>;
                })}
            </section> : <section className={styles.empty}><h2>No budgets in this category.</h2><p>Create a budget or choose a different category filter.</p><Button onClick={() => setView("All categories")}>Show all budgets</Button></section>}

            <Modal description="Set a category, owner, period, and spending limit. Recorded expense totals update automatically." onClose={closeForm} open={Boolean(editing)} title={editing?.budget ? "Edit budget plan" : "Create a budget"}>
                <BudgetForm budget={editing?.budget} categories={categories} key={editing?.budget?.id || editing?.type} onSave={saveBudget} />
            </Modal>
            <Modal actions={<><Button data-dialog-cancel onClick={() => setConfirmDelete(null)}>Keep budget</Button><Button onClick={removeBudget} variant="danger">Remove budget</Button></>} description="This removes the budget plan from the current session. Expense records remain available." onClose={() => setConfirmDelete(null)} open={Boolean(confirmDelete)} title="Remove this budget?">
                <p className={styles.confirmText}><strong>{confirmDelete?.category} / {confirmDelete?.owner}</strong><br />Spend history will remain in reports, but this limit will be removed.</p>
            </Modal>
        </div>
    );
};

export default Budgets;
