export const expenseCategories = ["Travel", "Software", "Meals", "Operations", "Client care"];

export const initialExpenses = [
    { id: "EX-1048", merchant: "Northline Hotel", purpose: "Customer summit lodging", employee: "Maya Chen", team: "Sales", amount: 684.2, date: "2026-10-10", category: "Travel", status: "Needs review", receipt: true, card: "Travel card", note: "Two nights near the conference venue." },
    { id: "EX-1047", merchant: "Figma", purpose: "Product design seats", employee: "Jonah Miles", team: "Product", amount: 288, date: "2026-10-10", category: "Software", status: "Needs review", receipt: true, card: "Product card", note: "Monthly team plan." },
    { id: "EX-1046", merchant: "Juniper & Rye", purpose: "Partner working lunch", employee: "Priya Shah", team: "Sales", amount: 146.5, date: "2026-10-09", category: "Meals", status: "Needs review", receipt: false, card: "Travel card", note: "Receipt is still missing." },
    { id: "EX-1045", merchant: "Metro Rail", purpose: "Client site visit", employee: "Maya Chen", team: "Sales", amount: 68.4, date: "2026-10-09", category: "Travel", status: "Approved", receipt: true, card: "Travel card", note: "Round trip to Oakland." },
    { id: "EX-1044", merchant: "Notion", purpose: "Workspace renewal", employee: "Avery Brooks", team: "Operations", amount: 160, date: "2026-10-08", category: "Software", status: "Paid", receipt: true, card: "Operations card", note: "Annual team workspace." },
    { id: "EX-1043", merchant: "Harbor Print Co.", purpose: "Workshop materials", employee: "Jonah Miles", team: "Product", amount: 324.75, date: "2026-10-08", category: "Operations", status: "Needs review", receipt: true, card: "Product card", note: "Printed research boards and participant kits." },
    { id: "EX-1042", merchant: "Cloudline", purpose: "Usage overage", employee: "Avery Brooks", team: "Operations", amount: 412, date: "2026-10-07", category: "Software", status: "Needs review", receipt: true, card: "Operations card", note: "Monthly hosting usage." },
    { id: "EX-1041", merchant: "Market Street Cafe", purpose: "Design interview refreshments", employee: "Jonah Miles", team: "Product", amount: 94.6, date: "2026-10-06", category: "Meals", status: "Declined", receipt: true, card: "Product card", note: "Above the per-person meal limit." },
    { id: "EX-1040", merchant: "Wayfare", purpose: "Regional customer visit", employee: "Priya Shah", team: "Sales", amount: 535.8, date: "2026-10-05", category: "Travel", status: "Approved", receipt: true, card: "Travel card", note: "Rail and one night lodging." },
    { id: "EX-1039", merchant: "Studio Supply", purpose: "Prototype materials", employee: "Lena Ortiz", team: "Product", amount: 218.3, date: "2026-10-04", category: "Operations", status: "Paid", receipt: true, card: "Product card", note: "Materials for the hardware test." },
    { id: "EX-1038", merchant: "OpenTable", purpose: "Customer advisory dinner", employee: "Maya Chen", team: "Sales", amount: 232.4, date: "2026-10-03", category: "Client care", status: "Needs review", receipt: true, card: "Travel card", note: "Four guests and two hosts." },
    { id: "EX-1037", merchant: "Linear", purpose: "Planning workspace", employee: "Lena Ortiz", team: "Product", amount: 96, date: "2026-10-02", category: "Software", status: "Paid", receipt: true, card: "Product card", note: "Monthly project seats." },
];

export const initialCards = [
    { id: "CARD-2104", name: "Travel card", holder: "Maya Chen", team: "Sales", lastFour: "1842", type: "Physical", status: "Active", limit: 2400, spent: 1288.4 },
    { id: "CARD-2105", name: "Product card", holder: "Jonah Miles", team: "Product", lastFour: "6518", type: "Virtual", status: "Active", limit: 1800, spent: 929.65 },
    { id: "CARD-2106", name: "Operations card", holder: "Avery Brooks", team: "Operations", lastFour: "9026", type: "Virtual", status: "Active", limit: 1200, spent: 572 },
    { id: "CARD-2107", name: "Client visits", holder: "Priya Shah", team: "Sales", lastFour: "3371", type: "Virtual", status: "Paused", limit: 900, spent: 535.8 },
];

export const initialBudgets = [
    { id: "B-501", category: "Travel", owner: "Sales team", limit: 7000, spent: 4208.4, period: "October" },
    { id: "B-502", category: "Software", owner: "Product and operations", limit: 4200, spent: 2654, period: "October" },
    { id: "B-503", category: "Meals", owner: "All teams", limit: 2500, spent: 1241.1, period: "October" },
    { id: "B-504", category: "Operations", owner: "Operations team", limit: 4600, spent: 2114.75, period: "October" },
    { id: "B-505", category: "Client care", owner: "Sales team", limit: 1800, spent: 632.4, period: "October" },
];

export const initialPolicies = [
    { id: "P-101", name: "Receipt required", category: "All categories", limit: 75, rule: "Require a receipt for expenses over this amount.", active: true },
    { id: "P-102", name: "Team meal limit", category: "Meals", limit: 90, rule: "Keep each meal expense at or below this amount per person.", active: true },
    { id: "P-103", name: "Hotel nightly limit", category: "Travel", limit: 325, rule: "Flag hotel nights above this amount for review.", active: true },
    { id: "P-104", name: "Small expense auto-approval", category: "All categories", limit: 50, rule: "Eligible expenses under this amount can skip manager review.", active: false },
];

export const teamMembers = ["Maya Chen", "Jonah Miles", "Priya Shah", "Avery Brooks", "Lena Ortiz"];
