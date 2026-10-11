import { useEffect } from "react";
import { FiAlertCircle, FiCheckCircle, FiInfo, FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const icons = { success: FiCheckCircle, error: FiAlertCircle, info: FiInfo };

const Toast = ({ toast, onClose }) => {
    useEffect(() => {
        if (!toast) return undefined;
        const timer = window.setTimeout(onClose, 4300);
        return () => window.clearTimeout(timer);
    }, [toast, onClose]);

    if (!toast) return null;
    const Icon = icons[toast.type] || icons.success;

    return (
        <div aria-live="polite" className={`${styles.toast} ${styles[toast.type] || ""}`} role="status">
            <Icon aria-hidden="true" className={styles.icon} />
            <div><strong>{toast.title}</strong>{toast.message && <p>{toast.message}</p>}</div>
            <button aria-label="Dismiss notification" onClick={onClose} type="button"><FiX aria-hidden="true" /></button>
            <span className={styles.progress} />
        </div>
    );
};

export default Toast;
