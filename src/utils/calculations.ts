const HECTOLITER_TO_CASE = 0.09;

export interface LOSData {
  sellOutHl: number;
  sellInHl: number;
  desiredLos: number;
  pendingOrders: number;
  receivedStock: number;
}

export interface LOSResult {
  currentLos: number;
  sellOutCases: number;
  sellInCases: number;
  casesNeeded: number;
  newSellOutHl: number;
  newSellOutCases: number;
  losAfterSelling: number;
  newSellInHl: number;
  newSellInCases: number;
  losAfterReceiving: number;
  adjustedSellOut: number;
  predictedLos: number;
  losStatus: 'critical' | 'optimal' | 'caution' | 'high';
  desiredLos: number;
}

function sanitizeNumber(value: number, fallback: number = 0): number {
  if (!isFinite(value) || isNaN(value)) {
    return fallback;
  }
  return value;
}

function safeDivide(numerator: number, denominator: number, fallback: number = 0): number {
  if (denominator === 0 || !isFinite(denominator) || isNaN(denominator)) {
    return fallback;
  }
  const result = numerator / denominator;
  return sanitizeNumber(result, fallback);
}

export function calculateLOS(data: LOSData): LOSResult {
  try {
    const { sellOutHl, sellInHl, desiredLos, pendingOrders, receivedStock } = data;

    const safeSellOutHl = sanitizeNumber(sellOutHl);
    const safeSellInHl = sanitizeNumber(sellInHl);
    const safeDesiredLos = sanitizeNumber(desiredLos);
    const safePendingOrders = sanitizeNumber(pendingOrders);
    const safeReceivedStock = sanitizeNumber(receivedStock);

    if (safeSellOutHl <= 0 || safeSellInHl <= 0) {
      return getEmptyResult();
    }

    const sellOutCases = safeDivide(safeSellOutHl, HECTOLITER_TO_CASE);
    const sellInCases = safeDivide(safeSellInHl, HECTOLITER_TO_CASE);
    const currentLos = sanitizeNumber(safeDivide(safeSellOutHl, safeSellInHl) * 100);

    let casesNeeded = 0;
    let newSellOutHl = safeSellOutHl;
    let losAfterSelling = currentLos;

    if (safeDesiredLos > 0) {
      const targetSellOutHl = sanitizeNumber((safeSellInHl * safeDesiredLos) / 100);
      const additionalHlNeeded = sanitizeNumber(targetSellOutHl - safeSellOutHl);
      casesNeeded = sanitizeNumber(safeDivide(additionalHlNeeded, HECTOLITER_TO_CASE));
      newSellOutHl = sanitizeNumber(safeSellOutHl + additionalHlNeeded);
      losAfterSelling = sanitizeNumber(safeDivide(newSellOutHl, safeSellInHl) * 100);
    }

    const newSellOutCases = sanitizeNumber(safeDivide(newSellOutHl, HECTOLITER_TO_CASE));

    const newSellInHl = safeReceivedStock > 0
      ? sanitizeNumber((safeReceivedStock * HECTOLITER_TO_CASE) + safeSellInHl)
      : safeSellInHl;
    const newSellInCases = sanitizeNumber(safeDivide(newSellInHl, HECTOLITER_TO_CASE));
    const losAfterReceiving = sanitizeNumber(safeDivide(safeSellOutHl, newSellInHl) * 100);

    const adjustedSellOut = sanitizeNumber(sellOutCases + safePendingOrders);
    const predictedLos = sanitizeNumber(safeDivide(adjustedSellOut, sellInCases) * 100);

    const losStatus = getLosStatus(currentLos);

    return {
      currentLos,
      sellOutCases,
      sellInCases,
      casesNeeded,
      newSellOutHl,
      newSellOutCases,
      losAfterSelling,
      newSellInHl,
      newSellInCases,
      losAfterReceiving,
      adjustedSellOut,
      predictedLos,
      losStatus,
      desiredLos: safeDesiredLos,
    };
  } catch (error) {
    console.error('Calculation error:', error);
    return getEmptyResult();
  }
}

function getLosStatus(los: number): 'critical' | 'optimal' | 'caution' | 'high' {
  const safeLos = sanitizeNumber(los);
  if (safeLos < 93) return 'critical';
  if (safeLos <= 103) return 'optimal';
  if (safeLos <= 105) return 'caution';
  return 'high';
}

function getEmptyResult(): LOSResult {
  return {
    currentLos: 0,
    sellOutCases: 0,
    sellInCases: 0,
    casesNeeded: 0,
    newSellOutHl: 0,
    newSellOutCases: 0,
    losAfterSelling: 0,
    newSellInHl: 0,
    newSellInCases: 0,
    losAfterReceiving: 0,
    adjustedSellOut: 0,
    predictedLos: 0,
    losStatus: 'optimal',
    desiredLos: 0,
  };
}

export function getSuggestion(status: string, currentLos: number, desiredLos: number): string {
  const safeLos = sanitizeNumber(currentLos);
  const safeDesired = sanitizeNumber(desiredLos);

  if (status === 'critical') {
    return `Coverage is critically low at ${safeLos.toFixed(1)}%. You need to accelerate sales velocity or reduce incoming inventory to approach your ${safeDesired.toFixed(0)}% target.`;
  }
  if (status === 'optimal') {
    return `Excellent performance at ${safeLos.toFixed(1)}%! You're within the optimal range. Continue monitoring demand patterns and maintain current supply chain execution.`;
  }
  if (status === 'caution') {
    return `Coverage is elevated at ${safeLos.toFixed(1)}%. Monitor demand closely and consider coordinating with suppliers to adjust future shipment timing.`;
  }
  if (status === 'high') {
    return `Coverage is significantly high at ${safeLos.toFixed(1)}%. Coordinate with suppliers to optimize future orders, or accelerate sales initiatives to rebalance inventory.`;
  }
  return 'Analyze your coverage performance and adjust supply accordingly.';
}

export function getStatusColor(status: string): string {
  switch (status) {
    case 'critical':
      return 'from-red-600 to-red-700';
    case 'optimal':
      return 'from-green-600 to-green-700';
    case 'caution':
      return 'from-orange-600 to-orange-700';
    case 'high':
      return 'from-cyan-600 to-teal-600';
    default:
      return 'from-slate-600 to-slate-700';
  }
}

export function getStatusBgColor(status: string): string {
  switch (status) {
    case 'critical':
      return 'bg-red-50 border-red-200';
    case 'optimal':
      return 'bg-green-50 border-green-200';
    case 'caution':
      return 'bg-orange-50 border-orange-200';
    case 'high':
      return 'bg-cyan-50 border-cyan-200';
    default:
      return 'bg-slate-50 border-slate-200';
  }
}

export function getStatusTextColor(status: string): string {
  switch (status) {
    case 'critical':
      return 'text-red-700';
    case 'optimal':
      return 'text-green-700';
    case 'caution':
      return 'text-orange-700';
    case 'high':
      return 'text-cyan-700';
    default:
      return 'text-slate-700';
  }
}
