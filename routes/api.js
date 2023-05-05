'use strict';
const { Issue, Project } = require('../models/issue.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
    // GET req returns array with all issues for the specific project
    // 1. search for the project
    // 2. return Project.issues
    // 3. filter by query (Ex. ?open=true&assigned_to=Joe)
    .get(async (req, res) => {
      let project_name = req.params.project;
      let query = req.query;

      Project.findOne({ project_name: project_name })
        .then(doc => {
          let filteredIssues = doc.issues.filter(issue => {
            for (let key in query) {
              if (issue[key] === undefined || issue[key] != query[key])
                return false;
            }
            return true;
          });

          return res.send(filteredIssues);
        })
        .catch(err => {
          console.log("Error returning issues array", err)
        })
    })
    
    // POST req submits form data and saves it as an Issue
    .post(async (req, res) => {
      let project_name = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_on = new Date();
      let updated_on = new Date();
      let created_by = req.body.created_by;

      // if optional fields are blank, replace with ''
      let assigned_to = req.body.assigned_to === undefined ? '' : req.body.assigned_to;
      let status_text = req.body.status_text === undefined ? '' : req.body.status_text;

      if (!issue_title || !issue_text || !created_by) {
        // if one of these required fields is null, use empty string to avoid validationerror
        issue_title = issue_title === null ? '' : issue_title;
        issue_text = issue_text === null ? '' : issue_text;
        created_by = created_by === null ? '' : created_by;
        return res.json({
          error: 'required field(s) missing'
        })
      } else {
        let newIssue = new Issue({
          issue_title: issue_title,
          issue_text: issue_text,
          created_on: created_on,
          updated_on: updated_on,
          created_by: created_by,
          assigned_to: assigned_to,
          status_text: status_text
        });
        
        Project.findOne({ project_name: project_name })
          .then(doc => {
            if (!doc) {
              let newProject = new Project({
                project_name: project_name,
                issues: [newIssue] // Initialize the issues array with newIssue
              });
              newProject.save()
                .then(data => {
                  return res.json(newIssue);
                })
                .catch(err => {
                  console.log("Error saving new Project", err)
                })
            } else {
              doc.issues.push(newIssue);
              doc.save()
                .then(data => {
                  return res.json(newIssue);
                })
                .catch(err => {
                  console.log("Error saving new Issue", err);
                })
            }
          })
      }

    })
    
    // PUT req updates existing issue in project given an _id and fields
    // success: fields updated & updated_on date updated & return result json
    // if no _id: return error: no id json
    // if no update fields given: return error: no update fields json
    // if any other error: return error: could not update json
    .put(async (req, res) => {
      let project_name = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      let open = req.body.open === 'false' ? false : true; // form req comes as String but should be saved as Bool
      // checking off the box = closing the issue = false
      // unchecked box means req.body.open is not updated
      
      let update = {
        issue_title,
        issue_text,
        updated_on: new Date(),
        created_by,
        assigned_to,
        status_text,
        open
      };


      if (!_id) {
        return res.json({ error: 'missing _id' })
      }

      Project.findOne({ project_name: project_name })
        .then(doc => {
          if (!doc) {
            // project not found
            console.log({ error: 'Project not found' })
            return res.json({ error: 'could not update', '_id': _id }); // specific error msg test requires
          }

          // find index of issue with matching ID in issues array
          let issueIndex = doc.issues.findIndex(issue => issue._id == _id);

          if (issueIndex === -1) {
            // issue not found
            console.log({ error: 'Issue not found' })
            return res.json({ error: 'could not update', '_id': _id }); // specific error msg test requires
          }

          if (!issue_title && !issue_text && !created_by && !assigned_to && !status_text && (open === doc.issues[issueIndex].open)) {
            return res.json({ error: 'no update field(s) sent', '_id': _id })
          }

          // update issue based on update fields
          // optional fields shouldn't overwrite existing info if empty
          doc.issues[issueIndex].updated_on = update.updated_on;
          doc.issues[issueIndex].open = update.open;
          if (issue_title) {
            doc.issues[issueIndex].issue_title = update.issue_title;
          }
          if (issue_text) {
            doc.issues[issueIndex].issue_text = update.issue_text;
          }
          if (created_by) {
            doc.issues[issueIndex].created_by = update.created_by;
          }
          if (assigned_to) {
            doc.issues[issueIndex].assigned_to = update.assigned_to;
          }
          if (status_text) {
            doc.issues[issueIndex].status_text = update.status_text;
          }

          doc.save()
            .then(() => {
              return res.json({ result: 'successfully updated', '_id': _id });
            })
            .catch(err => {
              console.log("Error: Could not update", err);
              return res.json({ error: 'could not update', '_id': _id });
            })
        })
        .catch(err => {
          console.log("Error: Could not update", err);
          return res.json({ error: 'could not update', '_id': _id });
        })
      // test id: 645549e3e0ec4652cdb93f91
    })
    
    .delete(function (req, res){
      let project_name = req.params.project;
      
    });
    
};
