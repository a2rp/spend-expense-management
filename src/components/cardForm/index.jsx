import { useState } from "react";
import Button from "../button/index.jsx";
import { teamMembers } from "../../data/seed.js";
import styles from "./styles.module.css";

const CardForm = ({ card, onSave }) => {
    const [form, setForm] = useState(() => ({
        name: card?.name || "",
        holder: card?.holder || teamMembers[0],
        team: card?.team || "Sales",
        limit: card ? String(card.limit) : "",
        type: card?.type || "Virtual",
    }));
    const [error, setError] = useState("");
    const update = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

    const submit = (event) => {
        event.preventDefault();
        const limit = Number(form.limit);
        if (form.name.trim().length < 3) return setError("Give this card a clear name.");
        if (!Number.isFinite(limit) || limit < 1) return setError("Enter a monthly limit above zero.");
        setError("");
        onSave({ ...form, name: form.name.trim(), limit });
    };

    return (
        <form className={styles.form} noValidate onSubmit={submit}>
            <div className={styles.fields}>
                <label>Card name<input maxLength="48" name="name" onChange={update} placeholder="e.g. Field team travel" value={form.name} /></label>
                <label>Cardholder<select name="holder" onChange={update} value={form.holder}>{teamMembers.map((member) => <option key={member}>{member}</option>)}</select></label>
                <label>Team<select name="team" onChange={update} value={form.team}>{["Sales", "Product", "Operations", "People"].map((team) => <option key={team}>{team}</option>)}</select></label>
                <label>Monthly limit<input inputMode="decimal" min="1" name="limit" onChange={update} placeholder="1200" type="number" value={form.limit} /></label>
                <label className={styles.full}>Card type<select name="type" onChange={update} value={form.type}><option>Virtual</option><option>Physical</option></select></label>
            </div>
            {error && <p className={styles.error} role="alert">{error}</p>}
            <p className={styles.note}>This is a sample card record. No payment network is connected.</p>
            <div className={styles.actions}><Button type="submit" variant="primary">{card ? "Save card" : "Create sample card"}</Button></div>
        </form>
    );
};

export default CardForm;
