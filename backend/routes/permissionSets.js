const express = require('express');
const router = express.Router();
const { loadPermissionSets } = require('../parser/readPermissions');

router.get('/', (req, res) => {
    const data = loadPermissionSets();
    res.json(data);
})

module.exports = router;