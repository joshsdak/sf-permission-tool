const express = require('express');
const router = express.Router();
const { loadObjects, loadObjectByName } = require('../parser/readPermissions');

router.get('/', (req, res) => {
    const data = loadObjects();
    res.json(data);
});

router.get('/:name', (req, res) => {
    const { name } = req.params;
    try {
        const data = loadObjectByName(name); 
        res.json(data);
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
})

module.exports = router;