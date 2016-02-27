/* @flow weak */
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {

    handleSave(data) {
        this.props.actions.updateTask(data);
        this.props.history.pushState(null, '/');
    }
}
