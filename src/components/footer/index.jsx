import { FaFacebookF, FaGithub, FaLinkedinIn, FaPatreon, FaYoutube } from "react-icons/fa";
import { FiGlobe, FiLifeBuoy, FiMail } from "react-icons/fi";
import { SiBuymeacoffee, SiCodepen } from "react-icons/si";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import { Link } from "react-router-dom";
import styles from "./styles.module.css";

const links = [
    { label: "Portfolio", href: "https://www.ashishranjan.net", icon: <FiGlobe aria-hidden="true" /> },
    { label: "GitHub", href: "https://github.com/a2rp", icon: <FaGithub aria-hidden="true" /> },
    { label: "CodePen", href: "https://codepen.io/ash1198", icon: <SiCodepen aria-hidden="true" /> },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/aashishranjan", icon: <FaLinkedinIn aria-hidden="true" /> },
    { label: "Facebook", href: "https://www.facebook.com/theash.ashish/", icon: <FaFacebookF aria-hidden="true" /> },
    { label: "YouTube", href: "https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1", icon: <FaYoutube aria-hidden="true" /> },
    { label: "Email", href: "mailto:ash.ranjan09@gmail.com", icon: <FiMail aria-hidden="true" /> },
    { label: "Support", href: "https://a2rp-donation-page.netlify.app/", icon: <FiLifeBuoy aria-hidden="true" /> },
    { label: "Buy Me a Coffee", href: "https://buymeacoffee.com/ashishranjan", icon: <SiBuymeacoffee aria-hidden="true" /> },
    { label: "Patreon", href: "https://www.patreon.com/ashishranjan", icon: <FaPatreon aria-hidden="true" /> },
    { label: "Source code", href: "https://github.com/a2rp/spend-expense-management", icon: <FaGithub aria-hidden="true" /> },
];

const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.brandBlock}>
            <Link aria-label="Tally overview" className={styles.brand} to="/">
                <img alt="" height="28" src={`${import.meta.env.BASE_URL}logo.png`} width="28" />
                <strong>tally<span>.</span></strong>
            </Link>
            <p>© {new Date().getFullYear()} <a href="https://www.ashishranjan.net" rel="noreferrer" target="_blank">Ashish Ranjan</a>. All rights reserved.</p>
        </div>
        <nav aria-label="Social and project links" className={styles.links}>
            {links.map((link) => <a aria-label={link.label} data-tooltip-content={link.label} data-tooltip-id="footer-link-tooltip" href={link.href} key={link.label} rel={link.href.startsWith("mailto:") ? undefined : "noreferrer"} target={link.href.startsWith("mailto:") ? undefined : "_blank"}>{link.icon}</a>)}
        </nav>
        <Tooltip className={styles.tooltip} delayShow={220} id="footer-link-tooltip" offset={8} place="top" />
    </footer>
);

export default Footer;
