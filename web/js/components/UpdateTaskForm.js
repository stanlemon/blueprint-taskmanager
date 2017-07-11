import PropTypes from 'prop-types';
import TaskForm from './TaskForm';

export default class UpdateTaskForm extends TaskForm {
    static propTypes = {
        navigateTo: PropTypes.func.isRequired,
        actions: PropTypes.object.isRequired,
    };

    handleSave(data) {
        this.props.actions.updateTask(data);
        this.props.navigateTo('/');
    }
}
