"""
Generates wm_dcf_summary.png — a single visual for embedding on the project card.

Panel A: FCFF projection (bar chart, historical + forecast)
Panel B: Sensitivity heatmap (WACC x terminal growth)

Run after build_model.py.
"""

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import numpy as np
from pathlib import Path

from build_model import (
    HIST_YEARS, HIST, FORECAST_YEARS, FORECAST, MARKET,
    compute_wacc, build_forecast, compute_valuation,
)

OUTPUT = Path(__file__).parent / "wm_dcf_summary.png"

BLACK = "#1a1a1a"
GOLD = "#c5a572"
MUTED = "#888888"
GREEN = "#4a7c59"
RED = "#b85c5c"


def main():
    wacc_calc = compute_wacc()
    forecast = build_forecast()
    val = compute_valuation(forecast, wacc_calc["wacc"])

    fig, (ax1, ax2) = plt.subplots(1, 2, figsize=(14, 6))
    fig.patch.set_facecolor("white")

    # ---- Panel A: FCFF over time ----
    all_years = HIST_YEARS + FORECAST_YEARS
    fcff_values = HIST["fcf"] + [y["fcff"] for y in forecast]
    colors = [MUTED] * len(HIST_YEARS) + [GOLD] * len(FORECAST_YEARS)

    bars = ax1.bar(all_years, fcff_values, color=colors, edgecolor=BLACK, linewidth=0.8)
    for bar, v in zip(bars, fcff_values):
        ax1.text(bar.get_x() + bar.get_width() / 2, bar.get_height() + 50,
                 f"${v:,.0f}", ha="center", va="bottom", fontsize=9, color=BLACK)

    ax1.set_title("Free Cash Flow to Firm ($M)", fontsize=13, fontweight="bold", color=BLACK, pad=12)
    ax1.set_xlabel("")
    ax1.axvline(x=2025.5, color=BLACK, linestyle="--", linewidth=0.8, alpha=0.5)
    ax1.text(2025.5, ax1.get_ylim()[1] * 0.95, "  Forecast", fontsize=9, color=MUTED, style="italic")
    ax1.spines["top"].set_visible(False)
    ax1.spines["right"].set_visible(False)
    ax1.tick_params(colors=BLACK)
    ax1.set_ylim(0, max(fcff_values) * 1.15)

    hist_patch = mpatches.Patch(color=MUTED, label="Historical (10-K)")
    proj_patch = mpatches.Patch(color=GOLD, label="Projected")
    ax1.legend(handles=[hist_patch, proj_patch], loc="upper left", frameon=False, fontsize=9)

    # ---- Panel B: Sensitivity heatmap ----
    wacc_range = [0.060, 0.063, 0.066, 0.068, 0.070, 0.073, 0.076]
    g_range = [0.020, 0.023, 0.025, 0.028, 0.030, 0.033]

    grid = np.zeros((len(wacc_range), len(g_range)))
    for r, w in enumerate(wacc_range):
        for c, g in enumerate(g_range):
            pv_exp = sum(y["fcff"] / ((1 + w) ** (i + 1)) for i, y in enumerate(forecast))
            tv = forecast[-1]["fcff"] * (1 + g) / (w - g) if w > g else 0
            pv_tv = tv / ((1 + w) ** len(forecast))
            ev = pv_exp + pv_tv
            eq = ev - MARKET["total_debt_m"] + MARKET["cash_m"]
            grid[r, c] = eq / MARKET["shares_out_m"]

    im = ax2.imshow(grid, cmap="RdYlGn", aspect="auto", alpha=0.85,
                    vmin=grid.min(), vmax=grid.max())

    ax2.set_xticks(range(len(g_range)))
    ax2.set_xticklabels([f"{g:.1%}" for g in g_range])
    ax2.set_yticks(range(len(wacc_range)))
    ax2.set_yticklabels([f"{w:.2%}" for w in wacc_range])
    ax2.set_xlabel("Terminal Growth Rate", fontsize=10, color=BLACK)
    ax2.set_ylabel("WACC", fontsize=10, color=BLACK)
    ax2.set_title("Implied Share Price Sensitivity", fontsize=13, fontweight="bold", color=BLACK, pad=12)

    for r in range(len(wacc_range)):
        for c in range(len(g_range)):
            ax2.text(c, r, f"${grid[r, c]:.0f}", ha="center", va="center",
                     fontsize=8, color=BLACK, fontweight="bold")

    # Mark current price line via text annotation
    ax2.text(1.02, 1.05,
             f"Market: ${MARKET['share_price']:.2f}\nBase-case DCF: ${val['implied_price']:.2f}",
             transform=ax2.transAxes, fontsize=9, color=BLACK,
             bbox=dict(boxstyle="round,pad=0.5", facecolor="white", edgecolor=BLACK, linewidth=0.6),
             verticalalignment="top")

    plt.suptitle(f"Waste Management, Inc. (WM) — DCF Valuation Summary",
                 fontsize=15, fontweight="bold", color=BLACK, y=1.02)
    plt.tight_layout()
    plt.savefig(OUTPUT, dpi=150, bbox_inches="tight", facecolor="white")
    print(f"Summary chart written to: {OUTPUT}")


if __name__ == "__main__":
    main()
