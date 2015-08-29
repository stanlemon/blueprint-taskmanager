import React from 'react';
import { Link } from 'react-router';

export default class TaskList extends React.Component {

    static defaultProps = {
        url: '/api/tasks',
        pollInterval: 2000
    };

    constructor(props) {
        super(props);

        this.state = {
            data: []
        }
    }

    loadTasks() {
        fetch(this.props.url)
          .then(response => response.json())
          .then(data => this.setState({ data: data }))
          .catch(err => console.error(this.props.url, err.toString()))
    }

    componentDidMount() {
        this.loadTasks();
        setInterval(this.loadTasks.bind(this), this.props.pollInterval);
    }

    render() {
        let taskNodes = this.state.data.map((task, i) => {
            return (
                <li>
                    <p>
                        <strong>
                            <Link to="taskView" params={{id: task.id}}>{task.name}</Link>
                        </strong>
                    </p>
                    <p>{task.description}</p>
                </li>
            )
        })

        return (
            <div>
                <h2>Tasks</h2>
                <ul>
                    {taskNodes}
                </ul>
            </div>
        );
    }
}
