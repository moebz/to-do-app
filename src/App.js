import React from "react";
import TasksList from "./TaskList";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { tasks: [], content: "", editing: false, taskInEdit: null };
  }

  componentDidMount() {
    this.getTasks();
  }

  handleChange = (event) => {
    this.setState({ content: event.target.value });
  };

  render() {
    return (
      <div className="container grid-lg">
        <div className="columns">
          <div className="column col-xs-12">
            <div className="form-group">
              <label className="form-label" htmlFor="input-example-3">
                Task
              </label>
              <textarea
                className="form-input mb-2"
                id="input-example-3"
                placeholder="Type the task here"
                rows="3"
                value={this.state.content}
                onChange={this.handleChange}
              />
              <button
                className="btn"
                onClick={this.state.editing ? this.saveEdition : this.saveTask}
              >
                Save task
              </button>
            </div>
          </div>
        </div>
        <div className="columns">
          <div className="column col-xs-12">
            <table className="table table-striped table-hover">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Date created</th>
                  <th>Date updated</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <TasksList
                  tasks={this.state.tasks}
                  onDelete={this.deleteTask}
                  onEdit={this.startEdit}
                />
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }

  getTasks = () => {
    fetch("http://localhost:4000/api/tasks")
      .then((response) => response.json())
      .then((data) => {
        console.log("getTasks.data", data);
        this.setState({
          tasks: data.tasks,
        });
      })
      .catch((error) => console.log("getTasks.catch.error", error));
  };

  saveTask = () => {
    console.log("saveTask");
    fetch("http://localhost:4000/api/task", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: this.state.content,
      }),
    }).then(() => {
      this.setState({ content: "" });
      this.getTasks();
    });
  };

  deleteTask = (id) => {
    console.log("deleteTask.id", id);
    fetch(`http://localhost:4000/api/task/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then(() => {
      this.getTasks();
    });
  };

  startEdit = (id) => {
    console.log("startEdit.id", id);
    fetch(`http://localhost:4000/api/task/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        console.log("startEdit.fetch.response", response);
        return response.json();
      })
      .then((decodedResponse) => {
        console.log("startEdit.setState.decodedResponse", decodedResponse);
        this.setState({
          editing: true,
          taskInEdit: { id: id },
          content: decodedResponse.task.content,
        });
      });
  };

  saveEdition = () => {
    console.log("saveEdition");
    let id = this.state.taskInEdit.id;
    fetch(`http://localhost:4000/api/task/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        content: this.state.content,
      }),
    }).then(() => {
      this.setState({ editing: false, content: "", taskInEdit: null });
      this.getTasks();
    });
  };
}

export default App;
