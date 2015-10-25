import React from 'react';
import { Modal } from 'react-bootstrap';
import TaskForm from './CreateTaskForm';
import TaskItem from './TaskItem';

export default class TaskListView extends React.Component {

    constructor(props, context) {
        super(props, context);

        this.state = {
            showModal: false
        }
    }

    closeModal() {
        this.setState({ showModal: false });
    }

    openModal() {
        this.setState({ showModal: true });
    }

    render() {
        let { actions, history, loaded, tasks } = this.props;

        if (!loaded) {
            return <div/>
        }

        if (tasks.length == 0) {
            return (
                <div>
                    <div className="jumbotron">
                        <h1>You don't have any tasks!</h1>
                        <p>Use the form below to get started and add your first task.</p>
                    </div>
                    <TaskForm actions={actions}/>
                </div>
            )
        }

        return (
            <div>
                <table className="table table-bordered table-hover table-condensed">
                    <thead>
                        <tr>
                            <th className="col-md-10">Title</th>
                            <th className="col-md-2">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                    {tasks.map((task) => {
                        return (
                            <TaskItem click={this.openModal.bind(this)} key={task.id} actions={actions} history={history} task={task}/>
                        )
                    })}
                    </tbody>
                </table>

                <TaskForm actions={actions}/>

                <Modal show={this.state.showModal} onHide={this.closeModal.bind(this)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Delete Task</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        Are you really sure you want to delete this task?
                    </Modal.Body>
                    <Modal.Footer>
                        <button type="button" className="btn btn-danger">Delete</button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}
