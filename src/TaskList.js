import React from "react";

const TaskList = (props) => {
  console.log("TaskList");
  return props.tasks.map((value, index, array) => {
    return (
      <tr key={value.id}>
        <td>{value.content}</td>
        <td>{value.created_at}</td>
        <td>{value.updated_at}</td>
        <td>
          <button className="btn" onClick={() => props.onEdit(value.id)}>
            Edit
          </button>
          <button className="btn" onClick={() => props.onDelete(value.id)}>
            Delete
          </button>
        </td>
      </tr>
    );
  });
};

export default React.memo(TaskList);
