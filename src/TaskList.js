import React, { useState, useEffect, useRef } from "react";

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
  const abortControllerRef = useRef(null);
  const [tasks, setTasks] = useState([]);
  const [content, setContent] = useState("");
  const [editing, setEditing] = useState(false);
  const [taskInEdit, setTaskInEdit] = useState(null);
  const [isEditorLoading, setIsEditorLoading] = useState(false);
  const [isListLoading, setIsListLoading] = useState(true);
  const [deleteLoadingIndicators, setDeleteLoadingIndicators] = useState(null);
  const [editLoadingIndicators, setEditLoadingIndicators] = useState(null);
  const [isSavingLoading, setIsSavingLoading] = useState(false);
  const [generalMessage, setGeneralMessage] = useState({
    text: "",
    type: "",
  });

  useEffect(() => {
    console.log("onMount");
    getTasksAndSetState();
  }, []);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const getTasksAndSetState = async () => {
    try {
      setIsListLoading(true);
      
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }     

      abortControllerRef.current = new AbortController();
      const data = await getTasks(abortControllerRef.current.signal);
      abortControllerRef.current = null;      

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
    } catch (error) {
      console.log("getTasksAndSetState.catch.error");
      console.log(error);

      // error.message es canceled
      // cuando se aborta el request

      if (error.message !== 'canceled') {
        setGeneralMessage({
          type: "error",
          text: "An error occurred while trying to get the tasks.",
        });
      }
    }
  };

  const handleSaveTask = async () => {
    try {
      await saveTask(content);
      await getTasksAndSetState();
    } catch (error) {
      console.log("handleSaveTask.catch.error");
      console.log(error);
      setGeneralMessage({
        type: "error",
        text: "An error occurred while trying to save the task.",
      });
    }
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

  console.log("Container.render");

  return (
    <div className="container grid-lg">
      <div className="columns">
        <div className="column col-xs-12">
        <button onClick={getTasksAndSetState}>Recargar</button>
          <div className="form-group">
            {generalMessage?.text && (
              <div
                className={
                  "toast toast-" +
                  (generalMessage?.type ? generalMessage.type : "primary")
                }
              >
                <button
                  className="btn btn-clear float-right"
                  onClick={() => {
                    setGeneralMessage({
                      text: "",
                      type: "",
                    });
                  }}
                ></button>
                {generalMessage.text}
              </div>
            )}
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
