/* ---------------------------------------------------------
   Currency Formatting Utility
--------------------------------------------------------- */

export function formatMoney(n) {
  const value = Number(n) || 0;
  return "₦" + value.toLocaleString();
}

export default formatMoney;
