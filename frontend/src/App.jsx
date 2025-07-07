// import { useEffect, useState } from 'react';
// import axios from 'axios';
import Split from 'react-split'
import './index.css'

function App() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <Split
          className="flex split h-full"
          minSize={200}
      >
          <div className="h-full">SIDEBAR</div>
          <div className="h-full">VIEW</div>
      </Split>
    </div>
  );
}

export default App;
