export class DateUtil {
  static now(): Date {
    return new Date();
  }

  static formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  static toISOString(date: Date): string {
    return date.toISOString();
  }

  static parseDate(dateStr: string): Date {
    const parsed = new Date(dateStr);
    if (isNaN(parsed.getTime())) {
      throw new Error(`Invalid date: ${dateStr}`);
    }
    return parsed;
  }
}
