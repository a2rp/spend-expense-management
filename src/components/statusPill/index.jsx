import styles from "./styles.module.css";

const statusClass = {
    "Needs review": styles.review,
    Approved: styles.approved,
    Paid: styles.paid,
    Declined: styles.declined,
    Active: styles.active,
    Paused: styles.paused,
};

const StatusPill = ({ status }) => <span className={`${styles.pill} ${statusClass[status] || styles.neutral}`}>{status}</span>;

export default StatusPill;
