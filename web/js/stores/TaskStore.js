import Reflux from 'reflux';
import TaskActions from '../actions/TaskActions';
import TaskService from '../lib/TaskService';

export default Reflux.createStore({

    listenables: [TaskActions],

    taskService: new TaskService(),

    tasks: [],

    getInitialState: function() {
        this.loadTasks();
        return this.tasks;
    },

    onCreateTask(task) {
        this.taskService.createTask( task , (task) => {
            this.tasks.push(task);
            this.update();
        });
    },

    onUpdateTask(task) {
        this.taskService.updateTask( task , (t) => {
            this.tasks.forEach( (v, i) => {
                if (t.id == v.id) {
                    this.tasks[i] = t;
                }
            });
            this.update();
        });
    },
    
    onDeleteTask(taskId) {
        this.taskService.deleteTask( taskId , (task) => {
            this.tasks = this.tasks.filter( (task) => task.id != taskId );
            this.update();
        });
    },

    loadTasks() {
        this.taskService.loadTasks( (tasks) => {
            this.tasks = tasks;
            this.update();
        });
    },
    
    update() {
        this.trigger(this.tasks);
    }
});
