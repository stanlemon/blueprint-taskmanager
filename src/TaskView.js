import React from 'react';
import { Link } from 'react-router';

export default class TaskView extends React.Component {

    static defaultProps = {
        url: '/api/tasks/',
        pollInterval: 2000
    };

    constructor(props) {
        super(props);

        this.state = {
            data: []
        };
    }

    loadTask() {
        let id = this.props.params.id;
        let url = this.props.url + '/' + id;

        fetch(url)
          .then(response => response.json())
          .then(data => this.setState({ data: data }))
          .catch(err => console.error(url, err.toString()))
        ;
    }

    componentDidMount() {
        this.loadTask();
        setInterval(this.loadTask.bind(this), this.props.pollInterval);
    }

    render() {
        let task = this.state.data;

        return (
            <div>
                <h2>{task.name}</h2>
                <p>{task.description}</p>
                <p><strong>Created:</strong> {task.createdAt}</p>
                <p><strong>Updated:</strong> {task.updatedAt}</p>

                <Link to="taskList">Go back to list</Link>
            </div>
        );
    }
}
