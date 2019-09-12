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
      v => (isDate(v) ? format(v) : v)
    );
  }

  loadTasks() {
    return this.fetch(`${this.baseUrl}/api/tasks/`).then(data =>
      data.map(task => this.formatTask(task))
    );
  }

  createTask(task) {
    return this.fetch(`${this.baseUrl}/api/tasks/`, "post", task).then(data =>
      this.formatTask(data)
    );
  }

  updateTask(task) {
    return this.fetch(`${this.baseUrl}/api/tasks/${task.id}`, "put", task).then(
      data => this.formatTask(data)
    );
  }

  deleteTask(taskId) {
    return this.fetch(`${this.baseUrl}/api/tasks/${taskId}`, "delete");
  }
}
