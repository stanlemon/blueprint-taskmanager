import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import shuffle from "lodash/shuffle";
import { makeDateTime, sortTasks } from "./Utils";

describe("Utils", () => {
  it("makeDateTime formats mysql friendly dates", () => {
    // We're dropping the timezones during comparison to avoid system specific peculiarities.
    expect(
      makeDateTime(new Date("June 13, 1985 13:00:00")).substring(0, 19)
    ).toEqual("1985-06-13T13:00:00");

    expect(
      makeDateTime(new Date("November 6, 2009 05:00:00")).substring(0, 19)
    ).toEqual("2009-11-06T05:00:00");

    expect(
      makeDateTime(new Date("December 12, 2011 22:00:00")).substring(0, 19)
    ).toEqual("2011-12-12T22:00:00");

    expect(
      makeDateTime(new Date("June 2, 2014 11:30:00")).substring(0, 19)
    ).toEqual("2014-06-02T11:30:00");
  });

  // The goal of this method is to ensure tasks are sorted properly
  // - Overdue tasks (uncompleted) appear ordered by their due date, with the longest overdue first
  // - Not due yet tasks appear ordered by their creation date, with the most recently created at the top
  // - Completed tasks appear ordered by their completion date, with the most recently completed at the top
  it("sortTasks sorts by created date, then due date and then completed data", () => {
    const tasks = [
      {
        name: "First task, overdue (longest overdue)",
        createdAt: subDays(new Date(), 3),
        due: subDays(new Date(), 3),
        completed: null,
      },
      {
        name: "Second task, overdue",
        createdAt: subDays(new Date(), 3),
        due: subDays(new Date(), 1),
        completed: null,
      },
      {
        name: "Third task, due in the future",
        createdAt: subDays(new Date(), 3),
        due: addDays(new Date(), 1),
        completed: null,
      },
      {
        name: "Fourth task, no due date, oldest first",
        createdAt: subDays(new Date(), 4),
        due: null,
        completed: null,
      },
      {
        name: "Fifth task, no due date",
        createdAt: subDays(new Date(), 7),
        due: null,
        completed: null,
      },
      {
        name: "Sixth task, due in the future, already completed",
        createdAt: subDays(new Date(), 3),
        due: addDays(new Date(), 1),
        completed: subDays(new Date(), 2),
      },
      {
        name: "Seventh task, no due date, already completed",
        createdAt: subDays(new Date(), 2),
        due: null,
        completed: subDays(new Date(), 4),
      },
      {
        name: "Eighth task, no due date, already completed",
        createdAt: subDays(new Date(), 3),
        due: null,
        completed: subDays(new Date(), 7),
      },
      {
        name: "Ninth task, no due date, already completed, oldest",
        createdAt: subDays(new Date(), 3),
        due: null,
        completed: subDays(new Date(), 8),
      },
    ];

    // Copy and shuffle the tasks out of order
    const input = [].concat(shuffle(tasks));

    const actual = sortTasks(input);

    // FYI: This doesn't work consistently on Node 10
    expect(actual).toEqual(tasks);
  });
});
