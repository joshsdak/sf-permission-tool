const express = require('express');
const router = express.Router();
const { loadPermissionSets, loadPermissionSetByName, loadObjects } = require('../parser/readPermissions');
const { writePermissionSet } = require('../parser/writePermissions')

router.get('/', (req, res) => {
    const data = loadPermissionSets();
    res.json(data);
})

router.get('/:name', (req, res) => {
    const { name } = req.params;
    try {
        const data = loadPermissionSetByName(name);
        res.json(data)
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
});

router.post('/', (req, res) => {
    const { name, field, readable, editable } = req.body;
  
    try {
      const success = writePermissionSet(name, field, readable, editable);
      if (success) {
        res.json({ message: 'Field permission updated successfully.' });
      } else {
        res.status(404).json({ error: 'Field not found in permission set.' });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
  

module.exports = router;