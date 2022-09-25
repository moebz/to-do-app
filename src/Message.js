import React from 'react';

export default function Message({
  text,
  type,
  clearMessage,
}) {

  const mType = (type ? type : "primary");

  const className = `toast toast-${mType}`;

  if (!text || text === "") {
    return null;
  }

  return (    
    <div className={className}>
      <button
        className="btn btn-clear float-right"
        onClick={clearMessage}
      ></button>
      {text}
    </div>
  );
};