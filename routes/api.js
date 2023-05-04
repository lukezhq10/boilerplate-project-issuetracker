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
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
