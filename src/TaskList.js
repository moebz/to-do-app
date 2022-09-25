import React, { useState, useEffect, useRef } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import TaskListView from "./TaskList.view";

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

      // error.message is canceled
      // when request is aborted

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

  const startEditHelper = async (id) => {

    setIsEditorLoading(true);

    console.log("handleStartEdit.editLoadingIndicators.start");
    console.log(editLoadingIndicators);

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

    console.log("handleStartEdit.editLoadingIndicators.end");
    console.log(editLoadingIndicators);

    setEditLoadingIndicators((editLoadingIndicators) => {
      return {
        ...editLoadingIndicators,
        [id]: false,
      };
    });
  };

  const handleStartEdit = React.useCallback(startEditHelper, []);  

  const handleSave = async () => {
    setIsSavingLoading(true);
    if (editing) {
      await handleSaveEdition();
    } else {
      await handleSaveTask();
    }
    setIsSavingLoading(false);
  };

  const clearMessage = () => {
    setGeneralMessage({
      text: "",
      type: "",
    });
  };

  return (<TaskListView
    getTasksAndSetState={getTasksAndSetState}
    tasks={tasks}

    generalMessage={generalMessage}
    clearMessage={clearMessage}

    content={content}
    handleChange={handleChange}

    handleStartEdit={handleStartEdit}
    handleSave={handleSave}
    handleDeleteTask={handleDeleteTask}

    isListLoading={isListLoading}
    isEditorLoading={isEditorLoading}
    isSavingLoading={isSavingLoading}
    
    deleteLoadingIndicators={deleteLoadingIndicators}
    editLoadingIndicators={editLoadingIndicators}
  />);
};

export default TaskList;
