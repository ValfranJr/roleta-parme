import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const USED_WHATSAPP_NUMBERS_KEY = "usedWhatsappNumbers";

export function getUsedWhatsappNumbers(): string[] {
  if (typeof window === "undefined") {
    return [];
  }
  const storedNumbers = localStorage.getItem(USED_WHATSAPP_NUMBERS_KEY);
  return storedNumbers ? JSON.parse(storedNumbers) : [];
}

export function addUsedWhatsappNumber(whatsappNumber: string) {
  if (typeof window === "undefined") {
    return;
  }
  const numbers = getUsedWhatsappNumbers();
  if (!numbers.includes(whatsappNumber)) {
    numbers.push(whatsappNumber);
    localStorage.setItem(USED_WHATSAPP_NUMBERS_KEY, JSON.stringify(numbers));
  }
}