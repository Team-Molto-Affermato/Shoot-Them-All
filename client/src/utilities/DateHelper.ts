export class DateHelper {

  private static localUTCTime(date: Date): number {
    const MS_PER_MINUTE = 60000;
    return date.getTime() - date.getTimezoneOffset()*MS_PER_MINUTE;
  }

  static dateDifference(date1: Date, date2: Date): Date {
    return new Date(date1.getTime() - this.localUTCTime(date2))
  }


}
