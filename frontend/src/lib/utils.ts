import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const compareArrays = (a: any[], b: any[]) => {
  return a.toString() === b.toString();
};
export async function convertImageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();


    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export const assertValue = <T>(
  value: T | undefined,
  errorMessage: string
): T => {
  if (value === undefined) {
    throw new Error(errorMessage);
  }

  return value;
};

// Currency helpers -------------------------------------------------
/**
 * Convert a decimal amount (e.g. 1499.99) to integer cents (e.g. 149999)
 * Uses Math.round to avoid floating point drift.
 */
export const toCents = (amount: number) => Math.round(Number(amount) * 100);

/**
 * Convert cents back to decimal amount.
 */
export const fromCents = (cents: number) => cents / 100;

/**
 * Format a decimal amount as currency using Intl.NumberFormat. Defaults to en-US / USD.
 */
export const formatCurrency = (
  amount: number,
  locale: string = "en-US",
  currency: string = "USD"
) =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number(amount));

