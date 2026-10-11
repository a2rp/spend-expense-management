import { useState } from "react";
import Button from "../button/index.jsx";
import { teamMembers } from "../../data/seed.js";
import styles from "./styles.module.css";

const today = new Date().toISOString().slice(0, 10);

const ExpenseForm = ({ expense, categories, onSave }) => {
    const [form, setForm] = useState(() => ({
        merchant: expense?.merchant || "",
        purpose: expense?.purpose || "",
        amount: expense ? String(expense.amount) : "",
        date: expense?.date || today,
        category: expense?.category || categories[0],
        employee: expense?.employee || teamMembers[0],
        receipt: expense?.receipt ? "Attached" : "Missing",
        note: expense?.note || "",
    }));
    const [error, setError] = useState("");

    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const amount = Number(form.amount);
        if (form.merchant.trim().length < 2) return setError("Enter a merchant name.");
        if (!Number.isFinite(amount) || amount <= 0) return setError("Enter an amount greater than zero.");
        if (!form.date) return setError("Choose the transaction date.");
        setError("");
        onSave({ ...form, amount, receipt: form.receipt === "Attached", ...(expense ? {} : { status: "Needs review" }) });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.grid}>
                <label>Merchant<input autoComplete="organization" maxLength="70" name="merchant" onChange={update} placeholder="e.g. Northline Hotel" value={form.merchant} /></label>
                <label>Amount<input inputMode="decimal" min="0.01" name="amount" onChange={update} placeholder="0.00" step="0.01" type="number" value={form.amount} /></label>
                <label>What was this for?<input maxLength="90" name="purpose" onChange={update} placeholder="A short business purpose" value={form.purpose} /></label>
                <label>Team member<select name="employee" onChange={update} value={form.employee}>{teamMembers.map((member) => <option key={member}>{member}</option>)}</select></label>
                <label>Category<select name="category" onChange={update} value={form.category}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label>Transaction date<input name="date" onChange={update} type="date" value={form.date} /></label>
                <label>Receipt status<select name="receipt" onChange={update} value={form.receipt}><option>Attached</option><option>Missing</option></select></label>
                <label className={styles.full}>Note<textarea maxLength="220" name="note" onChange={update} placeholder="Add a useful detail for the reviewer" rows="3" value={form.note} /></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}><p>Changes stay in this session. No receipt file is uploaded.</p><Button type="submit" variant="primary">{expense ? "Save changes" : "Submit expense"}</Button></div>
        </form>
    );
};

export default ExpenseForm;
