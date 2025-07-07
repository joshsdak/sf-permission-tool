const express = require('express');
const cors = require('cors');
const permissionSetRoutes = require('./routes/permissionSets');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/permissionSets', permissionSetRoutes);

app.get('/api/health', (req, res) => {
  res.send('Backend is running 🚀');
});

app.listen(3001, () => {
  console.log('Backend server running at http://localhost:3001');
});
