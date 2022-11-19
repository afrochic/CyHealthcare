const express = require("express");
const router = express.Router();
const controller = require("../controllers/covid.js")

router.get('/stats', controller.stats)
router.get('/history', controller.history)
router.get('/table', controller.table)
router.get('/graph', controller.graph)

module.exports = router;