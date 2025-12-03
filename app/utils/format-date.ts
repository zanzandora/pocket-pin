import { CalendarDate } from '@internationalized/date'

export default (dateString: string | undefined): CalendarDate | undefined => {
  if (!dateString) return undefined

  try {
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) {
      return undefined
    }
    return new CalendarDate(
      date.getFullYear(),
      date.getMonth() + 1,
      date.getDate(),
    )
  } catch {
    return undefined
  }
}
