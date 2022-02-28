import React from "react";

const TasksRows = ({
  tasks,
  onEdit,
  onDelete,
}) => {
  console.log("TaskRows.render");
  return tasks.map((value, index, array) => {
    return (
      <tr key={value._id}>
        <td>{value.content}</td>
        <td>{value.createdAt}</td>
        <td>{value.updatedAt}</td>
        <td>        
          <button className="btn" onClick={() => onEdit(value._id)}>
            Edit
          </button>          
          <button className="btn" onClick={() => onDelete(value._id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  });
};

export default React.memo(TasksRows);
