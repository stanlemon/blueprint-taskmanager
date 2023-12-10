import { configureStore } from "@reduxjs/toolkit";
import { user, tags, filter, page, tasks, loaded, errors } from "../reducers/";

import UserService from "../lib/UserService";
import TaskService from "../lib/TaskService";
import TagService from "../lib/TagsService";

const services = {
  userService: new UserService(),
  taskService: new TaskService(),
  tagService: new TagService(),
};

const store = configureStore({
  reducer: {
    user,
    tags,
    filter,
    page,
    tasks,
    loaded,
    errors,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: services,
      },
    }),
});

export default store;
