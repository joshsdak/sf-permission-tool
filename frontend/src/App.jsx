import { useEffect, useState } from 'react';
import axios from 'axios';
import Split from 'react-split';
import './index.css';

function App() {
  const [permissionNames, setPermissionNames] = useState(null);
  const [curPermSet, setCurPermSet] = useState(null)
  const [objects, setObjects] = useState(null);
  const [curObject, setCurObject] = useState(null);
  const [matrix, setMatrix] = useState(null);
  const [permissionMatrix, setPermissionMatrix] = useState(false);
  const [objectMatrix, setObjectMatrix] = useState(false);

  useEffect(() => {
    axios.get('/api/permissionSets')
      .then(res => setPermissionNames(res.data))
  }, []);

  useEffect(() => {
    axios.get('/api/objects')
      .then(res => setObjects(res.data))
  }, [])

  const handleObjectClick = (name) => {
    const getObject = name;
    axios.get(`/api/objects/${getObject}`)
      .then(res => {
        setMatrix(res.data)
        setPermissionMatrix(false)
        setObjectMatrix(true)
        setCurObject(name)
      })
      .catch(err => {
        console.error("Failed to fetch Object:", err);
        alert("Failed to fetch Object set. Check console for details.");
      })
  }

  const handlePermissionClick = (name) => {
    const getPermission = name;
    axios.get(`/api/permissionSets/${getPermission}`)
      .then(res => {
        setMatrix(res.data)
        setObjectMatrix(false)
        setPermissionMatrix(true)
        setCurPermSet(name)
      })
      .catch(err => {
        console.error("Failed to fetch permission set:", err);
        alert("Failed to fetch permission set. Check console for details.");
      });
  };

  const handlePermissionReadCheckbox = (idx) => {
    setMatrix(prev => {
      const newFields = [...prev.fields];
      const field = { ...newFields[idx] };
  
      const newRead = !field.readable;
  
      if (field.readable && field.editable && !newRead) {
        field.readable = false;
        field.editable = false;
      } else {
        field.readable = newRead;
      }
  
      newFields[idx] = field;

      axios.post('/api/permissionSets', {
        name: curPermSet,
        field: field.field,
        readable: field.readable,
        editable: field.editable,
      }).catch(err => {
        console.error('Failed to update permission:', err);
      });

      return { ...prev, fields: newFields };
    });
  };
  
  const handlePermissionEditCheckbox = (idx) => {
    setMatrix(prev => {
      const newFields = [...prev.fields];
      const field = { ...newFields[idx] };
  
      const newEdit = !field.editable;
  
      if (!field.readable && !field.editable && newEdit) {
        field.readable = true;
        field.editable = true;
      } else {
        field.editable = newEdit;
      }

      axios.post('/api/permissionSets', {
        name: curPermSet,
        field: field.field,
        readable: field.readable,
        editable: field.editable,
      }).catch(err => {
        console.error('Failed to update permission:', err);
      });
  
      newFields[idx] = field;
      return { ...prev, fields: newFields };
    });
  };

  const handleObjectPermissionReadCheckbox = (fieldIdx, permIdx) => {
    const fieldName = matrix[fieldIdx];
    const permissionSetName = permissionNames[permIdx].name;
    const fieldId = `${curObject}.${fieldName.replace('.field-meta.xml', '')}`;

    setPermissionNames(prev => {
      const newPerms = [...prev];
      const fields = [...newPerms[permIdx].fields];
      const index = fields.findIndex(f => f.field === fieldId);
  
      if (index !== -1) {
        const updatedField = { ...fields[index] };
        const newRead = !updatedField.readable;
  
        if (updatedField.readable && updatedField.editable && !newRead) {
          updatedField.readable = false;
          updatedField.editable = false;
        } else {
          updatedField.readable = newRead;
        }
        
        fields[index] = updatedField;

        axios.post('/api/permissionSets', {
          name: permissionSetName,
          field: fieldId,
          readable: updatedField.readable,
          editable: updatedField.editable,
        }).catch(err => console.error('Failed to update permission:', err));
      }
  
      const updatedPermSet = { ...newPerms[permIdx], fields };
      newPerms[permIdx] = updatedPermSet;
      return [...newPerms];
    });
  };
  
  const handleObjectPermissionEditCheckbox = (fieldIdx, permIdx) => {
    const fieldName = matrix[fieldIdx];
    const permissionSetName = permissionNames[permIdx].name;
    const fieldId = `${curObject}.${fieldName.replace('.field-meta.xml', '')}`;
  
    setPermissionNames(prev => {
      const newPerms = [...prev];
      const fields = [...newPerms[permIdx].fields];
      const index = fields.findIndex(f => f.field === fieldId);
  
      if (index !== -1) {
        const updatedField = { ...fields[index] };
        const newEdit = !updatedField.editable;
  
        if (!updatedField.readable && !updatedField.editable && newEdit) {
          updatedField.readable = true;
          updatedField.editable = true;
        } else {
          updatedField.editable = newEdit;
        }
  
        fields[index] = updatedField;
  
        axios.post('/api/permissionSets', {
          name: permissionSetName,
          field: fieldId,
          readable: updatedField.readable,
          editable: updatedField.editable,
        }).catch(err => console.error('Failed to update permission:', err));
      }
  
      const updatedPermSet = { ...newPerms[permIdx], fields };
      newPerms[permIdx] = updatedPermSet;
      return [...newPerms];
    });
  };

  const handleAddObjectPermission = (fieldIdx, permIdx) => {
    const fieldName = matrix[fieldIdx];
    const permissionSetName = permissionNames[permIdx].name;
    const fieldId = `${curObject}.${fieldName.replace('.field-meta.xml', '')}`;
  
    setPermissionNames(prev => {
      const newPerms = [...prev];
      const fields = [...newPerms[permIdx].fields];
      const index = fields.findIndex(f => f.field === fieldId);
  
      if (index !== -1) {
        return prev;
      }
  
      const newField = {
        field: fieldId,
        readable: false,
        editable: false,
      };
  
      fields.push(newField);
      
      axios.post('/api/permissionSets/addFieldPermission', {
        permission: permissionSetName,
        object: curObject,
        field: fieldName.replace('.field-meta.xml', ''),
      }).catch(err => console.error('Failed to add new field permission:', err));
  
      const updatedPermSet = { ...newPerms[permIdx], fields };
      newPerms[permIdx] = updatedPermSet;
      return [...newPerms];
    });
  };

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Split className="flex split h-full" minSize={200}>
        
        <div id="Sidebar" className="flex flex-col h-full">
          <div id="ObjectSelection" className="p-4">
            <h1 className="text-xl mb-2">Objects</h1>
            <div className="overflow-y-auto h-64 pr-2">
              {objects ? (
                <ul className="pl-5 text-sm space-y-1">
                  {objects.map((obj, index) => (
                    <li key={index}>
                      <button onClick={() => handleObjectClick(obj)} className="hover:underline hover:font-bold">
                        {obj}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading</p>
              )}
            </div>
          </div>
          <div id="PermissionSelection" className="p-4 flex flex-col h-full">
            <h1 className="text-xl mb-2">Permission Sets</h1>
            <div className="overflow-y-auto h-128 pr-2">
              {permissionNames ? (
                <ul className="pl-5 text-sm space-y-1">
                  {permissionNames.map((set, index) => (
                    <li key={index}>
                      <button onClick={() => handlePermissionClick(set.name)} className="hover:underline hover:font-bold">
                        {set.name}  
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Loading...</p>
              )}
            </div>
          </div>
        </div>

        <div id="View" className="h-full overflow-auto">

          {permissionMatrix && (
            <table id="PermissionMatrix" className="table-auto border-collapse overflow-auto">
                <thead>
                  <tr className="odd:bg-gray-100 even:bg-gray-200">
                    <th className="table-header">{ curPermSet }</th>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-gray-200">
                    <th className="table-header">Field</th>
                    <th className="table-header">Read</th>
                    <th className="table-header">Edit</th>
                  </tr>
                </thead>
                <tbody>
                  {matrix?.fields?.map((field, idx) => (
                    <tr className="odd:bg-gray-100 even:bg-gray-200" key={idx}>
                      <td className="table-cell">{field.field}</td>
                      <td className="table-cell">
                        <div className="flex justify-center items-center h-full">
                          <input
                            onChange={(() => handlePermissionReadCheckbox(idx))}
                            id="permissionReadCheckbox"
                            type="checkbox"
                            checked={field.readable}
                          />
                        </div>
                      </td>
                      <td className="table-cell">
                        <div className="flex justify-center items-center h-full">
                          <input
                            onChange={(() => handlePermissionEditCheckbox(idx))}
                            id="permissionEditCheckbox"
                            type="checkbox"
                            checked={field.editable}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
            </table>
          )}
          
          {objectMatrix && (
            <table id="ObjectMatrix" className="table-auto border-collapse overflow-auto">
                <thead>                  
                  <tr>
                    <th className="table-header">{ curObject }</th>
                    <th className="table-header">Permission Sets</th>
                  </tr>
                  <tr className="odd:bg-gray-100 even:bg-gray-200">
                    <th className="table-header">Field</th>
                    {permissionNames.map((set, index) => (
                      <th className="table-header" key={index}>
                        {set.name}  
                    </th>
                    ))}
                  </tr>
                </thead>
                  <tbody>
                    {matrix?.map((field, idx) => (
                      <tr className="odd:bg-gray-100 even:bg-gray-200" key={idx}>
                        <td className="table-cell">{field.replace('.field-meta.xml', '')}</td>
                        {permissionNames.map((perm, pIdx) => {
                          const searchFor = curObject + '.' + field.replace('.field-meta.xml', '');
                          const permField = perm.fields?.find(f => f.field === searchFor);
                          return (
                            <td className="table-cell" key={pIdx}>
                              {permField ? (
                                <div className="flex justify-center items-center h-full">
                                  <input onChange={() => handleObjectPermissionReadCheckbox(idx, pIdx)} id="readCheckbox" type="checkbox" checked={permField.readable} />
                                  <label className="px-2" htmlFor="readCheckbox">Read</label>
                                  <input onChange={() => handleObjectPermissionEditCheckbox(idx, pIdx)} id="editCheckbox" type="checkbox" checked={permField.editable} />
                                  <label className="px-2" htmlFor="editCheckbox">Edit</label>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  className="hover:bg-green-500 px-2 border border-black rounded-full whitespace-nowrap"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAddObjectPermission(idx, pIdx);
                                  }}
                                >
                                  Add Field to Permission Set
                                </button>
                              )}
                            </td>
                          )
                        })}
                      </tr>
                    ))}
                  </tbody>
            </table>
          )}
        </div>

      </Split>
    </div>
  );
}

export default App;
