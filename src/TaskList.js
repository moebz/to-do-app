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
  const [deleteLoadingIndicators, setDeleteLoadingIndicators] = useState(null);
  const [editLoadingIndicators, setEditLoadingIndicators] = useState(null);
  const [isSavingLoading, setIsSavingLoading] = useState(false);

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

    let deleteLoadingIndicators = {};
    data.tasks &&
      data.tasks.forEach((task) => {
        deleteLoadingIndicators[task._id] = false;
      });

    let editLoadingIndicators = {};
    data.tasks &&
      data.tasks.forEach((task) => {
        editLoadingIndicators[task._id] = false;
      });

    setTasks(data.tasks);
    setDeleteLoadingIndicators(deleteLoadingIndicators);
    setEditLoadingIndicators(editLoadingIndicators);
    setIsListLoading(false);
  };

  const handleSaveTask = async () => {
    await saveTask(content);
    setContent("");
    await getTasksAndSetState();
  };

  const handleDeleteTask = React.useCallback(async (id) => {
    console.log({
      "handleDeleteTask.deleteLoadingIndicators.start": deleteLoadingIndicators,
    });
    setDeleteLoadingIndicators((deleteLoadingIndicators) => {
      return {
        ...deleteLoadingIndicators,
        [id]: true,
      };
    });

    await deleteTask(id);

    console.log({
      "handleDeleteTask.deleteLoadingIndicators.start": deleteLoadingIndicators,
    });
    setDeleteLoadingIndicators((deleteLoadingIndicators) => {
      return {
        ...deleteLoadingIndicators,
        [id]: true,
      };
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
    console.log({
      "handleStartEdit.editLoadingIndicators.start": editLoadingIndicators,
    });
    setEditLoadingIndicators((editLoadingIndicators) => {
      return {
        ...editLoadingIndicators,
        [id]: true,
      };
    });
    const response = await startEdit(id);
    setEditing(true);
    setTaskInEdit({ id: id });
    setContent(response.task.content);
    setIsEditorLoading(false);
    console.log({
      "handleStartEdit.editLoadingIndicators.end": editLoadingIndicators,
    });
    setEditLoadingIndicators((editLoadingIndicators) => {
      return {
        ...editLoadingIndicators,
        [id]: false,
      };
    });
  }, []);

  const handleSave = async () => {
    setIsSavingLoading(true);
    if (editing) {
      await handleSaveEdition();
    } else {
      await handleSaveTask();
    }
    setIsSavingLoading(false);
  };

  console.log("TaskList.render");

  return (
    <div className="container grid-lg">
      <div className="columns">
        <div className="column col-xs-12">
          <div className="form-group">
            <TaskEditor
              content={content}
              handleChange={handleChange}
              onSave={handleSave}
              isLoading={isEditorLoading}
              isSavingLoading={isSavingLoading}
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
                  deleteLoadingIndicators={deleteLoadingIndicators}
                  editLoadingIndicators={editLoadingIndicators}
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
