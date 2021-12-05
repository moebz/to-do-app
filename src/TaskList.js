import React, { useState, useEffect } from "react";

import TaskEditor from "./TaskEditor";
import TasksRows from "./TasksRows";

import {
  getTasks,
  startEdit,
  saveEdition,
  saveTask,
  deleteTask,
} from "./utils/Api.js";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [taskInEdit, setTaskInEdit] = useState(null);

  useEffect(() => {
    console.log("onMount");
    getTasksAndSetState();
  }, []);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const getTasksAndSetState = async () => {
    const data = await getTasks();
    setTasks(data.tasks);
  };

  const handleSaveTask = async () => {
    await saveTask(content);
    setContent("");
    await getTasksAndSetState();
  };

  const handleDeleteTask = React.useCallback(async (id) => {
    await deleteTask(id);
    await getTasksAndSetState();
  }, []);

  const handleSaveEdition = async () => {
    const id = taskInEdit.id;
    await saveEdition(id, content);
    setEditing(false);
    setContent("");
    setTaskInEdit(null);
    getTasksAndSetState();
  };

  const handleStartEdit = React.useCallback(async (id) => {
    const response = await startEdit(id);
    setEditing(true);
    setTaskInEdit({ id: id });
    setContent(response.task.content);
  }, []);

  const onSave = editing ? handleSaveEdition : handleSaveTask;

  console.log("TaskList.render");

  return (
    <div className="container grid-lg">
      <div className="columns">
        <div className="column col-xs-12">
          <div className="form-group">
            <TaskEditor
              content={content}
              handleChange={handleChange}
              onSave={onSave}            
            />
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
                onDelete={handleDeleteTask}
                onEdit={handleStartEdit}
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskList;
