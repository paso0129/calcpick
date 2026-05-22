export interface ROIInput {
  initialInvestment: number;
  finalValue: number;
  years: number;
  additionalCosts?: number;
}

export interface ROIYearRow {
  year: number;
  value: number;
  cumulativeReturn: number; // %
}

export interface ROIResult {
  netProfit: number;
  totalReturnPct: number;
  annualizedReturnPct: number;
  yearlyBreakdown: ROIYearRow[];
}

export function calculateROI(input: ROIInput): ROIResult {
  const { initialInvestment, finalValue, years, additionalCosts = 0 } = input;
  const costs = Math.max(0, additionalCosts);

  if (initialInvestment <= 0) {
    return {
      netProfit: 0,
      totalReturnPct: 0,
      annualizedReturnPct: 0,
      yearlyBreakdown: [],
    };
  }

  const netProfit = finalValue - initialInvestment - costs;
  const totalReturnPct = (netProfit / initialInvestment) * 100;

  // Annualized return (CAGR): ((finalValue - costs) / initialInvestment)^(1/years) - 1
  // When years <= 0, fall back to simple total return
  let annualizedReturnPct: number;
  const adjustedFinal = finalValue - costs;
  if (years <= 0) {
    annualizedReturnPct = totalReturnPct;
  } else if (adjustedFinal <= 0) {
    // Total loss edge case — geometric mean undefined; use simple annualized
    annualizedReturnPct = totalReturnPct / years;
  } else {
    annualizedReturnPct = (Math.pow(adjustedFinal / initialInvestment, 1 / years) - 1) * 100;
  }

  // Year-by-year breakdown projected at the CAGR rate
  let yearlyBreakdown: ROIYearRow[] = [];
  if (years > 0) {
    const cagrRate = annualizedReturnPct / 100;
    const projected: ROIYearRow[] = [];
    for (let y = 1; y <= Math.floor(years); y++) {
      const value = initialInvestment * Math.pow(1 + cagrRate, y);
      const cumulativeReturn = ((value - initialInvestment) / initialInvestment) * 100;
      projected.push({ year: y, value, cumulativeReturn });
    }
    // Snap the last year to actual final value to avoid floating-point drift
    if (projected.length > 0) {
      const lastIndex = projected.length - 1;
      yearlyBreakdown = projected.map((row, i) =>
        i === lastIndex
          ? { ...row, value: adjustedFinal, cumulativeReturn: totalReturnPct }
          : row,
      );
    } else {
      yearlyBreakdown = projected;
    }
  }

  return { netProfit, totalReturnPct, annualizedReturnPct, yearlyBreakdown };
}
