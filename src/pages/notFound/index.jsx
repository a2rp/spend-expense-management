import { FiArrowLeft, FiHelpCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const NotFound = () => (
    <main className={styles.page}>
        <span className={styles.icon}><FiHelpCircle aria-hidden="true" /></span>
        <p>404 / Not in this ledger</p>
        <h1>We couldn’t find that page.</h1>
        <span className={styles.copy}>The address may be incomplete, or the page may have moved.</span>
        <Link to="/"><FiArrowLeft aria-hidden="true" /> Return to spend overview</Link>
    </main>
);

export default NotFound;
