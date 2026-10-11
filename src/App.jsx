import { useCallback, useState } from "react";
import AppRoutes from "./AppRoutes.jsx";
import ExpenseForm from "./components/expenseForm/index.jsx";
import Footer from "./components/footer/index.jsx";
import Header from "./components/header/index.jsx";
import Modal from "./components/modal/index.jsx";
import ScrollToTop from "./components/scrollToTop/index.jsx";
import Toast from "./components/toast/index.jsx";
import { expenseCategories, initialBudgets, initialCards, initialExpenses, initialPolicies, teamMembers } from "./data/seed.js";
import { getNextExpenseId } from "./utils/format.js";
import styles from "./App.module.css";

const teamByMember = {
    "Maya Chen": "Sales",
    "Jonah Miles": "Product",
    "Priya Shah": "Sales",
    "Avery Brooks": "Operations",
    "Lena Ortiz": "Product",
};

const App = () => {
    const [expenses, setExpenses] = useState(initialExpenses);
    const [cards, setCards] = useState(initialCards);
    const [budgets, setBudgets] = useState(initialBudgets);
    const [policies, setPolicies] = useState(initialPolicies);
    const [expenseDialog, setExpenseDialog] = useState(null);
    const [toast, setToast] = useState(null);

    const notify = useCallback((title, message, type = "success") => {
        setToast({ id: Date.now(), title, message, type });
    }, []);

    const closeToast = useCallback(() => setToast(null), []);

    const saveExpense = (draft) => {
        if (expenseDialog?.expense) {
            setExpenses((current) => current.map((expense) => expense.id === expenseDialog.expense.id ? { ...expense, ...draft } : expense));
            notify("Expense updated", "The expense record is up to date.");
        } else {
            const newExpense = {
                ...draft,
                id: getNextExpenseId(expenses),
                team: teamByMember[draft.employee] || "Operations",
                card: draft.card || cards[0]?.name || "Out of pocket",
            };
            setExpenses((current) => [newExpense, ...current]);
            notify("Expense submitted", "It is now in the review queue.");
        }
        setExpenseDialog(null);
    };

    const reviewExpense = (expenseId, status, note) => {
        setExpenses((current) => current.map((expense) => expense.id === expenseId ? { ...expense, status, reviewNote: note || expense.reviewNote || "" } : expense));
        const title = status === "Declined" ? "Expense declined" : status === "Paid" ? "Expense marked paid" : "Expense approved";
        notify(title, `${expenseId} was updated in this session.`);
    };

    const deleteExpense = (expenseId) => {
        setExpenses((current) => current.filter((expense) => expense.id !== expenseId));
        notify("Expense removed", `${expenseId} was removed from this session.`);
    };

    const saveCard = (card, draft) => {
        if (card) {
            setCards((current) => current.map((item) => item.id === card.id ? { ...item, ...draft } : item));
            notify("Card details saved", `${draft.name} has the updated details.`);
            return;
        }
        const nextNumber = Math.max(...cards.map((item) => Number(item.id.replace("CARD-", ""))), 2100) + 1;
        setCards((current) => [{ ...draft, id: `CARD-${nextNumber}`, lastFour: String(1000 + (nextNumber * 37) % 8999), status: "Active" }, ...current]);
        notify("Sample card created", "No payment network is connected.");
    };

    const toggleCard = (cardId) => {
        const card = cards.find((item) => item.id === cardId);
        const status = card?.status === "Active" ? "Paused" : "Active";
        setCards((current) => current.map((item) => item.id === cardId ? { ...item, status } : item));
        notify(status === "Paused" ? "Card paused" : "Card reactivated", "The sample card status was updated.");
    };

    const deleteCard = (cardId) => {
        const card = cards.find((item) => item.id === cardId);
        setCards((current) => current.filter((item) => item.id !== cardId));
        notify("Card removed", `${card?.name || "The card"} was removed from the workspace.`);
    };

    const saveBudget = (budget, draft) => {
        if (budget) {
            setBudgets((current) => current.map((item) => item.id === budget.id ? { ...item, ...draft } : item));
            notify("Budget updated", `${draft.category} has the new limit.`);
            return;
        }
        const nextNumber = Math.max(...budgets.map((item) => Number(item.id.replace("B-", ""))), 500) + 1;
        setBudgets((current) => [{ ...draft, id: `B-${nextNumber}` }, ...current]);
        notify("Budget created", `${draft.category} is now in the budget plan.`);
    };

    const deleteBudget = (budgetId) => {
        const budget = budgets.find((item) => item.id === budgetId);
        setBudgets((current) => current.filter((item) => item.id !== budgetId));
        notify("Budget removed", `${budget?.category || "The budget"} was removed.`);
    };

    const savePolicy = (policy, draft) => {
        if (policy) {
            setPolicies((current) => current.map((item) => item.id === policy.id ? { ...item, ...draft } : item));
            notify("Policy updated", `${draft.name} has the new rule.`);
            return;
        }
        const nextNumber = Math.max(...policies.map((item) => Number(item.id.replace("P-", ""))), 100) + 1;
        setPolicies((current) => [{ ...draft, id: `P-${nextNumber}` }, ...current]);
        notify("Policy added", `${draft.name} is ready for reviewers.`);
    };

    const deletePolicy = (policyId) => {
        const policy = policies.find((item) => item.id === policyId);
        setPolicies((current) => current.filter((item) => item.id !== policyId));
        notify("Policy removed", `${policy?.name || "The policy"} was removed.`);
    };

    const togglePolicy = (policyId) => {
        setPolicies((current) => current.map((item) => item.id === policyId ? { ...item, active: !item.active } : item));
        notify("Policy status changed", "The active policy list is up to date.");
    };

    const appData = {
        expenses,
        cards,
        budgets,
        policies,
        categories: expenseCategories,
        teamMembers,
        notify,
        onReviewExpense: reviewExpense,
        onDeleteExpense: deleteExpense,
        onEditExpense: (expense) => setExpenseDialog({ expense }),
        onSaveCard: saveCard,
        onToggleCard: toggleCard,
        onDeleteCard: deleteCard,
        onSaveBudget: saveBudget,
        onDeleteBudget: deleteBudget,
        onSavePolicy: savePolicy,
        onDeletePolicy: deletePolicy,
        onTogglePolicy: togglePolicy,
    };

    return (
        <div className={styles.app}>
            <a className="skipLink" href="#main-content">Skip to content</a>
            <Header onNewExpense={() => setExpenseDialog({ type: "create" })} />
            <main className={styles.main} id="main-content">
                <ScrollToTop />
                <AppRoutes appData={appData} />
            </main>
            <Footer />
            <Modal description="Add the business purpose and receipt status for this expense." onClose={() => setExpenseDialog(null)} open={Boolean(expenseDialog)} title={expenseDialog?.expense ? "Edit expense" : "Submit an expense"}>
                <ExpenseForm cards={cards} categories={expenseCategories} expense={expenseDialog?.expense} onSave={saveExpense} />
            </Modal>
            <Toast onClose={closeToast} toast={toast} />
        </div>
    );
};

export default App;
