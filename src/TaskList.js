import React, {useState, useEffect} from 'react';

import TasksRows from "./TasksRows";

const API_URL = 'http://localhost:4000';

const TaskList = () => {

  console.log('TaskList.render');

  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [taskInEdit, setTaskInEdit] = useState(null);

  useEffect(() => {
    console.log('onMount');
    getTasks();
  }, []);    

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const getTasks = async () => {
    try {
      const response = await fetch(`${API_URL}/api/tasks`);
      const data = await response.json();      
      console.log("getTasks.data", data);  
      setTasks(data.tasks);
    } catch (error) {
      console.log("getTasks.catch.error", error)
    }
  };

  const saveEdition = async () => {
    try {

      console.log("saveEdition");
      const id = taskInEdit.id;

      await fetch(`${API_URL}/api/task/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      setEditing(false);
      setContent("");
      setTaskInEdit(null);
      getTasks();

    } catch (error) {
      console.log("saveEdition.catch.error", error);
    }
  };

  const saveTask = async () => {
    try {
      console.log("saveTask");
      await fetch(`${API_URL}/api/task`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
        }),
      });

      setContent("");
      getTasks();
      
    } catch (error) {
      console.log("saveTask.catch.error", error);
    }    
  };

  const deleteTask = async (id) => {
    try {
      console.log("deleteTask.id", id);

      await fetch(`${API_URL}/api/task/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      getTasks();
    } catch (error) {
      console.log("saveTask.catch.error", error);
    }    
  };

  const startEdit = async (id) => {
    try {
      console.log("startEdit.id", id);

      const response = await fetch(`${API_URL}/api/task/${id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
  
      const decodedResponse = await response.json();
  
      console.log("startEdit.setState.decodedResponse", decodedResponse);
  
      setEditing(true);
      setTaskInEdit({ id: id });
  
      setContent(decodedResponse.task.content);
    } catch (error) {
      console.log("startEdit.catch.error", error);
    }    
  };

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
              value={content}
              onChange={handleChange}
            />
            <button
              className="btn"
              onClick={editing ? saveEdition : saveTask}
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
              <TasksRows
                tasks={tasks}
                onDelete={deleteTask}
                onEdit={startEdit}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;