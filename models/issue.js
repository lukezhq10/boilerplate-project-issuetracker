const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// set up Issue schema
const issueSchema = new Schema({
    project_name: { type: String, required: true },
    issue_title: { type: String, required: true },
    issue_text: { type: String, required: true },
    created_on: Date,
    updated_on: Date,
    created_by: { type: String, required: true },
    assigned_to: String,
    open: { type: Boolean, default: true },
    status_text: String
});


const Issue = mongoose.model('Issue', issueSchema);

module.exports = Issue;
