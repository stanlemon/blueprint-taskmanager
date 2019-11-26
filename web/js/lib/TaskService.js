import mapValues from "lodash/mapValues";
import isDate from "date-fns/isDate";
import format from "date-fns/format";
import RestService from "./RestService";

export default class TaskService extends RestService {
  formatTask(task) {
    // Ensure that if complete or due are not set we make them null
    return mapValues(
      Object.assign({}, task, {
        completed: task.completed ? task.completed : null,
        due: task.due ? task.due : null,
      }),
      // Any date objects should be formatted
      v => (isDate(v) ? format(v, "yyyy-MM-dd'T'HH:mm:ss.SSSxxx") : v)
    );
  }

  loadTasks() {
    // Temporary: This will need to support pagination eventually
    return this.fetch(`${this.baseUrl}/api/tasks/?size=1000`).then(data => {
      data.tasks.map(task => this.formatTask(task));
      return data;
    });
  }

  createTask(task) {
    return this.fetch(
      `${this.baseUrl}/api/tasks/`,
      "post",
      this.formatTask(task)
    );
  }

  updateTask(task) {
    return this.fetch(
      `${this.baseUrl}/api/tasks/${task.id}`,
      "put",
      this.formatTask(task)
    );
  }

  deleteTask(taskId) {
    return this.fetch(`${this.baseUrl}/api/tasks/${taskId}`, "delete");
  }
}
