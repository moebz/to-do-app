import React from "react";

import moment from 'moment';

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

moment.locale('es');

const TasksRows = ({
  tasks,
  onEdit,
  onDelete,
  deleteLoadingIndicators,
  editLoadingIndicators,
}) => {
  console.log("TaskRows.render");

  return tasks.map((value, index, array) => {
    return (
      <tr key={value._id}>
        <td>{value.content}</td>
        <td>{moment.utc(
          value.createdAt
        ).format('llll')}</td>
        <td>{moment.utc(
          value.updatedAt
        ).format('llll')}</td>
        <td>
          <button
            className="btn"
            onClick={() => onEdit(value._id)}
            style={{ minWidth: "70px" }}
            disabled={editLoadingIndicators?.[value._id] || deleteLoadingIndicators?.[value._id]}
          >
            {editLoadingIndicators?.[value._id] ? (
              <div className="loading" />
            ) : (
              "Edit"
            )}
          </button>
          <button
            className="btn"
            onClick={() => onDelete(value._id)}
            style={{ minWidth: "70px" }}
            disabled={deleteLoadingIndicators?.[value._id]}
          >
            {deleteLoadingIndicators?.[value._id] ? (
              <div className="loading" />
            ) : (
              "Delete"
            )}
          </button>
        </td>
      </tr>
    );
  });
};

export default React.memo(TasksRows);
