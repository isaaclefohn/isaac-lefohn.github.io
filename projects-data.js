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
        title: 'Defensive Compounders vs SPY — 5-Year Risk-Adjusted Performance',
        hook: 'Equal-weighted 5-stock quality portfolio (WM, BRK.B, KO, JNJ, PG) analyzed against SPY. Full pipeline in Python: yfinance pull, CAGR / volatility / Sharpe / max drawdown / beta, formatted Excel output.',
        tools: ['Python', 'pandas', 'NumPy', 'yfinance', 'matplotlib', 'Sharpe Ratio', 'Beta'],
        status: 'published',
        details: `
            <p><strong>Thesis:</strong> The same fundamental traits that make Waste Management a good DCF target — low beta, wide moat, stable FCF conversion, dividend-paying — should, concentrated across five names, deliver a better <em>risk-adjusted</em> return than the S&amp;P 500. Not better absolute return in a bull market; better Sharpe.</p>
            <img src="projects/portfolio-analysis/portfolio_summary.png" alt="Cumulative return and drawdown comparison: defensive compounder portfolio vs SPY over five years" loading="lazy">
            <div class="project-kpis">
                <div class="project-kpi"><span class="project-kpi-label">Portfolio CAGR</span><span class="project-kpi-value">11.49%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">SPY CAGR</span><span class="project-kpi-value">11.75%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Portfolio Sharpe</span><span class="project-kpi-value">0.58</span></div>
                <div class="project-kpi"><span class="project-kpi-label">SPY Sharpe</span><span class="project-kpi-value">0.44</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Portfolio Max DD</span><span class="project-kpi-value">&minus;15.7%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">SPY Max DD</span><span class="project-kpi-value">&minus;24.5%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Portfolio Beta</span><span class="project-kpi-value">0.36</span></div>
                <div class="project-kpi"><span class="project-kpi-label">Volatility Δ</span><span class="project-kpi-value">&minus;4.5 pp</span></div>
            </div>
            <p><strong>Finding:</strong> The defensive book delivered essentially the same CAGR as SPY (11.49% vs 11.75%) with 27% less annualized volatility, a 36% smaller peak drawdown, and a beta of 0.36. Result: a Sharpe of 0.58 vs SPY's 0.44 — a third more return per unit of risk. The 2022 bear market is where the spread opens: SPY troughed at &minus;24.5%, the portfolio at &minus;15.7%.</p>
            <p><strong>Approach:</strong> Five years of daily adjusted closes via yfinance (Apr 2021 – Apr 2026), simple returns, equal-weighted portfolio construction (deliberate — no optimization look-ahead). Annualized on the standard 252-trading-day convention. Sharpe uses a 4.25% risk-free rate (10Y Treasury, matches the WM DCF). Beta computed as cov(stock, SPY) / var(SPY). Tickers and weights are parameters at the top of <code>analyze_portfolio.py</code> — swap the book, rerun, get a new workbook and chart.</p>
            <div class="project-links">
                <a href="projects/portfolio-analysis/portfolio_metrics.xlsx" download>Download Excel output (.xlsx)</a>
                <a href="https://github.com/isaaclefohn/isaaclefohn.github.io/blob/main/projects/portfolio-analysis/analyze_portfolio.py" target="_blank" rel="noopener">View Python source</a>
            </div>
        `
    },
    {
        id: 'pnw-banks',
        type: 'Sector Research',
        title: 'Pacific NW Regional Banks — Comparative Writeup (COLB, BANR, HFWA)',
        hook: 'Trading-multiples and balance-sheet comp of three PNW regional banks. Fundamentals pulled live from SEC EDGAR XBRL, market data from yfinance — no hand-keying. Focus: which balance sheet would I rather own in 2026?',
        tools: ['Python', 'SEC EDGAR API', 'yfinance', 'Bank Analysis', 'Trading Comps', 'XBRL'],
        status: 'published',
        details: `
            <p><strong>Setup:</strong> Three publicly-traded banks with heavy Oregon/Washington exposure: Columbia Banking (COLB, $66.8B assets, post-Umpqua merger), Banner Corp (BANR, $16.4B, organic-growth community bank), and Heritage Financial (HFWA, $7.0B, smallest/most conservatively capitalized). Different strategies, same geography.</p>
            <img src="projects/pnw-banks/pnw_banks_summary.png" alt="Profitability ratios and five-year total return comparison for COLB, BANR, HFWA vs the KRE regional bank ETF" loading="lazy">
            <div class="project-kpis">
                <div class="project-kpi"><span class="project-kpi-label">BANR ROE</span><span class="project-kpi-value">10.04%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">BANR 5Y Return</span><span class="project-kpi-value">+32.8%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">BANR P/E</span><span class="project-kpi-value">11.4×</span></div>
                <div class="project-kpi"><span class="project-kpi-label">COLB ROE</span><span class="project-kpi-value">7.02%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">COLB 5Y Return</span><span class="project-kpi-value">&minus;18.0%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">HFWA Equity / Assets</span><span class="project-kpi-value">13.23%</span></div>
                <div class="project-kpi"><span class="project-kpi-label">HFWA Beta</span><span class="project-kpi-value">0.48</span></div>
                <div class="project-kpi"><span class="project-kpi-label">KRE 5Y Return</span><span class="project-kpi-value">+11.7%</span></div>
            </div>
            <p><strong>View:</strong> BANR is the standout. It leads on every profitability measure (ROA 1.19%, ROE 10.04%, Est. NIM 3.59%), trades at the lowest P/E of the three (11.4×), and delivered +32.8% five-year total return vs the KRE regional-bank ETF at +11.7%. That's compounding shareholder value without needing scale or M&amp;A — exactly what you want from a community-bank management team.</p>
            <p><strong>COLB</strong> is the scale leader but the Umpqua integration shows up in the numbers: the lowest ROE in the set (7.02%) and a &minus;18.0% five-year total return. The cost-synergy thesis is still in front of it — and if NIM keeps compressing, the patience required to reach the run-rate earnings story gets harder to underwrite.</p>
            <p><strong>HFWA</strong> is the defensive option: smallest by assets but highest equity/assets (13.23%) and lowest beta (0.48). Return tracked the benchmark (+10.6% vs +11.7%). Not a growth story — a "preserve capital through credit stress" story. Relevant if you're worried about CRE rolling over in 2026.</p>
            <p><strong>Approach:</strong> All fundamentals pulled live from SEC EDGAR's XBRL companyfacts API (<code>data.sec.gov</code>) — the same structured 10-K data that Bloomberg and FactSet license. Handles multiple XBRL tag names per concept (banks file loans under 3–4 different tags) with fallback logic in <code>first_available()</code>. Market multiples via yfinance. Swap the tickers at the top of <code>build_comp_table.py</code> and rerun — the workbook and chart regenerate end-to-end.</p>
            <div class="project-links">
                <a href="projects/pnw-banks/pnw_banks_comp.xlsx" download>Download comp table (.xlsx)</a>
                <a href="https://github.com/isaaclefohn/isaaclefohn.github.io/blob/main/projects/pnw-banks/build_comp_table.py" target="_blank" rel="noopener">View Python source</a>
            </div>
        `
    }
];
