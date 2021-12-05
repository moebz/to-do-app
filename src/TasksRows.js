import React from "react";

const TasksRows = ({
  tasks,
  onEdit,
  onDelete,
}) => {
  console.log("TaskRows.render");
  return tasks.map((value, index, array) => {
    return (
      <tr key={value.id}>
        <td>{value.content}</td>
        <td>{value.created_at}</td>
        <td>{value.updated_at}</td>
        <td>        
          <button className="btn" onClick={() => onEdit(value.id)}>
            Edit
          </button>          
          <button className="btn" onClick={() => onDelete(value.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  });
};

export default React.memo(TasksRows);
