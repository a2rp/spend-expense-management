import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiX } from "react-icons/fi";
import styles from "./styles.module.css";

const Modal = ({ open, title, description, onClose, children, actions, size = "regular" }) => {
    const dialogRef = useRef(null);
    const closeRef = useRef(onClose);

    useEffect(() => { closeRef.current = onClose; }, [onClose]);

    useEffect(() => {
        if (!open) return undefined;
        const previousFocus = document.activeElement;
        const previousOverflow = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        const cancel = dialogRef.current?.querySelector("[data-dialog-cancel]");
        (cancel || dialogRef.current)?.focus();
        const handleKeyDown = (event) => {
            if (event.key === "Escape") closeRef.current?.();
            if (event.key !== "Tab") return;
            const controls = dialogRef.current?.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])');
            if (!controls?.length) return;
            if (event.shiftKey && document.activeElement === controls[0]) {
                event.preventDefault();
                controls[controls.length - 1].focus();
            } else if (!event.shiftKey && document.activeElement === controls[controls.length - 1]) {
                event.preventDefault();
                controls[0].focus();
            }
        };
        document.addEventListener("keydown", handleKeyDown);
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.documentElement.style.overflow = previousOverflow;
            previousFocus?.focus?.();
        };
    }, [open]);

    if (!open) return null;

    return createPortal(
        <div className={styles.overlay} onMouseDown={(event) => event.target === event.currentTarget && closeRef.current?.()}>
            <section aria-describedby={description ? "tally-dialog-description" : undefined} aria-labelledby="tally-dialog-title" aria-modal="true" className={`${styles.dialog} ${size === "wide" ? styles.wide : ""}`} ref={dialogRef} role="dialog" tabIndex={-1}>
                <header className={styles.header}>
                    <div>
                        <h2 id="tally-dialog-title">{title}</h2>
                        {description && <p id="tally-dialog-description">{description}</p>}
                    </div>
                    <button aria-label="Close dialog" className={styles.closeButton} onClick={() => closeRef.current?.()} type="button"><FiX aria-hidden="true" /></button>
                </header>
                <div className={styles.body}>{children}</div>
                {actions && <footer className={styles.actions}>{actions}</footer>}
            </section>
        </div>,
        document.body,
    );
};

export default Modal;
