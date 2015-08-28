import React from 'react';

export default class TaskList extends React.Component {

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
            console.log(task);
            return (
                <li>
                    <p><strong>{task.name}</strong></p>
                    <p>{task.description}</p>
                </li>
            )
        })

        return (
            <ul>
                {taskNodes}
            </ul>
        );
    }
}
