import React from 'react/addons';
import TaskActions from './actions/TaskActions';

export default React.createClass({

    getInitialState() {
        return {
            name: ''
        };
    },

    handleSave() {
        TaskActions.createTask(this.state);
        this.setState({ name: '' });
    },

    updateTask(e) {
        this.setState({ name: e.target.value });
    },

    render() {
        return (
            <div className="form-inline">
                <div className="form-group">
                    <label for="task-name">Task</label>
                    <input type="test" className="form-control" id="task-name" value={this.state.name} onChange={this.updateTask} />
                    <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        );
    }
});
