import format from "date-fns/format";
import isAfter from "date-fns/isAfter";
import isSameMinute from "date-fns/isSameMinute";

export const DATE_FORMAT_LONG = "MMMM do yyyy, h:mma";

export function makeDateTime(d = new Date()) {
  return format(d, "yyyy-MM-dd HH:mm:ss.SSS z");
}

export function sortTasksByDate(tasks) {
  return tasks
    .concat()
    .sort((a, b) => (isAfter(a.createdAt, b.createdAt) ? -1 : 1))
    .sort((a, b) => {
      if (!a.due && !b.due) {
        return 0;
      } else if (!a.due && b.due) {
        return 1;
      } else if (a.due && !b.due) {
        return -1;
      } else if (isSameMinute(a.due, b.due)) {
        return 0;
      }
      return isAfter(a.due, b.due) ? 1 : -1;
    })
    .sort((a, b) => {
      if (!a.completed && b.completed) {
        return -1;
      } else if (a.completed && b.completed) {
        return isAfter(a.completed, b.completed) ? -1 : 1;
      }
      return 1;
    });
}
