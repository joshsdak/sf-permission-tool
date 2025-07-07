import { useEffect, useState } from 'react';
import axios from 'axios';
import Split from 'react-split';
import './index.css';

function App() {
  const [names, setNames] = useState(null);
  const [objects, setObjects] = useState(null);

  useEffect(() => {
    axios.get('/api/permissionSets')
      .then(res => setNames(res.data))
  }, []);

  useEffect(() => {
    axios.get('/api/objects')
      .then(res => setObjects(res.data))
  })

  // useEffect(() => {
  //   axios.get('/api/permissionSets/Accounting_Service_Invoice_Tasks')
  //     .then(res => setNames(res.data));
  // }, []);

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Split className="flex split h-full" minSize={200}>
        <div className="flex flex-col h-full">
          <div className="p-4">
            <h1 className="text-xl mb-2">Objects</h1>
            <div className="overflow-y-auto h-64 pr-2">
              {objects ? (
                <ul className="pl-5 text-sm space-y-1">
                  {objects.map((obj, index) => (
                    <li key={index}>{obj}</li>
                  ))}
                </ul>
              ) : (
                <p>Loading</p>
              )}
            </div>
          </div>
          <div className="p-4 flex flex-col h-full">
            <h1 className="text-xl mb-2">Permission Sets</h1>
            <div className="overflow-y-auto h-128 pr-2">
              {names ? (
                <ul className="pl-5 text-sm space-y-1">
                  {names.map((set, index) => (
                    <li key={index}>{set.name}</li>
                  ))}
                </ul>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>
        <div className="h-full">
          <div>
            <h1>View Panel</h1>
          </div>
        </div>
      </Split>
    </div>
  );
}

export default App;
