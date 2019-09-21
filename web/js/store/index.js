import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import reducer from "../reducers/";
import UserService from "../lib/UserService";
import TaskService from "../lib/TaskService";
import TagService from "../lib/TagsService";

const services = {
  userService: new UserService(),
  taskService: new TaskService(),
  tagService: new TagService(),
};

const store = createStore(
  reducer,
  applyMiddleware(thunk.withExtraArgument(services))
);

export default store;
