import { render } from 'react-dom';
import UserService from './lib/UserService';
import TaskService from './lib/TaskService';
import App from './App';

const services = {
    userService: new UserService(),
    taskService: new TaskService(),
};

render(App(services), document.getElementById('root'));
