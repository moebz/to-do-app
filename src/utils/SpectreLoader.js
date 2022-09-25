import React from 'react';

export default  function SpectreLoader({large}) {
  return <div className={large ? "loading loading-lg" : "loading"} />;
}