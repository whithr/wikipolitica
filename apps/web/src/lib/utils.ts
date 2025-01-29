import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Removes all text within square brackets, including the brackets themselves.
 * @param text - The input string from which to remove bracketed content.
 * @returns The cleaned string without any bracketed content.
 */
export function removeBrackets(text: string): string {
  return text.replace(/\[.*?\]/g, "").trim();
}
