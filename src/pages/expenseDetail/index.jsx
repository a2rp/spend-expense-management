import { useState } from "react";
import { FiArrowLeft, FiCheck, FiClock, FiFileText, FiMapPin, FiMessageSquare, FiTrash2 } from "react-icons/fi";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../components/button/index.jsx";
import Modal from "../../components/modal/index.jsx";
import StatusPill from "../../components/statusPill/index.jsx";
import { formatCurrency, formatDate, getExpenseFlags } from "../../utils/format.js";
import styles from "./styles.module.css";

const ExpenseDetail = ({ expenses, policies, onReviewExpense, onDeleteExpense, onEditExpense }) => {
    const { expenseId } = useParams();
    const navigate = useNavigate();
    const [confirmDelete, setConfirmDelete] = useState(false);
    const [confirmDecline, setConfirmDecline] = useState(false);
    const [declineReason, setDeclineReason] = useState("");
    const [declineError, setDeclineError] = useState("");
    const expense = expenses.find((item) => item.id === expenseId);

    if (!expense) {
        return <section className={styles.notFound}>
            <span>Expense record</span>
            <h1>This expense is no longer here.</h1>
            <p>It may have been removed from the current session, or the record number may be incorrect.</p>
            <Link to="/expenses"><FiArrowLeft aria-hidden="true" /> Back to expenses</Link>
        </section>;
    }

    const flags = getExpenseFlags(expense, policies);
    const removeExpense = () => {
        onDeleteExpense(expense.id);
        setConfirmDelete(false);
        navigate("/expenses");
    };
    const declineExpense = () => {
        if (declineReason.trim().length < 4) {
            setDeclineError("Add a short reason before declining this expense.");
            return;
        }
        onReviewExpense(expense.id, "Declined", declineReason.trim());
        setConfirmDecline(false);
        setDeclineReason("");
        setDeclineError("");
    };

    return (
        <div className={styles.page}>
            <Link className={styles.back} to="/expenses"><FiArrowLeft aria-hidden="true" /> Expense register</Link>
            <header className={styles.heading}>
                <div><p>{expense.id} / {expense.category}</p><h1>{expense.merchant}</h1><span>{expense.purpose}</span></div>
                <StatusPill status={expense.status} />
            </header>

            <div className={styles.layout}>
                <main className={styles.primary}>
                    <section aria-label="Expense details" className={styles.card}>
                        <div className={styles.amountBlock}><span>Submitted amount</span><strong>{formatCurrency(expense.amount)}</strong><small>Charged to {expense.card || "Out of pocket"}</small></div>
                        <dl className={styles.details}>
                            <div><dt>Submitted by</dt><dd>{expense.employee}<small>{expense.team} team</small></dd></div>
                            <div><dt>Transaction date</dt><dd>{formatDate(expense.date, { month: "long", day: "numeric", year: "numeric" })}</dd></div>
                            <div><dt>Category</dt><dd>{expense.category}</dd></div>
                            <div><dt>Receipt</dt><dd><span className={expense.receipt ? styles.receiptReady : styles.receiptMissing}><FiFileText aria-hidden="true" /> {expense.receipt ? "Receipt attached" : "Receipt missing"}</span></dd></div>
                        </dl>
                    </section>

                    <section aria-labelledby="review-title" className={styles.card}>
                        <div className={styles.sectionHeading}><div><span>Policy check</span><h2 id="review-title">Review notes</h2></div><FiClock aria-hidden="true" /></div>
                        {flags.length ? <div className={styles.flags}>{flags.map((flag) => <p key={flag}><span aria-hidden="true">!</span>{flag}</p>)}</div> : <p className={styles.clearPolicy}><FiCheck aria-hidden="true" /> No active policy flags for this expense.</p>}
                        {expense.note && <div className={styles.note}><FiMessageSquare aria-hidden="true" /><div><strong>Employee note</strong><p>{expense.note}</p></div></div>}
                        {expense.reviewNote && <div className={styles.note}><FiMessageSquare aria-hidden="true" /><div><strong>Reviewer note</strong><p>{expense.reviewNote}</p></div></div>}
                    </section>

                    <section aria-labelledby="receipt-title" className={`${styles.card} ${styles.receiptCard}`}>
                        <div className={styles.sectionHeading}><div><span>Supporting document</span><h2 id="receipt-title">Receipt status</h2></div><FiFileText aria-hidden="true" /></div>
                        <div className={styles.receiptPreview}>
                            {expense.receipt ? <><span className={styles.receiptIcon}><FiFileText aria-hidden="true" /></span><div><strong>Receipt marked attached</strong><p>Receipt files are not uploaded in this frontend demonstration.</p></div></> : <><span className={styles.receiptIcon}><FiMapPin aria-hidden="true" /></span><div><strong>No receipt attached</strong><p>The reviewer can request a receipt before approving this expense.</p></div></>}
                        </div>
                    </section>
                </main>

                <aside className={styles.side}>
                    <section className={styles.actionCard}>
                        <span>Next step</span><h2>{expense.status === "Needs review" ? "Make a review decision" : expense.status === "Approved" ? "Ready for payment" : "Record actions"}</h2>
                        <p>{expense.status === "Needs review" ? "Approve this claim or decline it with a note for the employee." : expense.status === "Approved" ? "Record the reimbursement as paid when it is complete." : `This expense is currently ${expense.status.toLowerCase()}.`}</p>
                        {expense.status === "Needs review" && <>
                            <Button className={styles.fullButton} icon={<FiCheck />} onClick={() => onReviewExpense(expense.id, "Approved")} variant="primary">Approve expense</Button>
                            <Button className={styles.fullButton} onClick={() => { setConfirmDecline(true); setDeclineError(""); }} variant="secondary">Decline expense</Button>
                        </>}
                        {expense.status === "Approved" && <Button className={styles.fullButton} icon={<FiCheck />} onClick={() => onReviewExpense(expense.id, "Paid")} variant="primary">Mark as paid</Button>}
                        <div className={styles.actionLinks}><button onClick={() => onEditExpense(expense)} type="button">Edit details</button><button className={styles.removeLink} onClick={() => setConfirmDelete(true)} type="button"><FiTrash2 aria-hidden="true" /> Remove expense</button></div>
                    </section>
                    <section className={styles.metadata}><span>Record information</span><dl><div><dt>Expense ID</dt><dd>{expense.id}</dd></div><div><dt>Submitted date</dt><dd>{formatDate(expense.date)}</dd></div><div><dt>Payment source</dt><dd>{expense.card || "Out of pocket"}</dd></div></dl></section>
                </aside>
            </div>

            <Modal actions={<><Button data-dialog-cancel onClick={() => setConfirmDelete(false)}>Keep expense</Button><Button onClick={removeExpense} variant="danger">Remove expense</Button></>} description="This removes the expense from the current session, including its totals and report data." onClose={() => setConfirmDelete(false)} open={confirmDelete} title="Remove this expense?">
                <p className={styles.confirmText}><strong>{expense.merchant} / {expense.id}</strong><br />{formatCurrency(expense.amount)} will be removed from this workspace.</p>
            </Modal>
            <Modal actions={<><Button data-dialog-cancel onClick={() => setConfirmDecline(false)}>Keep for review</Button><Button onClick={declineExpense} variant="danger">Decline expense</Button></>} description="Record a reason so the employee understands this review decision." onClose={() => setConfirmDecline(false)} open={confirmDecline} title="Decline this expense?">
                <div className={styles.confirmText}><strong>{expense.merchant} / {expense.id}</strong><label className={styles.reasonLabel}>Reason<textarea onChange={(event) => setDeclineReason(event.target.value)} placeholder="For example, the meal exceeded the team limit." rows="3" value={declineReason} /></label>{declineError && <p className={styles.error} role="alert">{declineError}</p>}</div>
            </Modal>
        </div>
    );
};

export default ExpenseDetail;
