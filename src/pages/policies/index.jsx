import { useMemo, useState } from "react";
import { FiCheck, FiFileText, FiPause, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";
import Button from "../../components/button/index.jsx";
import Modal from "../../components/modal/index.jsx";
import PolicyForm from "../../components/policyForm/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency } from "../../utils/format.js";
import styles from "./styles.module.css";

const Policies = ({ policies, categories, onSavePolicy, onDeletePolicy, onTogglePolicy }) => {
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All categories");
    const [editing, setEditing] = useState(null);
    const [confirmDelete, setConfirmDelete] = useState(null);
    const rows = useMemo(() => policies.filter((policy) => {
        const query = search.trim().toLowerCase();
        const matchesText = !query || [policy.name, policy.rule, policy.category].join(" ").toLowerCase().includes(query);
        return matchesText && (category === "All categories" || policy.category === "All categories" || policy.category === category);
    }).sort((a, b) => Number(b.active) - Number(a.active) || a.name.localeCompare(b.name)), [policies, search, category]);
    const activeCount = policies.filter((policy) => policy.active).length;
    const closeForm = () => setEditing(null);
    const savePolicy = (draft) => {
        onSavePolicy(editing?.policy || null, draft);
        closeForm();
    };
    const removePolicy = () => {
        onDeletePolicy(confirmDelete.id);
        setConfirmDelete(null);
    };

    return (
        <div className={styles.page}>
            <header className={styles.heading}>
                <div><p>Spend / Guardrails</p><h1>Review policies</h1><span>Set thresholds reviewers can apply to expenses before approving them.</span></div>
                <Button icon={<FiPlus />} onClick={() => setEditing({ type: "create" })} variant="primary">Add a policy</Button>
            </header>

            <section aria-label="Policy summary" className={styles.summary}>
                <div><span>Active rules</span><strong>{activeCount}<small> / {policies.length}</small></strong></div>
                <div><span>Thresholds use</span><strong>Expense amount</strong><small>Compared with each rule limit</small></div>
                <div><span>Policy scope</span><strong>Current workspace</strong><small>Changes apply to current session data</small></div>
            </section>

            <section aria-label="Filter policies" className={styles.toolbar}>
                <label className={styles.search}><FiSearch aria-hidden="true" /><span className={styles.srOnly}>Search policies</span><input onChange={(event) => setSearch(event.target.value)} placeholder="Search rule or category" value={search} /></label>
                <label>Category<select onChange={(event) => setCategory(event.target.value)} value={category}><option>All categories</option>{categories.map((item) => <option key={item}>{item}</option>)}</select></label>
                <span>{rows.length} {rows.length === 1 ? "rule" : "rules"}</span>
            </section>

            {rows.length ? <section aria-label="Expense review policies" className={styles.grid}>
                {rows.map((policy) => <article className={`${styles.policy} ${!policy.active ? styles.inactive : ""}`} key={policy.id}>
                    <div className={styles.policyTop}><span className={styles.icon}><FiFileText aria-hidden="true" /></span><StatusPill status={policy.active ? "Active" : "Paused"} /></div>
                    <span className={styles.category}>{policy.category}</span>
                    <h2>{policy.name}</h2>
                    <p className={styles.rule}>{policy.rule}</p>
                    <div className={styles.threshold}><span>Amount threshold</span><strong>{formatCurrency(policy.limit)}</strong></div>
                    <div className={styles.policyActions}>
                        <button onClick={() => setEditing({ type: "edit", policy })} type="button">Edit rule</button>
                        <button onClick={() => onTogglePolicy(policy.id)} type="button">{policy.active ? <><FiPause aria-hidden="true" /> Pause</> : <><FiCheck aria-hidden="true" /> Activate</>}</button>
                        <button aria-label={`Remove ${policy.name}`} className={styles.remove} onClick={() => setConfirmDelete(policy)} title="Remove policy" type="button"><FiTrash2 aria-hidden="true" /></button>
                    </div>
                </article>)}
            </section> : <section className={styles.empty}><FiFileText aria-hidden="true" /><h2>No policies match this view.</h2><p>Try another search or category filter.</p><Button onClick={() => { setSearch(""); setCategory("All categories"); }}>Clear filters</Button></section>}

            <section className={styles.note}><strong>How the sample checks work</strong><p>Receipt, meal, hotel, and custom thresholds are checked against expense data. When active, Small expense auto-approval approves new submissions within its limit. These sample rules do not process payments.</p></section>

            <Modal description="Define a category, amount threshold, and reviewer instruction." onClose={closeForm} open={Boolean(editing)} title={editing?.policy ? "Edit review policy" : "Create review policy"}>
                <PolicyForm categories={categories} key={editing?.policy?.id || editing?.type} onSave={savePolicy} policy={editing?.policy} />
            </Modal>
            <Modal actions={<><Button data-dialog-cancel onClick={() => setConfirmDelete(null)}>Keep policy</Button><Button onClick={removePolicy} variant="danger">Remove policy</Button></>} description="This removes the review rule from the current session." onClose={() => setConfirmDelete(null)} open={Boolean(confirmDelete)} title="Remove this policy?">
                <p className={styles.confirmText}><strong>{confirmDelete?.name}</strong><br />Its checks will no longer be included when reviewers inspect expense records.</p>
            </Modal>
        </div>
    );
};

export default Policies;
