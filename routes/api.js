'use strict';
const Issue = require('../models/issue.js');
const Project = require('../models/issue.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
    
    .get(function (req, res){
      let project = req.params.project;
      // get req returns array with all issues for the specific project
      // Project Schema
      // new Issues get saved in a project schema
      
    })
    
    // POST req submits form data and saves it as an Issue
    .post(async (req, res) => {
      let project = req.params.project;
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
        newIssue.save()
          .catch((err) => {
          console.log("Error saving new Issue", err);
        });

        // this code gives me a ValidationError. Issue with Project.findOne?
        // check if project is new or not: if new project, make new Project with newIssue
        //  if existing project, push newIssue to issues

        // let existingProject = await Project.findOne({ project_Name: project });
        // if (!existingProject) {
        //   let newProject = new Project({
        //     project_name: project,
        //     issues: [newIssue]
        //   });
        //   newProject.save()
        //     .catch((err) => {
        //       console.log("Error saving new Project", err);
        //     });
        // } else {
        //   console.log("Rest of code works")
        // };

        

        // for testing: to remove once done
        console.log({
          _id: newIssue._id,
          issue_title: newIssue.issue_title,
          issue_text: newIssue.issue_text,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
          created_by: newIssue.created_by,
          assigned_to: newIssue.assigned_to,
          open: newIssue.open,
          status_text: newIssue.status_text
        })

        return res.json({
          _id: newIssue._id,
          issue_title: newIssue.issue_title,
          issue_text: newIssue.issue_text,
          created_on: newIssue.created_on,
          updated_on: newIssue.updated_on,
          created_by: newIssue.created_by,
          assigned_to: newIssue.assigned_to,
          open: newIssue.open,
          status_text: newIssue.status_text
        });

      }

    })
    
    .put(function (req, res){
      let project = req.params.project;
      
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      
    });
    
};
