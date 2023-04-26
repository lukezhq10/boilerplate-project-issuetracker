'use strict';
const Issue = require('../models/issue.js');

module.exports = function (app) {

  app.route('/api/issues/:project')
    
    .get(function (req, res){
      let project = req.params.project;
      
    })
    
    // POST req submits form data and saves it as an Issue
    .post((req, res) => {
      let project = req.params.project;
      let issue_title = req.body.issue_title;
      let issue_text = req.body.issue_text;
      let created_on = new Date();
      let updated_on = new Date();
      let created_by = req.body.created_by;
      
      // if optional fields are blank, replace with ''
      let assigned_to = req.body.assigned_to === undefined ? '' : req.body.assigned_to;
      let status_text = req.body.status_text === undefined ? '' : req.body.status_text;

      if (!issue_title || !issue_text || !created_by){
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
          console.log(err);
        });

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
