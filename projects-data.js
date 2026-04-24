// ==========================================================================
// Projects data — single source of truth for the /projects.html page.
//
// To add/edit a project:
//   1. Edit this file only (no HTML changes needed).
//   2. Set status: 'draft' to show an "In Progress" ribbon, 'published' to hide it.
//   3. `details` accepts HTML — use it for the expandable "View details" section.
// ==========================================================================

const PROJECTS = [
    {
        id: 'dcf-valuation',
        type: 'Valuation',
        title: 'DCF Valuation — Waste Management (NYSE: WM)',
        hook: 'Five-year DCF on WM: WACC build, FCFF projection, terminal value, and sensitivity grid. Model is parameterized in Python and outputs a formatted Excel workbook.',
        tools: ['Python', 'Excel', 'Financial Modeling', 'WACC / CAPM', 'Sensitivity Analysis'],
        status: 'published',
        details: `
            <p><strong>Why WM:</strong> Waste Management is a textbook DCF target — defensive (beta 0.55), capital-intensive, pricing power via CPI-linked contract escalators, and stable FCF conversion. Lets the model focus on valuation mechanics instead of wrestling with volatile revenue.</p>
            <img src="projects/dcf-wm/wm_dcf_summary.png" alt="WM DCF summary chart showing FCFF projection and sensitivity grid" loading="lazy">
            <div class="project-kpis">
                <div class="project-kpi"><span class="project-kpi-label">WACC</span><span class="project-kpi-value">6.58%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Terminal g</span><span class="project-kpi-value">2.50%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Implied Price</span><span class="project-kpi-value">$122.72</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Market Price</span><span class="project-kpi-value">$232.80</span></div>
            </div>
            <p><strong>Finding:</strong> Base-case intrinsic value sits ~47% below the current market price. The gap isn't a &ldquo;sell&rdquo; call — it's the market paying a premium for defensive qualities (low beta, recession-resistant demand) and regulatory moats that a mechanical DCF doesn't capture. A buy case requires believing terminal growth exceeds 3.3% or EBIT margins expand toward 20%+, both of which the sensitivity grid makes visible.</p>
            <p><strong>Approach:</strong> Pulled four years of real financials (10-K data via yfinance), projected revenue forward with a Stericycle-synergy fade (8% → 5%), expanded EBIT margin 130 bps on operating leverage, built WACC from CAPM (risk-free 4.25%, ERP 5.5%, beta 0.55) plus after-tax cost of debt, and applied Gordon-growth terminal value. All assumptions sit in a single Assumptions tab — flex any input to re-run the model.</p>
            <div class="project-links">
                <a href="projects/dcf-wm/wm_dcf_model.xlsx" download>Download Excel model (.xlsx)</a>
                <a href="https://github.com/isaaclefohn/isaaclefohn.github.io/blob/main/projects/dcf-wm/build_model.py" target="_blank" rel="noopener">View Python source</a>
            </div>
        `
    },
    {
        id: 'python-portfolio',
        type: 'Python Analysis',
        title: 'Python Portfolio Analysis Tool',
        hook: 'Pulls historical price data via yfinance, computes rolling returns, volatility, and Sharpe ratio across a sample portfolio.',
        tools: ['Python', 'pandas', 'yfinance', 'matplotlib'],
        status: 'draft',
        details: `
            <p><strong>Scope:</strong> Script ingests a user-defined ticker list, downloads five years of daily closes, and computes rolling 30-day return, annualized volatility, and Sharpe ratio.</p>
            <p><strong>Output:</strong> Summary table plus matplotlib visualization comparing portfolio vs. SPY benchmark.</p>
            <p><em>Repo and notebook link coming soon.</em></p>
        `
    },
    {
        id: 'pnw-banks',
        type: 'Sector Research',
        title: 'Pacific NW Regional Banks — Comparative Writeup',
        hook: 'Comparative analysis of regional banks with Oregon exposure: loan-book composition, NIM trends, and deposit beta.',
        tools: ['Fundamental Analysis', '10-K Reading', 'Excel', 'Sector Comparables'],
        status: 'draft',
        details: `
            <p><strong>Scope:</strong> Read most recent 10-Ks and investor presentations for three regional banks. Pull key metrics: net interest margin, efficiency ratio, loan-to-deposit, and uninsured-deposit exposure.</p>
            <p><strong>Output:</strong> Side-by-side comp table plus a short memo on which balance sheet I'd rather own in a rising-rate environment.</p>
            <p><em>Memo coming soon.</em></p>
        `
    }
];
