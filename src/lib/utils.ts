import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatDateTime = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy HH:mm');
};

export const formatDateOnly = (dateString: string) => {
  const date = new Date(dateString);
  return format(date, 'dd MMM yyyy');
};
