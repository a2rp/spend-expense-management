import { useEffect, useRef, useState } from "react";
import { FiCreditCard, FiGithub, FiMenu, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import Button from "../button/index.jsx";
import styles from "./styles.module.css";

const links = [
    { label: "Overview", to: "/", end: true },
    { label: "Expenses", to: "/expenses" },
    { label: "Cards", to: "/cards" },
    { label: "Budgets", to: "/budgets" },
    { label: "Policies", to: "/policies" },
    { label: "Reports", to: "/reports" },
];

const Header = ({ onNewExpense }) => {
    const [hidden, setHidden] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);
    const [search, setSearch] = useState("");
    const searchRef = useRef(null);
    const previousY = useRef(0);
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        previousY.current = window.scrollY;
        const handleScroll = () => {
            const currentY = window.scrollY;
            if (menuOpen || currentY < 24) setHidden(false);
            else if (currentY > previousY.current + 5) setHidden(true);
            else if (currentY < previousY.current - 5) setHidden(false);
            previousY.current = currentY;
        };
        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => window.removeEventListener("scroll", handleScroll);
    }, [menuOpen]);

    useEffect(() => { setMenuOpen(false); }, [location.pathname]);

    useEffect(() => {
        const handleShortcut = (event) => {
            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                searchRef.current?.focus();
            }
        };
        window.addEventListener("keydown", handleShortcut);
        return () => window.removeEventListener("keydown", handleShortcut);
    }, []);

    const submitSearch = (event) => {
        event.preventDefault();
        const query = search.trim();
        navigate(query ? `/expenses?search=${encodeURIComponent(query)}` : "/expenses");
    };

    return (
        <header className={`${styles.header} ${hidden && !menuOpen ? styles.hidden : ""}`}>
            <div className={styles.inner}>
                <NavLink aria-label="Tally overview" className={styles.brand} onClick={() => setMenuOpen(false)} to="/">
                    <span className={styles.brandMark}><FiCreditCard aria-hidden="true" /></span>
                    <span className={styles.brandName}>tally<span>.</span></span>
                </NavLink>
                <nav aria-label="Main navigation" className={`${styles.nav} ${menuOpen ? styles.open : ""}`}>
                    {links.map((link) => <NavLink className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ""}`} end={link.end} key={link.to} onClick={() => setMenuOpen(false)} to={link.to}>{link.label}</NavLink>)}
                </nav>
                <div className={styles.actions}>
                    <form className={styles.search} onSubmit={submitSearch} role="search">
                        <FiSearch aria-hidden="true" />
                        <input aria-label="Search expenses" onChange={(event) => setSearch(event.target.value)} placeholder="Search expenses" ref={searchRef} value={search} />
                        <kbd>Ctrl K</kbd>
                    </form>
                    <Button aria-label="New expense" icon={<FiPlus />} onClick={onNewExpense} variant="primary">New expense</Button>
                    <a className={styles.repository} href="https://github.com/a2rp/spend-expense-management" rel="noreferrer" target="_blank"><FiGithub aria-hidden="true" /> <span>Repository</span></a>
                </div>
                <button aria-expanded={menuOpen} aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"} className={styles.menuButton} onClick={() => setMenuOpen((current) => !current)} type="button">
                    {menuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
                </button>
            </div>
        </header>
    );
};

export default Header;
