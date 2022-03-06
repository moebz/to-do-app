import React from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const TasksRows = ({ tasks, onEdit, onDelete, loadingIndicators }) => {
  console.log("TaskRows.render");

  return tasks.map((value, index, array) => {
    return (
      <tr key={value._id}>
        <td>{value.content}</td>
        <td>{value.createdAt}</td>
        <td>{value.updatedAt}</td>
        <td>
          <button
            className="btn"
            onClick={() => onEdit(value._id)}
            style={{ minWidth: "70px" }}
            disabled={loadingIndicators?.[value._id]?.edit ? true : false}
          >
            {loadingIndicators?.[value._id]?.edit ? (
              <div className="loading" />
            ) : (
              "Edit"
            )}
          </button>
          <button
            className="btn"
            onClick={() => onDelete(value._id)}
            style={{ minWidth: "70px" }}
            disabled={loadingIndicators?.[value._id]?.delete ? true : false}
          >
            {loadingIndicators?.[value._id]?.delete ? (
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
