import { useMemo, useState } from "react";
import { FiAlertCircle, FiCheck, FiEdit2, FiFileText, FiFilter, FiSearch, FiTrash2 } from "react-icons/fi";
import { Link, useSearchParams } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency, formatDate, getExpenseFlags } from "../../utils/format.js";
import styles from "./styles.module.css";

const statusOptions = ["All expenses", "Needs review", "Approved", "Paid", "Declined"];

const Expenses = ({ expenses, policies, categories, onReviewExpense, onDeleteExpense, onEditExpense }) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [search, setSearch] = useState(searchParams.get("search") || "");
    const [category, setCategory] = useState("All categories");
    const [sort, setSort] = useState("newest");
    const [dialog, setDialog] = useState(null);
    const [declineReason, setDeclineReason] = useState("");
    const [error, setError] = useState("");
    const selectedStatus = statusOptions.includes(searchParams.get("status")) ? searchParams.get("status") : "All expenses";
    const filtered = useMemo(() => expenses.filter((expense) => {
        const query = search.trim().toLowerCase();
        const matchesSearch = !query || [expense.id, expense.merchant, expense.purpose, expense.employee, expense.team, expense.category].join(" ").toLowerCase().includes(query);
        const matchesStatus = selectedStatus === "All expenses" || expense.status === selectedStatus;
        const matchesCategory = category === "All categories" || expense.category === category;
        return matchesSearch && matchesStatus && matchesCategory;
    }).sort((a, b) => {
        if (sort === "oldest") return a.date.localeCompare(b.date);
        if (sort === "largest") return b.amount - a.amount;
        if (sort === "smallest") return a.amount - b.amount;
        return b.date.localeCompare(a.date) || b.id.localeCompare(a.id);
    }), [expenses, search, selectedStatus, category, sort]);

    const chooseStatus = (status) => {
        const next = new URLSearchParams(searchParams);
        if (status === "All expenses") next.delete("status");
        else next.set("status", status);
        setSearchParams(next);
    };

    const clearFilters = () => {
        setSearch("");
        setCategory("All categories");
        setSearchParams({});
    };

    const confirmDecline = () => {
        if (declineReason.trim().length < 4) {
            setError("Add a short reason before declining this expense.");
            return;
        }
        onReviewExpense(dialog.expense.id, "Declined", declineReason.trim());
        setDialog(null);
        setDeclineReason("");
        setError("");
    };

    const closeDialog = () => { setDialog(null); setDeclineReason(""); setError(""); };
    const pendingCount = expenses.filter((expense) => expense.status === "Needs review").length;
    const totalAmount = filtered.reduce((sum, expense) => sum + expense.amount, 0);

    return (
        <div className={styles.page}>
            <header className={styles.heading}>
                <div><p>Spend / Register</p><h1>Expense register</h1><span>Find the record, check the policy, and make the next call.</span></div>
                <div className={styles.headingStat}><FiAlertCircle aria-hidden="true" /><span><strong>{pendingCount}</strong> need review</span></div>
            </header>

            <section aria-label="Expense register summary" className={styles.summary}>
                <span>{filtered.length} records shown</span><strong>{formatCurrency(totalAmount)}</strong><span>Value in the current view</span>
            </section>

            <section aria-label="Expense filters" className={styles.filterArea}>
                <div aria-label="Expense status" className={styles.tabs} role="group">
                    {statusOptions.map((status) => <button aria-pressed={selectedStatus === status} className={selectedStatus === status ? styles.selected : ""} key={status} onClick={() => chooseStatus(status)} type="button">{status}{status === "Needs review" && <span>{pendingCount}</span>}</button>)}
                </div>
                <div className={styles.filters}>
                    <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search expenses</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Merchant, teammate, or purpose" value={search} /></label>
                    <label className={styles.select}><FiFilter aria-hidden="true" /><span className={styles.srOnly}>Category</span><select onChange={(event) => setCategory(event.target.value)} value={category}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
                    <label className={styles.select}><span>Sort</span><select onChange={(event) => setSort(event.target.value)} value={sort}><option value="newest">Newest</option><option value="oldest">Oldest</option><option value="largest">Largest amount</option><option value="smallest">Smallest amount</option></select></label>
                    {(search || category !== "All categories" || selectedStatus !== "All expenses") && <button className={styles.clearButton} onClick={clearFilters} type="button">Clear filters</button>}
                </div>
            </section>

            <section aria-label="Expense records" className={styles.records}>
                <div className={styles.tableHeader}><span>Expense and owner</span><span>Category and payment</span><span>Date and status</span><span>Amount</span><span>Actions</span></div>
                {filtered.length ? filtered.map((expense) => {
                    const flags = getExpenseFlags(expense, policies);
                    return <article className={styles.expense} key={expense.id}>
                        <Link className={styles.expenseMain} to={`/expenses/${expense.id}`}>
                            <span className={styles.icon}><FiFileText aria-hidden="true" /></span>
                            <span className={styles.primaryText}><strong>{expense.merchant}</strong><small>{expense.purpose} / {expense.employee}</small><small className={styles.id}>{expense.id}</small></span>
                        </Link>
                        <div className={styles.category}><strong>{expense.category}</strong><small>{expense.card || "Out of pocket"}</small>{flags.map((flag) => <span className={styles.flag} key={flag}><FiAlertCircle aria-hidden="true" /> {flag}</span>)}</div>
                        <div className={styles.dateStatus}><small>{formatDate(expense.date, { month: "short", day: "numeric", year: "numeric" })}</small><StatusPill status={expense.status} /></div>
                        <strong className={styles.amount}>{formatCurrency(expense.amount)}</strong>
                        <div className={styles.actions}>
                            {expense.status === "Needs review" && <>
                                <button aria-label={`Approve ${expense.id}`} className={styles.approve} onClick={() => onReviewExpense(expense.id, "Approved")} title="Approve expense" type="button"><FiCheck aria-hidden="true" /></button>
                                <button aria-label={`Decline ${expense.id}`} className={styles.decline} onClick={() => { setDialog({ type: "decline", expense }); setError(""); }} title="Decline expense" type="button"><FiAlertCircle aria-hidden="true" /></button>
                            </>}
                            {expense.status === "Approved" && <button className={styles.markPaid} onClick={() => onReviewExpense(expense.id, "Paid")} type="button">Mark paid</button>}
                            <button aria-label={`Edit ${expense.id}`} onClick={() => onEditExpense(expense)} title="Edit expense" type="button"><FiEdit2 aria-hidden="true" /></button>
                            <button aria-label={`Remove ${expense.id}`} className={styles.remove} onClick={() => setDialog({ type: "delete", expense })} title="Remove expense" type="button"><FiTrash2 aria-hidden="true" /></button>
                        </div>
                    </article>;
                }) : <div className={styles.empty}><FiSearch aria-hidden="true" /><h2>No expense records match.</h2><p>Change the search or filters to see more records.</p><Button onClick={clearFilters}>Clear filters</Button></div>}
            </section>

            <Modal actions={<><Button data-dialog-cancel onClick={closeDialog}>Keep expense</Button><Button onClick={confirmDecline} variant="danger">Decline expense</Button></>} description="Record why this expense is being declined so the employee can understand the decision." onClose={closeDialog} open={dialog?.type === "decline"} title="Decline this expense?">
                <div className={styles.confirmBody}><strong>{dialog?.expense?.merchant} / {dialog?.expense?.id}</strong><label>Reason<textarea onChange={(event) => setDeclineReason(event.target.value)} placeholder="For example, the meal exceeded the team limit." rows="3" value={declineReason} /></label>{error && <p className={styles.error} role="alert">{error}</p>}</div>
            </Modal>
            <Modal actions={<><Button data-dialog-cancel onClick={closeDialog}>Keep expense</Button><Button onClick={() => { onDeleteExpense(dialog.expense.id); closeDialog(); }} variant="danger">Remove expense</Button></>} description="This removes the expense record from the current session." onClose={closeDialog} open={dialog?.type === "delete"} title="Remove this expense?">
                <div className={styles.confirmBody}><strong>{dialog?.expense?.merchant} / {dialog?.expense?.id}</strong><span>{formatCurrency(dialog?.expense?.amount || 0)} will be removed from spend totals and reports.</span></div>
            </Modal>
        </div>
    );
};

export default Expenses;
