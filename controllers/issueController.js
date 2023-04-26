const Issue = require('../models/issue');

// logs an Issue
const add_issue = async (req, res) => {
    let issue_title = req.body.issue_title;
    let issue_text = req.body.issue_text;
    let created_on = new Date();
    let created_by = req.body.created_by;
    let assigned_to = req.body.assigned_to;
    let status_text = req.body.status_text;

    let newIssue = await Issue.create({
        issue_title: issue_title,
        issue_text: issue_text,
        created_on: created_on,
        created_by: created_by,
        assigned_to: assigned_to,
        status_text: status_text
    });
};

module.exports = {
    add_issue
}