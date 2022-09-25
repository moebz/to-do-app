import React from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import SpectreLoader from "./utils/SpectreLoader";


function TaskEditor({ content, onSave, handleChange, isLoading, isSavingLoading }) {
  console.log("TaskEditor.render");
  return (
    <div>
      <label className="form-label" htmlFor="input-example-3">
        Task
      </label>
      {isLoading ? (
        <Skeleton height={"3.8rem"} className="mb-2" />
      ) : (
        <textarea
          className="form-input mb-2"
          id="input-example-3"
          placeholder="Type the task here"
          value={content}
          onChange={handleChange}
          style={{ height: "4rem" }}
        />
      )}
      <button className="btn" onClick={onSave} disabled={isSavingLoading ? true : false} style={{minWidth: '75px'}}>
        {isSavingLoading ? <SpectreLoader/> : 'Save task'}
      </button>
    </div>
  );
}

export default TaskEditor;
