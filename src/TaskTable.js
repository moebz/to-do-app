import React from 'react';

import Skeleton from "react-loading-skeleton";

import TasksRows from "./TasksRows";

export default function TaskTable({
  tasks,
  handleDeleteTask,
  handleStartEdit,
  isListLoading,
  deleteLoadingIndicators,
  editLoadingIndicators,
}) {

  if (isListLoading) {
    return (<Skeleton count={4} height="3rem" />);
  }

  return (
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
  );
}

