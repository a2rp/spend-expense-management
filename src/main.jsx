import { createRoot } from "react-dom/client";
import { OverlayScrollbars } from "overlayscrollbars";
import "overlayscrollbars/overlayscrollbars.css";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

const scrollbar = OverlayScrollbars(document.body, {
    scrollbars: {
        theme: "os-theme-tally",
        autoHide: "move",
        autoHideSuspend: false,
    },
});

if (import.meta.hot) {
    import.meta.hot.dispose(() => scrollbar.destroy());
}

createRoot(document.getElementById("root")).render(
    <BrowserRouter basename={import.meta.env.BASE_URL}>
        <App />
    </BrowserRouter>,
);
