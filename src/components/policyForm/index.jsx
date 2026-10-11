import { useState } from "react";
import Button from "../button/index.jsx";
import styles from "./styles.module.css";

const PolicyForm = ({ policy, categories, onSave }) => {
    const [form, setForm] = useState(() => ({
        name: policy?.name || "",
        category: policy?.category || "All categories",
        limit: policy ? String(policy.limit) : "",
        rule: policy?.rule || "",
        active: policy?.active ?? true,
    }));
    const [error, setError] = useState("");
    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.name === "active" ? event.target.value === "true" : event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const limit = Number(form.limit);
        if (form.name.trim().length < 3) return setError("Give this policy a clear name.");
        if (!Number.isFinite(limit) || limit < 1) return setError("Enter a threshold above zero.");
        if (form.rule.trim().length < 8) return setError("Describe what the policy checks.");
        setError("");
        onSave({ ...form, name: form.name.trim(), rule: form.rule.trim(), limit });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.fields}>
                <label>Policy name<input maxLength="55" name="name" onChange={update} placeholder="e.g. Team meal cap" value={form.name} /></label>
                <label>Category<select name="category" onChange={update} value={form.category}>{["All categories", ...categories].map((category) => <option key={category}>{category}</option>)}</select></label>
                <label>Amount threshold<input inputMode="decimal" min="1" name="limit" onChange={update} placeholder="100" type="number" value={form.limit} /></label>
                <label>Status<select name="active" onChange={update} value={String(form.active)}><option value="true">Active</option><option value="false">Paused</option></select></label>
                <label className={styles.full}>What should reviewers check?<textarea maxLength="180" name="rule" onChange={update} placeholder="Describe the expense condition for reviewers" rows="3" value={form.rule} /></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <div className={styles.actions}><Button type="submit" variant="primary">{policy ? "Save policy" : "Add policy"}</Button></div>
        </form>
    );
};

export default PolicyForm;
