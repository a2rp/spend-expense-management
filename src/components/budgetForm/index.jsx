import { useState } from "react";
import Button from "../button/index.jsx";
import styles from "./styles.module.css";

const BudgetForm = ({ budget, categories, onSave }) => {
    const [form, setForm] = useState(() => ({
        category: budget?.category || categories[0],
        owner: budget?.owner || "All teams",
        limit: budget ? String(budget.limit) : "",
        period: budget?.period || "Monthly",
    }));
    const [error, setError] = useState("");
    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const limit = Number(form.limit);
        if (!Number.isFinite(limit) || limit < 1) return setError("Enter a budget limit above zero.");
        if (form.owner.trim().length < 2) return setError("Add the team or owner for this budget.");
        setError("");
        onSave({ ...form, owner: form.owner.trim(), limit });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.fields}>
                <label>Category<select name="category" onChange={update} value={form.category}>{categories.map((category) => <option key={category}>{category}</option>)}</select></label>
                <label>Team or owner<input maxLength="60" name="owner" onChange={update} placeholder="All teams" value={form.owner} /></label>
                <label>Budget limit<input inputMode="decimal" min="1" name="limit" onChange={update} placeholder="5000" type="number" value={form.limit} /></label>
                <label>Period<select name="period" onChange={update} value={form.period}><option>Monthly</option><option>Quarterly</option></select></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <p className={styles.note}>Spend totals follow the expense records in this session.</p>
            <div className={styles.actions}><Button type="submit" variant="primary">{budget ? "Save budget" : "Create budget"}</Button></div>
        </form>
    );
};

export default BudgetForm;
