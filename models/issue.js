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

// // set up Project schema
// const projectSchema = new Schema({
//     project_name: { type: String, required: true },
//     issues: [issueSchema]
// });


const Issue = mongoose.model('Issue', issueSchema);
// const Project = mongoose.model('Project', projectSchema);

module.exports = { 
    Issue,
}

// issueSchema with project_name
// ez to change POST
// find all issues with project_name, return an array of them?
// PUT req: Issue.findOneAndUpdate - based on _id, create update obj