import React from "react";

function TaskEditor({
  content,
  onSave,
  handleChange,
}) {
  console.log('TaskEditor.render');
  return (
    <div>
      <label className="form-label" htmlFor="input-example-3">
        Task
      </label>
      <textarea
        className="form-input mb-2"
        id="input-example-3"
        placeholder="Type the task here"
        rows="3"
        value={content}
        onChange={handleChange}
      />
      <button
        className="btn"
        onClick={onSave}
      >
        Save task
      </button>
    </div>
  );
}

export default TaskEditor;