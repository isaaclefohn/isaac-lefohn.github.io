"""
Generates pnw_banks_summary.png — profitability bars + 5Y total return.

Panel A: Grouped bars of ROA, ROE, Est. NIM across the three banks.
Panel B: Cumulative total return (5Y) for each bank vs KRE benchmark ETF.

Run after build_comp_table.py to get the rows dict.
"""

from pathlib import Path

import matplotlib.dates as mdates
import matplotlib.pyplot as plt
import numpy as np
import yfinance as yf

from build_comp_table import main as run_comp

OUTPUT = Path(__file__).parent / "pnw_banks_summary.png"

BLACK = "#1a1a1a"
GOLD = "#c5a572"
MUTED = "#888888"
BLUE = "#4a6fa5"
GREEN = "#4a7c59"
RED = "#b85c5c"

BENCHMARK = "KRE"           # SPDR S&P Regional Banking ETF
RETURN_START = "2021-04-01"
RETURN_END = "2026-04-01"


def pull_total_return(tickers):
    """Download adjusted-close, return cumulative wealth (start = 1.0)."""
    df = yf.download(tickers, start=RETURN_START, end=RETURN_END,
                     auto_adjust=True, progress=False)["Close"]
    rets = df.pct_change().dropna()
    return (1 + rets).cumprod()


def main():
    rows = run_comp()
    tickers = [r["ticker"] for r in rows]
    cum = pull_total_return(tickers + [BENCHMARK])

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_facecolor("white")

    # ---- Panel A: profitability bars ----
    metrics = ["roa", "roe", "nim_est"]
    labels = ["ROA", "ROE", "Est. NIM"]
    x = np.arange(len(metrics))
    width = 0.26
    colors = [GOLD, BLUE, GREEN]

    for i, r in enumerate(rows):
        vals = [r[k] * 100 for k in metrics]
        bars = ax1.bar(x + (i - 1) * width, vals, width,
                       color=colors[i], edgecolor=BLACK, linewidth=0.8,
                       label=r["ticker"])
        for bar, v in zip(bars, vals):
            ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 0.12,
                     f"{v:.2f}", ha="center", va="bottom", fontsize=8.5, color=BLACK)

    ax1.set_xticks(x)
    ax1.set_xticklabels(labels, fontsize=10, color=BLACK)
    ax1.set_ylabel("Percent (%)", fontsize=10, color=BLACK)
    ax1.set_title("Profitability Ratios — Most Recent FY",
                  fontsize=13, fontweight="bold", color=BLACK, pad=12)
    ax1.legend(loc="upper left", frameon=False, fontsize=10)
    ax1.spines["top"].set_visible(False)
    ax1.spines["right"].set_visible(False)
    ax1.grid(True, axis="y", linestyle="--", alpha=0.3)
    ax1.set_ylim(0, max(r["roe"] for r in rows) * 120)

    # ---- Panel B: 5Y total return ----
    bank_styles = [(GOLD, 2.2), (BLUE, 2.2), (GREEN, 2.2)]
    for (color, lw), r in zip(bank_styles, rows):
        t = r["ticker"]
        total_ret = (cum[t].iloc[-1] - 1) * 100
        ax2.plot(cum.index, cum[t], color=color, linewidth=lw,
                 label=f"{t}  ({total_ret:+.1f}%)")

    bench_total = (cum[BENCHMARK].iloc[-1] - 1) * 100
    ax2.plot(cum.index, cum[BENCHMARK], color=MUTED, linewidth=1.6, linestyle="--",
             label=f"{BENCHMARK}  ({bench_total:+.1f}%)")

    ax2.axhline(y=1, color=BLACK, linestyle=":", linewidth=0.6, alpha=0.5)
    ax2.set_title("5-Year Total Return — $1 Initial Investment",
                  fontsize=13, fontweight="bold", color=BLACK, pad=12)
    ax2.set_ylabel("Cumulative Return ($)", fontsize=10, color=BLACK)
    ax2.legend(loc="upper left", frameon=False, fontsize=9)
    ax2.spines["top"].set_visible(False)
    ax2.spines["right"].set_visible(False)
    ax2.grid(True, linestyle="--", alpha=0.3)
    ax2.xaxis.set_major_locator(mdates.YearLocator())
    ax2.xaxis.set_major_formatter(mdates.DateFormatter("%Y"))

    plt.suptitle("Pacific NW Regional Banks — Profitability & 5-Year Total Return",
                 fontsize=15, fontweight="bold", color=BLACK, y=1.02)
    plt.tight_layout()
    plt.savefig(OUTPUT, dpi=150, bbox_inches="tight", facecolor="white")
    print(f"Summary chart written to: {OUTPUT}")


if __name__ == "__main__":
    main()
