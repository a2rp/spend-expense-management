import { useMemo, useState } from "react";
import { FiCreditCard, FiPause, FiPlay, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import Button from "../../components/button/index.jsx";
import CardForm from "../../components/cardForm/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency } from "../../utils/format.js";
import styles from "./styles.module.css";

const Cards = ({ cards, expenses, onSaveCard, onToggleCard, onDeleteCard }) => {
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All cards");
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const rows = useMemo(() => cards.map((card) => {
        const spent = expenses.filter((expense) => expense.card === card.name && expense.status !== "Declined").reduce((sum, expense) => sum + expense.amount, 0);
        return { ...card, currentSpend: spent, usage: card.limit > 0 ? Math.min(spent / card.limit * 100, 100) : 0 };
    }).filter((card) => {
        const query = search.trim().toLowerCase();
        const matchesText = !query || [card.name, card.holder, card.team, card.lastFour].join(" ").toLowerCase().includes(query);
        return matchesText && (status === "All cards" || card.status === status);
    }), [cards, expenses, search, status]);
    const activeCount = cards.filter((card) => card.status === "Active").length;
    const totalLimit = cards.filter((card) => card.status === "Active").reduce((sum, card) => sum + card.limit, 0);
    const closeForm = () => setEditing(null);
    const saveCard = (draft) => {
        onSaveCard(editing?.card || null, draft);
        closeForm();
    };
    const removeCard = () => {
        onDeleteCard(confirmDelete.id);
        setConfirmDelete(null);
    };

    return (
        <div className={styles.page}>
            <header className={styles.heading}>
                <div><p>Spend / Controls</p><h1>Team cards</h1><span>Keep card ownership, monthly limits, and current usage in one place.</span></div>
                <Button icon={<FiPlus />} onClick={() => setEditing({ type: "create" })} variant="primary">Add sample card</Button>
            </header>

            <section aria-label="Card account summary" className={styles.summary}>
                <div><span>Active cards</span><strong>{activeCount}</strong><small>of {cards.length} issued card records</small></div>
                <div><span>Active monthly limits</span><strong>{formatCurrency(totalLimit)}</strong><small>Available limits in this sample workspace</small></div>
                <div><span>Payment processing</span><strong>Not connected</strong><small>Cards here are demonstration records</small></div>
            </section>

            <section className={styles.toolbar} aria-label="Filter cards">
                <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search cards</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Search card, holder, or team" value={search} /></label>
                <div className={styles.filters} role="group" aria-label="Card status">
                    {["All cards", "Active", "Paused"].map((item) => <button aria-pressed={status === item} className={status === item ? styles.selected : ""} key={item} onClick={() => setStatus(item)} type="button">{item}</button>)}
                </div>
                <span className={styles.resultCount}>{rows.length} {rows.length === 1 ? "card" : "cards"}</span>
            </section>

            {rows.length ? <section aria-label="Team cards" className={styles.grid}>
                {rows.map((card) => <article className={`${styles.card} ${card.status === "Paused" ? styles.paused : ""}`} key={card.id}>
                    <div className={styles.cardTop}><span className={styles.cardBrand}><FiCreditCard aria-hidden="true" /> {card.type}</span><StatusPill status={card.status} /></div>
                    <div className={styles.cardVisual}><span className={styles.cardLabel}>{card.name}</span><strong>•••• &nbsp;•••• &nbsp;•••• &nbsp;{card.lastFour}</strong><div><span>{card.holder}</span><span>{card.team}</span></div></div>
                    <div className={styles.spendHead}><span>Spend to date</span><strong>{formatCurrency(card.currentSpend)} <small>of {formatCurrency(card.limit)}</small></strong></div>
                    <div aria-label={`${Math.round(card.usage)} percent of monthly card limit used`} className={styles.progress}><i style={{ width: `${card.usage}%` }} /></div>
                    <div className={styles.cardActions}>
                        <button onClick={() => setEditing({ type: "edit", card })} type="button">Edit limits</button>
                        <button aria-label={`${card.status === "Active" ? "Pause" : "Reactivate"} ${card.name}`} onClick={() => onToggleCard(card.id)} title={card.status === "Active" ? "Pause card" : "Reactivate card"} type="button">{card.status === "Active" ? <FiPause aria-hidden="true" /> : <FiPlay aria-hidden="true" />}{card.status === "Active" ? "Pause" : "Reactivate"}</button>
                        <button aria-label={`Remove ${card.name}`} className={styles.remove} onClick={() => setConfirmDelete(card)} title="Remove sample card" type="button"><FiTrash2 aria-hidden="true" /></button>
                    </div>
                </article>)}
            </section> : <section className={styles.empty}><FiCreditCard aria-hidden="true" /><h2>No cards match those filters.</h2><p>Adjust the search or status to see other cards.</p><Button onClick={() => { setSearch(""); setStatus("All cards"); }}>Clear filters</Button></section>}

            <Modal description="Create or update a sample team card and its monthly limit." onClose={closeForm} open={Boolean(editing)} title={editing?.card ? "Edit team card" : "Add a team card"}>
                <CardForm card={editing?.card} onSave={saveCard} />
            </Modal>
            <Modal actions={<><Button data-dialog-cancel onClick={() => setConfirmDelete(null)}>Keep card</Button><Button onClick={removeCard} variant="danger">Remove card</Button></>} description="This removes the card record from the current session. Existing expense records keep their payment source label." onClose={() => setConfirmDelete(null)} open={Boolean(confirmDelete)} title="Remove this card?">
                <p className={styles.confirmText}><strong>{confirmDelete?.name}</strong><br />The sample card and its limit will be removed from this workspace.</p>
            </Modal>
        </div>
    );
};

export default Cards;
