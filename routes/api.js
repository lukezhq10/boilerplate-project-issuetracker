'use strict';
const express = require('express');
const issueController = require('../controllers/issueController');
const router = express.Router();

// GET req returns array with all issues for the specific project
router.get('/issues/:project', issueController.get_issue)
// POST req submits form data and saves it as an Issue
router.post('/issues/:project', issueController.add_issue)

// PUT req updates an issue based on optional fields given
router.put('/issues/:project', issueController.update_issue)

// DEL request deletes an issue by _id given
router.delete('/issues/:project', issueController.delete_issue);

module.exports = router;