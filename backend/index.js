const express = require('express');
const cors = require('cors');
const permissionSetRoutes = require('./routes/permissionSets');
const obejectRoutes = require('./routes/objects')

const app = express();
app.use(cors());
app.use(express.json());

// GET
app.use('/api/permissionSets', permissionSetRoutes);
app.use('/api/permissionSets/:name', permissionSetRoutes);
app.use('/api/objects', obejectRoutes);
app.use('/api/objects/:name', obejectRoutes);

// POST
app.use('/api/permissionSets', permissionSetRoutes);
app.use('/api/permissionSets/addFieldPermission', permissionSetRoutes);

app.listen(3001, () => {
  console.log('Backend server running at http://localhost:3001');
});
