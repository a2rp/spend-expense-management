import styles from "./styles.module.css";

const Button = ({ children, className = "", icon, onClick, type = "button", variant = "secondary", disabled = false, ...props }) => (
    <button className={`${styles.button} ${styles[variant] || ""} ${className}`} disabled={disabled} onClick={onClick} type={type} {...props}>
        {icon && <span aria-hidden="true" className={styles.icon}>{icon}</span>}
        <span>{children}</span>
    </button>
);

export default Button;
