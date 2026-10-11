import { useMemo, useState } from "react";
import { FiDownload, FiFileText, FiTrendingUp } from "react-icons/fi";
import Button from "../../components/button/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency, formatDate, getExpenseFlags } from "../../utils/format.js";
import styles from "./styles.module.css";

const periodOptions = ["All dates", "October 2026", "September 2026"];
const statusOptions = ["All statuses", "Needs review", "Approved", "Paid", "Declined"];

const escapeCsv = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;

const Reports = ({ expenses, budgets, policies, notify }) => {
    const [period, setPeriod] = useState("All dates");
    const [status, setStatus] = useState("All statuses");
    const filtered = useMemo(() => expenses.filter((expense) => {
        const matchesPeriod = period === "All dates" || expense.date.startsWith(period === "October 2026" ? "2026-10" : "2026-09");
        const matchesStatus = status === "All statuses" || expense.status === status;
        return matchesPeriod && matchesStatus;
    }).sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id)), [expenses, period, status]);
    const recognized = filtered.filter((expense) => expense.status !== "Declined");
    const spend = recognized.reduce((sum, expense) => sum + expense.amount, 0);
    const declined = filtered.filter((expense) => expense.status === "Declined");
    const pending = filtered.filter((expense) => expense.status === "Needs review");
    const average = recognized.length ? spend / recognized.length : 0;
    const byCategory = recognized.reduce((totals, expense) => ({ ...totals, [expense.category]: (totals[expense.category] || 0) + expense.amount }), {});
    const categoryRows = Object.entries(byCategory).sort((a, b) => b[1] - a[1]);
    const highestCategory = Math.max(1, ...categoryRows.map(([, amount]) => amount));
    const byMonth = recognized.reduce((totals, expense) => {
        const month = expense.date.slice(0, 7);
        totals[month] = (totals[month] || 0) + expense.amount;
        return totals;
    }, {});
    const monthRows = Object.entries(byMonth).sort(([a], [b]) => a.localeCompare(b));
    const highestMonth = Math.max(1, ...monthRows.map(([, amount]) => amount));
    const totalBudget = budgets.reduce((sum, budget) => sum + budget.limit, 0);
    const usedBudget = totalBudget ? spend / totalBudget * 100 : 0;

    const exportCsv = () => {
        const header = ["Expense ID", "Date", "Merchant", "Purpose", "Employee", "Team", "Category", "Payment source", "Amount USD", "Status", "Receipt", "Policy flags"];
        const rows = filtered.map((expense) => [
            expense.id,
            expense.date,
            expense.merchant,
            expense.purpose,
            expense.employee,
            expense.team,
            expense.category,
            expense.card || "Out of pocket",
            expense.amount.toFixed(2),
            expense.status,
            expense.receipt ? "Attached" : "Missing",
            getExpenseFlags(expense, policies).join("; "),
        ]);
        const content = [header, ...rows].map((row) => row.map(escapeCsv).join(",")).join("\r\n");
        const blob = new Blob(["\uFEFF", content], { type: "text/csv;charset=utf-8" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = `tally-expenses-${period.toLowerCase().replaceAll(" ", "-")}-${status.toLowerCase().replaceAll(" ", "-")}.csv`;
        document.body.append(anchor);
        anchor.click();
        anchor.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 1000);
        notify("Report downloaded", `${filtered.length} expense records were exported as CSV.`);
    };

    return (
        <div className={styles.page}>
            <header className={styles.heading}>
                <div><p>Spend / Insights</p><h1>Expense reports</h1><span>Review real totals from this workspace and download the current view.</span></div>
                <Button icon={<FiDownload />} onClick={exportCsv} variant="primary">Export CSV</Button>
            </header>

            <section aria-label="Report filters" className={styles.toolbar}>
                <label>Reporting period<select onChange={(event) => setPeriod(event.target.value)} value={period}>{periodOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                <label>Expense status<select onChange={(event) => setStatus(event.target.value)} value={status}>{statusOptions.map((item) => <option key={item}>{item}</option>)}</select></label>
                <span>{filtered.length} records included</span>
            </section>

            <section aria-label="Expense totals" className={styles.metrics}>
                <article className={styles.featureMetric}><span><FiTrendingUp aria-hidden="true" /> Recognized spend</span><strong>{formatCurrency(spend)}</strong><small>Excludes declined expenses</small></article>
                <article><span>Average expense</span><strong>{formatCurrency(average)}</strong><small>Across {recognized.length} non-declined records</small></article>
                <article><span>Needs review</span><strong>{pending.length}</strong><small>{formatCurrency(pending.reduce((sum, expense) => sum + expense.amount, 0))} awaiting a decision</small></article>
                <article><span>Declined</span><strong>{declined.length}</strong><small>{formatCurrency(declined.reduce((sum, expense) => sum + expense.amount, 0))} excluded from spend</small></article>
            </section>

            <div className={styles.charts}>
                <section aria-labelledby="category-heading" className={styles.chartPanel}>
                    <div className={styles.panelHeading}><div><span>Where it goes</span><h2 id="category-heading">Spend by category</h2></div><span>{formatCurrency(spend)}</span></div>
                    {categoryRows.length ? <div className={styles.categoryRows}>{categoryRows.map(([category, amount]) => <div className={styles.categoryRow} key={category}><div><strong>{category}</strong><span>{formatCurrency(amount)}</span></div><div aria-label={`${Math.round(amount / highestCategory * 100)} percent of highest category`} className={styles.track}><i style={{ width: `${amount / highestCategory * 100}%` }} /></div></div>)}</div> : <p className={styles.emptyChart}>No recognized spend in this view.</p>}
                </section>
                <section aria-labelledby="month-heading" className={styles.chartPanel}>
                    <div className={styles.panelHeading}><div><span>By transaction month</span><h2 id="month-heading">Monthly movement</h2></div><FiTrendingUp aria-hidden="true" /></div>
                    {monthRows.length ? <div className={styles.monthChart}>{monthRows.map(([month, amount]) => <div className={styles.monthBar} key={month}><strong>{formatCurrency(amount)}</strong><div aria-label={`${formatCurrency(amount)} in ${month}`} className={styles.verticalTrack}><i style={{ height: `${Math.max(amount / highestMonth * 100, 5)}%` }} /></div><span>{new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(`${month}-15T12:00:00Z`))}</span></div>)}</div> : <p className={styles.emptyChart}>No monthly spend in this view.</p>}
                </section>
            </div>

            <section aria-labelledby="ledger-heading" className={styles.ledger}>
                <div className={styles.panelHeading}><div><span>Export-ready detail</span><h2 id="ledger-heading">Expense activity</h2></div><span><FiFileText aria-hidden="true" /> {filtered.length} rows</span></div>
                {filtered.length ? <><p className={styles.scrollHint}>Swipe the table to see every column.</p><div className={styles.tableWrap}><table><thead><tr><th>Expense</th><th>Owner</th><th>Date</th><th>Category</th><th>Status</th><th>Amount</th></tr></thead><tbody>{filtered.map((expense) => <tr key={expense.id}><td><strong>{expense.merchant}</strong><small>{expense.id} / {expense.purpose}</small></td><td>{expense.employee}</td><td>{formatDate(expense.date, { month: "short", day: "numeric" })}</td><td>{expense.category}</td><td><StatusPill status={expense.status} /></td><td className={styles.amount}>{formatCurrency(expense.amount)}</td></tr>)}</tbody></table></div></> : <p className={styles.emptyChart}>No expense records match the selected filters.</p>}
                <p className={styles.budgetNote}>Budget capacity: {formatCurrency(spend)} recognized spend of {formatCurrency(totalBudget)} planned ({Math.round(usedBudget)}%).</p>
            </section>
        </div>
    );
};

export default Reports;
