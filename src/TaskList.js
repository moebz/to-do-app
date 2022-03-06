import React, { useState, useEffect } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

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
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [loadingIndicators, setLoadingIndicators] = useState(null);

  useEffect(() => {
    console.log("onMount");
    getTasksAndSetState();
  }, []);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const getTasksAndSetState = async () => {
    setIsListLoading(true);
    const data = await getTasks();
    
    let loadingIndicators = {};
    data.tasks && data.tasks.forEach((task) => {
      loadingIndicators[task._id] = {edit: false, delete: false};
    }); 
    setTasks(data.tasks);
    setLoadingIndicators(loadingIndicators);
    setIsListLoading(false);
  };

  const handleSaveTask = async () => {
    await saveTask(content);
    setContent("");
    await getTasksAndSetState();
  };

  const handleDeleteTask = React.useCallback(async (id) => {
    setLoadingIndicators({
      ...loadingIndicators,
      [id]: {
        ...loadingIndicators?.[id],
        delete: true,
      }      
    });
    
    await deleteTask(id);
    
    setLoadingIndicators({
      ...loadingIndicators,
      [id]: {
        ...loadingIndicators?.[id],
        delete: false,
      }      
    });    
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
    setIsEditorLoading(true);
    setLoadingIndicators({
      ...loadingIndicators,
      [id]: {
        ...(loadingIndicators?.[id]?.delete),
        edit: true,
      }
    });
    const response = await startEdit(id);
    setEditing(true);
    setTaskInEdit({ id: id });
    setContent(response.task.content);
    setIsEditorLoading(false);
    setLoadingIndicators({
      ...loadingIndicators,
      [id]: {
        ...(loadingIndicators?.[id]?.delete),
        edit: false,
      }
    });
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
              isLoading={isEditorLoading}
            />
          </div>
        </div>
      </div>
      <div className="columns">
        <div className="column col-xs-12">
          {isListLoading ? (
            <Skeleton count={4} height="3rem" />
          ) : (
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
                  isLoading={isListLoading}
                  loadingIndicators={loadingIndicators}
                />
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskList;
