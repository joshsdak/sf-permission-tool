const express = require('express');
const cors = require('cors');
const permissionSetRoutes = require('./routes/permissionSets');
const obejectRoutes = require('./routes/objects')

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/permissionSets', permissionSetRoutes);
app.use('/api/permissionSets/:name', permissionSetRoutes);
app.use('/api/objects', obejectRoutes)
app.use('/api/objects/:name', obejectRoutes)

app.listen(3001, () => {
  console.log('Backend server running at http://localhost:3001');
});
