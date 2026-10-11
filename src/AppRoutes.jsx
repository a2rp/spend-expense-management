import { lazy, Suspense } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Loading from "./components/loading/index.jsx";

const OverviewPage = lazy(() => import("./pages/overview/index.jsx"));
const ExpensesPage = lazy(() => import("./pages/expenses/index.jsx"));
const ExpenseDetailPage = lazy(() => import("./pages/expenseDetail/index.jsx"));
const CardsPage = lazy(() => import("./pages/cards/index.jsx"));
const BudgetsPage = lazy(() => import("./pages/budgets/index.jsx"));
const PoliciesPage = lazy(() => import("./pages/policies/index.jsx"));
const ReportsPage = lazy(() => import("./pages/reports/index.jsx"));
const NotFoundPage = lazy(() => import("./pages/notFound/index.jsx"));

const AppRoutes = ({ appData }) => {
    const location = useLocation();

    return (
        <Suspense fallback={<Loading />} key={location.pathname}>
            <Routes location={location}>
                <Route element={<OverviewPage {...appData} />} path="/" />
                <Route element={<ExpensesPage {...appData} />} path="/expenses" />
                <Route element={<ExpenseDetailPage {...appData} />} path="/expenses/:expenseId" />
                <Route element={<CardsPage {...appData} />} path="/cards" />
                <Route element={<BudgetsPage {...appData} />} path="/budgets" />
                <Route element={<PoliciesPage {...appData} />} path="/policies" />
                <Route element={<ReportsPage {...appData} />} path="/reports" />
                <Route element={<NotFoundPage />} path="*" />
            </Routes>
        </Suspense>
    );
};

export default AppRoutes;
