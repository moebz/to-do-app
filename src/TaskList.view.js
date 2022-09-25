import React from 'react';

import Message from "./Message";
import TaskEditor from "./TaskEditor";
import TaskTable from "./TaskTable";

export default function TaskListView({
  getTasksAndSetState,
  generalMessage,
  clearMessage,
  content,
  handleChange,
  handleSave,
  isEditorLoading,
  isSavingLoading,
  tasks,
  handleDeleteTask,
  handleStartEdit,
  isListLoading,
  deleteLoadingIndicators,
  editLoadingIndicators,
}) {
  return (
    <>
      <div className="container grid-lg">
        <div className="columns">
          <div className="column">
            <header className="navbar">
              <section className="navbar-section" style={{ height: 50 }}>
                <h1 className="navbar-brand">Notes app</h1>
                {/* <a href="..." className="btn btn-link">Docs</a>
                <a href="..." className="btn btn-link">GitHub</a> */}
              </section>
              {/* <section className="navbar-section">
                <div className="input-group input-inline">
                  <input className="form-input" type="text" placeholder="search" />
                  <button className="btn btn-primary input-group-btn">Search</button>
                </div>
              </section> */}
              <section className="navbar-section">
                <button className="btn" onClick={getTasksAndSetState}>Reload</button>    
              </section>
            </header>
          </div>
        </div>
      </div>
      <div className="container grid-lg">
        <div className="columns">
          <div className="column">          
            <div className="form-group">
              <Message
                type={generalMessage?.type}
                text={generalMessage?.text}
                clearMessage={clearMessage}
              />
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
          <div className="column">
            <TaskTable
              tasks={tasks}
              handleDeleteTask={handleDeleteTask}
              handleStartEdit={handleStartEdit}
              isListLoading={isListLoading}
              deleteLoadingIndicators={deleteLoadingIndicators}
              editLoadingIndicators={editLoadingIndicators}
            />
          </div>
        </div>
      </div>
    </>
  );
};