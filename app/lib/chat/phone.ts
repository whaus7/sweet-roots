export function digitsOnly(value: string): string {
  return value.replace(/\D/g, "");
}

export function last10(value: string): string {
  const digits = digitsOnly(value);
  return digits.length > 10 ? digits.slice(-10) : digits;
}

export function samePhone(a: string, b: string): boolean {
  const left = last10(a);
  const right = last10(b);
  return left.length >= 10 && left === right;
}

export function toE164(value: string): string {
  const digits = digitsOnly(value);
  if (digits.length === 11 && digits.startsWith("1")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  if (value.trim().startsWith("+")) return `+${digits}`;
  return `+${digits}`;
}
