export class DateHelper {

  private static normalizeDate(date: Date): Date {
    const MS_PER_MINUTE = 60000;
    return new Date(date.getTime() + date.getTimezoneOffset()*MS_PER_MINUTE);
  }

  static dateDifference(date1: Date, date2: Date): number {
    return date1.getTime() - date2.getTime();
  }

  static hoursFromTime(time: number): number {
    const MS_PER_HOUR = 3600000;
    return Math.trunc(time/MS_PER_HOUR);
  }

  static minutesFromTime(time: number): number {
    const MS_PER_MINUTE = 60000;
    return Math.trunc(time/MS_PER_MINUTE)%60;
  }

  static secondsFromTime(time: number): number {
    const MS_PER_SECONDS = 1000;
    return Math.trunc(time/MS_PER_SECONDS)%60;
  }


}
