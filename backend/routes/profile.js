const express = require('express')
const router = express.Router();
const { writeProfiles } = require('../parser/writeProfiles');

router.post('/', (req, res) => {
    const { field, object } = req.body;

    try {
        const success = writeProfiles(field, object);
        if (success) {
            res.json({ message: 'Field permission updated successfully.'});
        } else {
            res.status(404).json({ error: 'Field not found in permission set.' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;

