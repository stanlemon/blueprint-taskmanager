import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers/";
import UserService from "../lib/UserService";
import TaskService from "../lib/TaskService";

const services = {
  userService: new UserService(),
  taskService: new TaskService(),
};

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(services))
);

export default store;
