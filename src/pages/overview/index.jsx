import { FiArrowUpRight, FiCheck, FiCreditCard, FiFileText, FiInbox, FiTrendingUp } from "react-icons/fi";
import { Link } from "react-router-dom";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCompactCurrency, formatCurrency, formatDate, isExpenseInBudgetPeriod } from "../../utils/format.js";
import styles from "./styles.module.css";

const Overview = ({ expenses, budgets }) => {
    const countedExpenses = expenses.filter((expense) => expense.status !== "Declined" && isExpenseInBudgetPeriod(expense, "Monthly"));
    const totalSpend = countedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const pending = expenses.filter((expense) => expense.status === "Needs review" && isExpenseInBudgetPeriod(expense, "Monthly")).sort((a, b) => b.date.localeCompare(a.date));
    const cleared = countedExpenses.filter((expense) => ["Approved", "Paid"].includes(expense.status)).reduce((sum, expense) => sum + expense.amount, 0);
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const remaining = Math.max(totalBudget - totalSpend, 0);
    const budgetRows = budgets.map((budget) => {
        const spent = expenses.filter((expense) => expense.category === budget.category && expense.status !== "Declined" && isExpenseInBudgetPeriod(expense, budget.period)).reduce((sum, expense) => sum + expense.amount, 0);
        return { ...budget, spent, progress: budget.limit ? Math.min(spent / budget.limit * 100, 100) : 0 };
    }).sort((a, b) => b.progress - a.progress).slice(0, 3);

    return (
        <div className={styles.page}>
            <header className={styles.heading}>
                <div><p>October 2026 / Operations</p><h1>Spend review room</h1><span>See what has moved, what needs a decision, and what is left to spend.</span></div>
                <Link className={styles.registerLink} to="/expenses">Open expense register <FiArrowUpRight aria-hidden="true" /></Link>
            </header>

            <section aria-label="Monthly spend summary" className={styles.summary}>
                <div className={styles.spendTotal}>
                    <div className={styles.totalHeading}><span>Spend this month</span><span className={styles.monthTag}>OCT / 2026</span></div>
                    <strong>{formatCurrency(totalSpend)}</strong>
                    <div className={styles.budgetLine}><span>{formatCurrency(remaining)} remaining across budgets</span><span>{formatCurrency(totalBudget)} planned</span></div>
                    <div aria-label={`${Math.round(totalSpend / Math.max(totalBudget, 1) * 100)} percent of planned budget used`} className={styles.progress}><i style={{ width: `${Math.min(totalSpend / Math.max(totalBudget, 1) * 100, 100)}%` }} /></div>
                </div>
                <div className={styles.summaryStat}><span><FiInbox aria-hidden="true" /> Needs a decision</span><strong>{pending.length}</strong><small>{formatCurrency(pending.reduce((sum, expense) => sum + expense.amount, 0))} awaiting review</small></div>
                <div className={styles.summaryStat}><span><FiCheck aria-hidden="true" /> Cleared this month</span><strong>{formatCurrency(cleared)}</strong><small>Approved or marked paid</small></div>
                <div className={styles.summaryStat}><span><FiCreditCard aria-hidden="true" /> Active budgets</span><strong>{budgets.length}</strong><small>Across {new Set(budgets.map((budget) => budget.category)).size} categories</small></div>
            </section>

            <div className={styles.workspace}>
                <section aria-labelledby="review-title" className={styles.queue}>
                    <div className={styles.sectionHeading}><div><h2 id="review-title">Waiting for your review</h2><p>Check the business purpose and policy note before approving.</p></div><Link to="/expenses?status=Needs%20review">View queue <FiArrowUpRight aria-hidden="true" /></Link></div>
                    {pending.length ? <div className={styles.expenseRows}>
                        {pending.slice(0, 4).map((expense) => <Link className={styles.expenseRow} key={expense.id} to={`/expenses/${expense.id}`}>
                            <span className={styles.receiptIcon}><FiFileText aria-hidden="true" /></span>
                            <span className={styles.expenseText}><strong>{expense.merchant}</strong><small>{expense.purpose} / {expense.employee}</small></span>
                            <span className={styles.expenseMeta}><small>{formatDate(expense.date)}</small><StatusPill status={expense.status} /></span>
                            <strong className={styles.amount}>{formatCurrency(expense.amount)}</strong>
                            <FiArrowUpRight aria-hidden="true" className={styles.openIcon} />
                        </Link>)}
                    </div> : <div className={styles.empty}><FiCheck aria-hidden="true" /><strong>All reviews are clear.</strong><span>New submissions will appear here.</span></div>}
                </section>

                <aside className={styles.budgetPanel}>
                    <div className={styles.sectionHeading}><div><h2>Budget watch</h2><p>Closest to its limit</p></div><Link aria-label="Manage budgets" to="/budgets"><FiArrowUpRight aria-hidden="true" /></Link></div>
                    <div className={styles.budgetRows}>
                        {budgetRows.map((budget) => <div className={styles.budgetRow} key={budget.id}>
                            <div><strong>{budget.category}</strong><span>{formatCurrency(budget.spent)} of {formatCurrency(budget.limit)}</span></div>
                            <div aria-label={`${Math.round(budget.progress)} percent of ${budget.category} budget used`} className={styles.budgetTrack}><i style={{ width: `${budget.progress}%` }} /></div>
                        </div>)}
                    </div>
                    <Link className={styles.budgetLink} to="/budgets">Open budget plan <FiArrowUpRight aria-hidden="true" /></Link>
                </aside>
            </div>

            <section className={styles.bottomGrid}>
                <div className={styles.photoNote}>
                    <img alt="Receipts, ledger pages, and a calculator arranged on a desk" src={`${import.meta.env.BASE_URL}assets/expense-review-desk.jpg`} />
                    <div><span><FiTrendingUp aria-hidden="true" /> MONTH-END PRACTICE</span><h2>A clear record is easier to close.</h2><p>Keep the purpose, receipt status, and policy notes together while each expense is fresh.</p><Link to="/policies">Review spending rules <FiArrowUpRight aria-hidden="true" /></Link></div>
                </div>
                <div className={styles.activityPanel}>
                    <div className={styles.sectionHeading}><div><h2>Latest activity</h2><p>Recent expense records</p></div><Link to="/expenses">All expenses <FiArrowUpRight aria-hidden="true" /></Link></div>
                    {expenses.slice(0, 4).map((expense) => <Link className={styles.activityRow} key={expense.id} to={`/expenses/${expense.id}`}><span><strong>{expense.merchant}</strong><small>{expense.employee} / {formatDate(expense.date)}</small></span><span>{formatCompactCurrency(expense.amount)} <StatusPill status={expense.status} /></span></Link>)}
                </div>
            </section>
        </div>
    );
};

export default Overview;
