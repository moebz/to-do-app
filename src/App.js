import React from "react";

import TaskList from "./TaskList";

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TaskList/>
    );
  }
}

export default App;
