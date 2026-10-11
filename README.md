![Tally spend review workspace](./screenshot.png)

# Tally - Spend and expense management

**Live app:** [https://a2rp.github.io/spend-expense-management/](https://a2rp.github.io/spend-expense-management/)

Tally is a frontend-only expense review workspace for a small operations or finance team. It brings employee expense submissions, reviewer decisions, team cards, budgets, spending rules, and reports into one working demo.

## Pages and workflows

- **Overview:** Review this month's spend, items needing a decision, cleared expenses, budget usage, and recent activity. Open an expense, budget, or policy area from its related panel.
- **Expenses:** Search, filter, and sort expense records. Submit, edit, approve, decline with a reason, mark paid, and remove an expense. Destructive actions use a custom confirmation dialog.
- **Expense detail:** Inspect an expense's purpose, receipt status, policy flags, notes, and record details. Edit it, add a reviewer note, make a decision, mark it paid, or remove it.
- **Cards:** Add and edit team card records, change their limits, pause or reactivate them, and remove a card. Expense records keep their original payment source label if a card is removed.
- **Budgets:** Create and edit monthly or quarterly budgets, review spend against each category limit, filter and sort the list, and remove a budget with confirmation. Usage reflects expenses in the budget's period.
- **Policies:** Create, edit, activate, pause, filter, and remove review rules. The seeded rules cover receipt requirements, meal limits, hotel limits, and small expense auto-approval. Active rules flag matching expenses; qualifying new submissions can be approved automatically.
- **Reports:** Filter records and time periods, inspect spend totals and category/month summaries, and download the current filtered ledger as a CSV file.
- **Not found:** Unknown routes show a branded page with a route back into the workspace.

The interface is responsive and includes a compact mobile navigation menu. Success, validation, and decision feedback appears in app-styled toasts or dialogs. Lists and totals recalculate as records change during the current session.

## Demo data and limits

The app uses seeded sample records and React state in the current browser tab. It does not use local storage or a backend. Creating, editing, approving, declining, or removing records updates the active session, but a page refresh resets the demo to its original sample data.

This demo does not connect to a bank, card processor, accounting system, email service, or team account. Marking an expense as paid changes its sample record status only. Receipt status is sample metadata; the app does not upload or securely store receipt files. Policy checks and auto-approval are local examples, not a production compliance service.

## Run locally

Requires Node.js and npm.

```sh
npm install
npm run dev
```

Open the local URL printed by Vite. The project uses React, Vite, React Router, React Icons, OverlayScrollbars, and React Tooltip.

## Verify and deploy

```sh
npm run lint
npm run build
npm run deploy
```

The deploy command builds the site, copies the app entry to `dist/404.html` for GitHub Pages route fallback, and publishes `dist` to the `gh-pages` branch. The live app is hosted at [https://a2rp.github.io/spend-expense-management/](https://a2rp.github.io/spend-expense-management/).

## Screenshots

Screenshots below show the built production preview. They cover each app route, the responsive navigation and main mobile layouts, plus every create, edit, decision, and delete dialog.

### Pages - desktop

<details>
<summary>Spend overview</summary>
<br><img src="./screenshots/pages/spend-overview.png" alt="Tally overview with monthly spend, pending reviews, budget watch, and latest activity" width="960">
</details>

<details>
<summary>Expense register</summary>
<br><img src="./screenshots/pages/expense-register.png" alt="Expense register with searchable and filterable expense records" width="960">
</details>

<details>
<summary>Expense detail</summary>
<br><img src="./screenshots/pages/expense-detail.png" alt="Expense detail with receipt status, policy flags, reviewer notes, and actions" width="960">
</details>

<details>
<summary>Team cards</summary>
<br><img src="./screenshots/pages/team-cards.png" alt="Team cards with spend limits and card actions" width="960">
</details>

<details>
<summary>Budget plan</summary>
<br><img src="./screenshots/pages/budget-plan.png" alt="Budget plan with category limits and period-aware expense totals" width="960">
</details>

<details>
<summary>Review policies</summary>
<br><img src="./screenshots/pages/review-policies.png" alt="Review policies with active and paused expense rules" width="960">
</details>

<details>
<summary>Expense reports</summary>
<br><img src="./screenshots/pages/expense-reports.png" alt="Expense report with period filters, totals, charts, and ledger" width="960">
</details>

<details>
<summary>Not found route</summary>
<br><img src="./screenshots/pages/not-found.png" alt="Tally branded not found page" width="960">
</details>

### Pages - mobile

<details>
<summary>Overview on mobile</summary>
<br><img src="./screenshots/pages/spend-overview-mobile.png" alt="Responsive spend overview on a 390 pixel mobile viewport" width="390">
</details>

<details>
<summary>Expense register on mobile</summary>
<br><img src="./screenshots/pages/expense-register-mobile.png" alt="Responsive expense register on a 390 pixel mobile viewport" width="390">
</details>

<details>
<summary>Team cards on mobile</summary>
<br><img src="./screenshots/pages/team-cards-mobile.png" alt="Responsive team card list on a 390 pixel mobile viewport" width="390">
</details>

<details>
<summary>Expense reports on mobile</summary>
<br><img src="./screenshots/pages/expense-reports-mobile.png" alt="Expense reports with an internally scrollable ledger on mobile" width="390">
</details>

<details>
<summary>Mobile navigation open</summary>
<br><img src="./screenshots/pages/mobile-navigation-open.png" alt="Tally mobile navigation menu expanded" width="390">
</details>

### Dialogs

<details>
<summary>Submit an expense</summary>
<br><img src="./screenshots/modals/submit-expense.png" alt="New expense submission form" width="800">
</details>

<details>
<summary>Edit an expense</summary>
<br><img src="./screenshots/modals/edit-expense.png" alt="Edit expense form" width="800">
</details>

<details>
<summary>Decline an expense</summary>
<br><img src="./screenshots/modals/decline-expense.png" alt="Expense decline dialog with a reason field" width="800">
</details>

<details>
<summary>Remove an expense</summary>
<br><img src="./screenshots/modals/remove-expense-confirmation.png" alt="Expense removal confirmation with a safe cancel action" width="800">
</details>

<details>
<summary>Add a team card</summary>
<br><img src="./screenshots/modals/add-team-card.png" alt="Add team card form" width="800">
</details>

<details>
<summary>Edit a team card</summary>
<br><img src="./screenshots/modals/edit-team-card.png" alt="Edit team card form" width="800">
</details>

<details>
<summary>Remove a team card</summary>
<br><img src="./screenshots/modals/remove-team-card-confirmation.png" alt="Team card removal confirmation" width="800">
</details>

<details>
<summary>Create a budget</summary>
<br><img src="./screenshots/modals/create-budget.png" alt="Create a budget form" width="800">
</details>

<details>
<summary>Edit a budget</summary>
<br><img src="./screenshots/modals/edit-budget.png" alt="Edit a budget form" width="800">
</details>

<details>
<summary>Remove a budget</summary>
<br><img src="./screenshots/modals/remove-budget-confirmation.png" alt="Budget removal confirmation" width="800">
</details>

<details>
<summary>Create a review policy</summary>
<br><img src="./screenshots/modals/create-policy.png" alt="Create a review policy form" width="800">
</details>

<details>
<summary>Edit a review policy</summary>
<br><img src="./screenshots/modals/edit-policy.png" alt="Edit a review policy form" width="800">
</details>

<details>
<summary>Remove a review policy</summary>
<br><img src="./screenshots/modals/remove-policy-confirmation.png" alt="Review policy removal confirmation" width="800">
</details>

## Future improvements

These additions need server-side services or external providers and are not implemented in this frontend demo:

- Shared team workspaces with sign-in, role-based access, and synchronized records across devices.
- Secure receipt uploads and hosted document storage with access controls.
- Connections to accounting platforms, corporate card providers, and bank transaction feeds.
- Server-side audit history and organization-specific approval workflows.

## Links

- Portfolio: [https://www.ashishranjan.net](https://www.ashishranjan.net)
- GitHub: [https://github.com/a2rp](https://github.com/a2rp)
- CodePen: [https://codepen.io/ash1198](https://codepen.io/ash1198)
- LinkedIn: [https://www.linkedin.com/in/aashishranjan](https://www.linkedin.com/in/aashishranjan)
- Facebook: [https://www.facebook.com/theash.ashish/](https://www.facebook.com/theash.ashish/)
- YouTube: [https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1](https://www.youtube.com/@ashishranjan-ashz?sub_confirmation=1)
- Email: [mailto:ash.ranjan09@gmail.com](mailto:ash.ranjan09@gmail.com)

## Support

- Support: [https://a2rp-donation-page.netlify.app/](https://a2rp-donation-page.netlify.app/)
- Buy Me a Coffee: [https://buymeacoffee.com/ashishranjan](https://buymeacoffee.com/ashishranjan)
- Patreon: [https://www.patreon.com/ashishranjan](https://www.patreon.com/ashishranjan)
