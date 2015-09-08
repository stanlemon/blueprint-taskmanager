import React from 'react/addons';

import { Link } from 'react-router';
import TaskService from './TaskService';

export default React.createClass({

    mixins: [React.addons.LinkedStateMixin],

    getInitialState() {
        return {
            name: ''
        }
    },

    componentDidMount() {
        //
    },

    handleSave() {
        let taskService = new TaskService();

        taskService.createTask(this.state, () => console.log('hello') );
        console.log(this.state);
    },

    render() {
        return (
            <div className="form-inline">
                <div className="form-group">
                    <label for="task-name">Task</label>
                    <input type="test" className="form-control" id="task-name" valueLink={this.linkState('name')} />
                    <button className="btn btn-primary" onClick={this.handleSave}>Save</button>
                </div>
            </div>
        )
    }
})
