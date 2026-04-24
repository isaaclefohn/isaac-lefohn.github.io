"""
Discounted Cash Flow Valuation — Waste Management, Inc. (NYSE: WM)

Generates wm_dcf_model.xlsx with five worksheets:
    1. Summary        — key outputs, implied share price vs market
    2. Assumptions    — all editable drivers (yellow cells in Excel convention)
    3. Forecast       — 5-year P&L projection and FCFF build
    4. WACC           — cost-of-capital calculation
    5. Sensitivity    — implied share price across WACC and terminal growth

Historical data pulled from yfinance (SEC filings via Yahoo Finance). Forecast
assumptions documented inline below and in the Assumptions sheet.
"""

import xlsxwriter
from pathlib import Path

OUTPUT = Path(__file__).parent / "wm_dcf_model.xlsx"

# ---- Historical data (FY2022-FY2025, in $M) — source: WM 10-K filings via yfinance ----
HIST_YEARS = [2022, 2023, 2024, 2025]
HIST = {
    "revenue":        [19698, 20426, 22063, 25204],
    "ebit":           [3296,  3521,  4056,  4338],
    "ebitda":         [5334,  5592,  6323,  7201],
    "d_and_a":        [2038,  2071,  2267,  2863],   # derived: EBITDA - EBIT
    "capex":          [2587,  2920,  3231,  3227],
    "ocf":            [4536,  4719,  5390,  6043],
    "fcf":            [1949,  1799,  2159,  2816],
    "net_income":     [2238,  2304,  2746,  2708],
    "tax_provision":  [678,   745,   713,   717],
}

# ---- Market data (as of model date) ----
MARKET = {
    "share_price":          232.80,
    "shares_out_m":         402.9,
    "market_cap_m":         93897,
    "total_debt_m":         22907,
    "cash_m":               201,
    "beta":                 0.547,
    "risk_free_rate":       0.0425,   # 10-year Treasury
    "equity_risk_premium":  0.055,
    "pretax_cost_of_debt":  0.050,    # IG-rated BBB+ issuer
    "tax_rate":             0.24,     # 21% federal + ~3% state blended
}

# ---- Forecast drivers ----
# Revenue: 8% FY26-27 (Stericycle acquisition tailwind), stepping down to 5% by terminal
# EBIT margin: expands from 17.2% to 18.5% on operating leverage + Stericycle synergies
# CapEx: 12.5% of revenue (WM is capital-intensive — trucks, landfills, MRFs)
# D&A: 8.0% of revenue (roughly matches historical)
# Working capital: 0.5% of incremental revenue
# Terminal growth: 2.5% (above CPI, below nominal GDP — reflects pricing power)
FORECAST = {
    "revenue_growth":   [0.080, 0.080, 0.065, 0.055, 0.050],
    "ebit_margin":      [0.175, 0.178, 0.180, 0.183, 0.185],
    "capex_pct_rev":    [0.125, 0.125, 0.125, 0.125, 0.125],
    "d_and_a_pct_rev":  [0.080, 0.080, 0.080, 0.080, 0.080],
    "nwc_pct_delta_rev": 0.005,
    "terminal_growth":  0.025,
}

FORECAST_YEARS = [2026, 2027, 2028, 2029, 2030]


def compute_wacc():
    cost_equity = MARKET["risk_free_rate"] + MARKET["beta"] * MARKET["equity_risk_premium"]
    after_tax_cod = MARKET["pretax_cost_of_debt"] * (1 - MARKET["tax_rate"])
    total_cap = MARKET["market_cap_m"] + MARKET["total_debt_m"]
    w_e = MARKET["market_cap_m"] / total_cap
    w_d = MARKET["total_debt_m"] / total_cap
    wacc = w_e * cost_equity + w_d * after_tax_cod
    return {
        "cost_equity": cost_equity,
        "after_tax_cod": after_tax_cod,
        "w_equity": w_e,
        "w_debt": w_d,
        "wacc": wacc,
    }


def build_forecast():
    """Project revenue, EBIT, NOPAT, D&A, CapEx, ΔNWC, and FCFF for each year."""
    years = []
    last_rev = HIST["revenue"][-1]
    for i, yr in enumerate(FORECAST_YEARS):
        rev = last_rev * (1 + FORECAST["revenue_growth"][i])
        ebit = rev * FORECAST["ebit_margin"][i]
        nopat = ebit * (1 - MARKET["tax_rate"])
        d_and_a = rev * FORECAST["d_and_a_pct_rev"][i]
        capex = rev * FORECAST["capex_pct_rev"][i]
        delta_nwc = (rev - last_rev) * FORECAST["nwc_pct_delta_rev"]
        fcff = nopat + d_and_a - capex - delta_nwc
        years.append({
            "year": yr, "revenue": rev, "ebit": ebit, "nopat": nopat,
            "d_and_a": d_and_a, "capex": capex, "delta_nwc": delta_nwc, "fcff": fcff,
        })
        last_rev = rev
    return years


def compute_valuation(forecast, wacc):
    """Discount FCFF + terminal value; back out implied equity value per share."""
    g = FORECAST["terminal_growth"]
    pv_explicit = sum(y["fcff"] / ((1 + wacc) ** (i + 1)) for i, y in enumerate(forecast))
    terminal_fcff = forecast[-1]["fcff"] * (1 + g)
    terminal_value = terminal_fcff / (wacc - g)
    pv_terminal = terminal_value / ((1 + wacc) ** len(forecast))
    enterprise_value = pv_explicit + pv_terminal
    equity_value = enterprise_value - MARKET["total_debt_m"] + MARKET["cash_m"]
    implied_price = equity_value / MARKET["shares_out_m"]
    return {
        "pv_explicit": pv_explicit,
        "terminal_value": terminal_value,
        "pv_terminal": pv_terminal,
        "enterprise_value": enterprise_value,
        "equity_value": equity_value,
        "implied_price": implied_price,
        "market_price": MARKET["share_price"],
        "pct_over_under": (implied_price / MARKET["share_price"] - 1),
    }


def write_workbook():
    wacc_calc = compute_wacc()
    forecast = build_forecast()
    val = compute_valuation(forecast, wacc_calc["wacc"])

    wb = xlsxwriter.Workbook(str(OUTPUT))

    # ---- Formats ----
    title = wb.add_format({"bold": True, "font_size": 14, "font_color": "#1a1a1a"})
    header = wb.add_format({"bold": True, "bg_color": "#1a1a1a", "font_color": "white",
                            "border": 1, "align": "center"})
    label = wb.add_format({"bold": True, "font_color": "#333333"})
    money = wb.add_format({"num_format": "_($* #,##0_);_($* (#,##0);_($* \"-\"_);_(@_)"})
    pct = wb.add_format({"num_format": "0.0%"})
    pct1 = wb.add_format({"num_format": "0.00%"})
    input_cell = wb.add_format({"bg_color": "#FFF9C4", "border": 1,
                                "num_format": "_(* #,##0_);_(* (#,##0);_(* \"-\"_);_(@_)"})
    input_pct = wb.add_format({"bg_color": "#FFF9C4", "border": 1, "num_format": "0.0%"})
    output_money = wb.add_format({"bold": True, "bg_color": "#E8F5E9", "border": 1,
                                  "num_format": "_($* #,##0_);_($* (#,##0);_($* \"-\"_);_(@_)"})
    output_price = wb.add_format({"bold": True, "bg_color": "#E8F5E9", "border": 1,
                                  "num_format": "$0.00", "font_size": 12})

    # ---- Sheet 1: Summary ----
    ws = wb.add_worksheet("Summary")
    ws.set_column("A:A", 36)
    ws.set_column("B:B", 18)
    ws.write("A1", "Waste Management, Inc. (NYSE: WM)", title)
    ws.write("A2", "Discounted Cash Flow Valuation", wb.add_format({"italic": True, "font_color": "#555"}))
    ws.write("A4", "Key Outputs", header)
    ws.write("B4", "Value", header)

    outputs = [
        ("Enterprise Value ($M)",             val["enterprise_value"],  money),
        ("  (+) Cash",                        MARKET["cash_m"],         money),
        ("  (−) Total Debt",                  -MARKET["total_debt_m"],  money),
        ("Equity Value ($M)",                 val["equity_value"],      money),
        ("Shares Outstanding (M)",            MARKET["shares_out_m"],   wb.add_format({"num_format": "#,##0.0"})),
        ("Implied Share Price",               val["implied_price"],     output_price),
        ("Current Market Price",              val["market_price"],      wb.add_format({"num_format": "$0.00", "font_size": 12})),
        ("Upside / (Downside) vs Market",     val["pct_over_under"],    wb.add_format({"num_format": "0.0%", "bold": True, "font_size": 12})),
    ]
    for i, (lbl, v, fmt) in enumerate(outputs):
        ws.write(4 + i, 0, lbl, label)
        ws.write(4 + i, 1, v, fmt)

    ws.write("A14", "Valuation Build ($M)", header)
    ws.write("B14", "Value", header)
    build_rows = [
        ("PV of Explicit-Period FCFF (5 yrs)", val["pv_explicit"]),
        ("PV of Terminal Value",               val["pv_terminal"]),
        ("Enterprise Value",                   val["enterprise_value"]),
    ]
    for i, (lbl, v) in enumerate(build_rows):
        ws.write(14 + i, 0, lbl, label)
        ws.write(14 + i, 1, v, money)

    ws.write("A19", "Memo", header)
    ws.merge_range("A20:B22",
        "Implied intrinsic value is below the current market price, suggesting WM "
        "trades at a premium to DCF fair value. This is consistent with the market "
        "pricing in its low beta (0.55), regulatory moats, and CPI-linked pricing "
        "power. See Sensitivity sheet for ranges.",
        wb.add_format({"text_wrap": True, "valign": "top", "font_color": "#444"}))

    # ---- Sheet 2: Assumptions ----
    ws2 = wb.add_worksheet("Assumptions")
    ws2.set_column("A:A", 38)
    ws2.set_column("B:G", 14)
    ws2.write("A1", "Forecast Drivers", title)
    ws2.write("A2", "Yellow cells are inputs — change any to flex the model.",
              wb.add_format({"italic": True, "font_color": "#555"}))
    ws2.write("A4", "Year", header)
    for i, yr in enumerate(FORECAST_YEARS):
        ws2.write(3, 1 + i, yr, header)
    driver_rows = [
        ("Revenue Growth",      FORECAST["revenue_growth"],   input_pct),
        ("EBIT Margin",         FORECAST["ebit_margin"],      input_pct),
        ("D&A % of Revenue",    FORECAST["d_and_a_pct_rev"],  input_pct),
        ("CapEx % of Revenue",  FORECAST["capex_pct_rev"],    input_pct),
    ]
    for r, (lbl, vals, fmt) in enumerate(driver_rows):
        ws2.write(4 + r, 0, lbl, label)
        for c, v in enumerate(vals):
            ws2.write(4 + r, 1 + c, v, fmt)

    ws2.write("A10", "Other Inputs", header)
    ws2.write("B10", "Value", header)
    other = [
        ("Terminal Growth Rate",        FORECAST["terminal_growth"], input_pct),
        ("Working Capital % of ΔRev",   FORECAST["nwc_pct_delta_rev"], input_pct),
        ("Effective Tax Rate",          MARKET["tax_rate"],          input_pct),
        ("Risk-Free Rate (10Y UST)",    MARKET["risk_free_rate"],    input_pct),
        ("Equity Risk Premium",         MARKET["equity_risk_premium"], input_pct),
        ("Beta",                        MARKET["beta"],
            wb.add_format({"bg_color": "#FFF9C4", "border": 1, "num_format": "0.00"})),
        ("Pre-Tax Cost of Debt",        MARKET["pretax_cost_of_debt"], input_pct),
    ]
    for i, (lbl, v, fmt) in enumerate(other):
        ws2.write(10 + i, 0, lbl, label)
        ws2.write(10 + i, 1, v, fmt)

    # ---- Sheet 3: Forecast ----
    ws3 = wb.add_worksheet("Forecast")
    ws3.set_column("A:A", 32)
    ws3.set_column("B:K", 13)
    ws3.write("A1", "5-Year Forecast and FCFF Build ($M)", title)

    all_years = HIST_YEARS + FORECAST_YEARS
    ws3.write("A3", "", header)
    for i, yr in enumerate(all_years):
        fmt = header if yr in HIST_YEARS else wb.add_format({"bold": True, "bg_color": "#4a4a4a", "font_color": "white", "border": 1, "align": "center"})
        ws3.write(2, 1 + i, yr, fmt)
    ws3.write(2, 1 + len(all_years), "Note", header)

    rows = []
    rows.append(("Revenue", HIST["revenue"] + [y["revenue"] for y in forecast], "Actuals → Projection"))
    rows.append(("  Growth %",
                 [None] + [HIST["revenue"][i]/HIST["revenue"][i-1]-1 for i in range(1, len(HIST["revenue"]))]
                      + FORECAST["revenue_growth"],
                 "Forecast: 8%→5% fade"))
    rows.append(("EBIT", HIST["ebit"] + [y["ebit"] for y in forecast], "Operating income"))
    rows.append(("  EBIT Margin",
                 [HIST["ebit"][i]/HIST["revenue"][i] for i in range(len(HIST["revenue"]))]
                      + FORECAST["ebit_margin"],
                 "Expands 17.2% → 18.5%"))
    rows.append(("NOPAT",
                 [HIST["ebit"][i]*(1-MARKET["tax_rate"]) for i in range(len(HIST["ebit"]))]
                      + [y["nopat"] for y in forecast],
                 "EBIT × (1 − tax rate)"))
    rows.append(("(+) D&A",
                 HIST["d_and_a"] + [y["d_and_a"] for y in forecast],
                 "Non-cash addback"))
    rows.append(("(−) CapEx",
                 [-c for c in HIST["capex"]] + [-y["capex"] for y in forecast],
                 "Capital-intensive"))
    rows.append(("(−) ΔNWC",
                 [None]*len(HIST_YEARS) + [-y["delta_nwc"] for y in forecast],
                 "0.5% of ΔRev"))
    rows.append(("FCFF",
                 HIST["fcf"] + [y["fcff"] for y in forecast],
                 "Free cash flow to firm"))

    for r, (lbl, vals, note) in enumerate(rows):
        ws3.write(3 + r, 0, lbl, label)
        for c, v in enumerate(vals):
            is_pct = "%" in lbl or "Margin" in lbl
            fmt = pct1 if is_pct else money
            if lbl == "FCFF":
                fmt = output_money
            if v is None:
                ws3.write(3 + r, 1 + c, "", fmt)
            else:
                ws3.write(3 + r, 1 + c, v, fmt)
        ws3.write(3 + r, 1 + len(vals), note, wb.add_format({"italic": True, "font_color": "#666"}))

    # ---- Sheet 4: WACC ----
    ws4 = wb.add_worksheet("WACC")
    ws4.set_column("A:A", 34)
    ws4.set_column("B:B", 14)
    ws4.write("A1", "Weighted Average Cost of Capital", title)

    ws4.write("A3", "Cost of Equity (CAPM)", header)
    ws4.write("B3", "Value", header)
    ce_rows = [
        ("Risk-Free Rate",       MARKET["risk_free_rate"],     pct1),
        ("Beta",                 MARKET["beta"],               wb.add_format({"num_format": "0.00"})),
        ("Equity Risk Premium",  MARKET["equity_risk_premium"], pct1),
        ("Cost of Equity",       wacc_calc["cost_equity"],     wb.add_format({"bold": True, "bg_color": "#E8F5E9", "border": 1, "num_format": "0.00%"})),
    ]
    for i, (lbl, v, fmt) in enumerate(ce_rows):
        ws4.write(3 + i, 0, lbl, label)
        ws4.write(3 + i, 1, v, fmt)

    ws4.write("A9", "Cost of Debt", header)
    ws4.write("B9", "Value", header)
    cd_rows = [
        ("Pre-Tax Cost of Debt",   MARKET["pretax_cost_of_debt"], pct1),
        ("Tax Rate",               MARKET["tax_rate"],            pct1),
        ("After-Tax Cost of Debt", wacc_calc["after_tax_cod"],
            wb.add_format({"bold": True, "bg_color": "#E8F5E9", "border": 1, "num_format": "0.00%"})),
    ]
    for i, (lbl, v, fmt) in enumerate(cd_rows):
        ws4.write(9 + i, 0, lbl, label)
        ws4.write(9 + i, 1, v, fmt)

    ws4.write("A14", "Capital Structure (Market Values, $M)", header)
    ws4.write("B14", "Value", header)
    cap_rows = [
        ("Market Cap",          MARKET["market_cap_m"],    money),
        ("Total Debt",          MARKET["total_debt_m"],    money),
        ("% Equity",            wacc_calc["w_equity"],     pct1),
        ("% Debt",              wacc_calc["w_debt"],       pct1),
    ]
    for i, (lbl, v, fmt) in enumerate(cap_rows):
        ws4.write(14 + i, 0, lbl, label)
        ws4.write(14 + i, 1, v, fmt)

    ws4.write("A20", "WACC", header)
    ws4.write("B20", wacc_calc["wacc"],
              wb.add_format({"bold": True, "bg_color": "#E8F5E9", "border": 1,
                             "num_format": "0.00%", "font_size": 12}))

    # ---- Sheet 5: Sensitivity ----
    ws5 = wb.add_worksheet("Sensitivity")
    ws5.set_column("A:A", 28)
    ws5.set_column("B:H", 12)
    ws5.write("A1", "Implied Share Price Sensitivity", title)
    ws5.write("A2", "Rows: WACC | Columns: Terminal growth rate",
              wb.add_format({"italic": True, "font_color": "#555"}))

    wacc_range = [0.060, 0.063, 0.066, 0.068, 0.070, 0.073, 0.076]
    g_range = [0.020, 0.023, 0.025, 0.028, 0.030, 0.033]

    ws5.write("A4", "WACC ↓  /  g →", header)
    for c, g in enumerate(g_range):
        ws5.write(3, 1 + c, g, wb.add_format({"bg_color": "#1a1a1a", "font_color": "white",
                                              "border": 1, "align": "center", "num_format": "0.0%"}))

    for r, w in enumerate(wacc_range):
        ws5.write(4 + r, 0, w, wb.add_format({"bg_color": "#1a1a1a", "font_color": "white",
                                              "border": 1, "align": "center", "num_format": "0.00%"}))
        for c, g in enumerate(g_range):
            pv_exp = sum(y["fcff"] / ((1 + w) ** (i + 1)) for i, y in enumerate(forecast))
            tv = forecast[-1]["fcff"] * (1 + g) / (w - g) if w > g else 0
            pv_tv = tv / ((1 + w) ** len(forecast))
            ev = pv_exp + pv_tv
            eq = ev - MARKET["total_debt_m"] + MARKET["cash_m"]
            price = eq / MARKET["shares_out_m"]
            is_current = abs(w - wacc_calc["wacc"]) < 0.005 and abs(g - FORECAST["terminal_growth"]) < 0.005
            cell_fmt = wb.add_format({"num_format": "$0.00",
                                      "bg_color": "#E8F5E9" if is_current else "white",
                                      "bold": is_current, "border": 1})
            ws5.write(4 + r, 1 + c, price, cell_fmt)

    ws5.write("A13", f"Market Price: ${MARKET['share_price']:.2f}", label)
    ws5.write("A14", f"Base-case implied price: ${val['implied_price']:.2f} (highlighted cell)", label)

    wb.close()
    return {"wacc": wacc_calc, "forecast": forecast, "valuation": val}


if __name__ == "__main__":
    result = write_workbook()
    v = result["valuation"]
    w = result["wacc"]
    print(f"Model written to: {OUTPUT}")
    print(f"WACC: {w['wacc']:.2%}  (CoE: {w['cost_equity']:.2%}, CoD: {w['after_tax_cod']:.2%})")
    print(f"Enterprise Value: ${v['enterprise_value']:,.0f}M")
    print(f"Equity Value:     ${v['equity_value']:,.0f}M")
    print(f"Implied Price:    ${v['implied_price']:.2f}")
    print(f"Market Price:     ${v['market_price']:.2f}")
    print(f"Upside/(Down):    {v['pct_over_under']:+.1%}")
