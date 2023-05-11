'use strict';
const e = require('cors');
const { Issue } = require('../models/issue.js');
const mongoose = require('mongoose');

module.exports = function (app) {


  // Project issue is not getting updated with updated_on and open, only the Issues
  // GET req is not able to filter correctly for updated_on and open
  app.route('/api/issues/:project')
    // GET req returns array with all issues for the specific project
    // 1. search for the project
    // 2. return Project.issues
    // 3. filter by query (Ex. ?open=true&assigned_to=Joe)
    .get(async (req, res) => {
      let project_name = req.params.project;
      let query = req.query;
      console.log(query);

      // not filtering open correctly
      // probably because open is saved as a bool but req.query.open is a string? => resolved by using boolParser
      Issue.find({ project_name: project_name })
        .then(doc => {
          // filter by query
          // check each query key with doc key
          let filteredIssues = doc.filter(issue => {
            for (let key in query) {
              if (issue[key] === undefined || issue[key] !== query[key])
                return false;
            }
            return true;
          });
          return res.json(filteredIssues)
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
          project_name: project_name,
          issue_title: issue_title,
          issue_text: issue_text,
          created_on: created_on,
          updated_on: updated_on,
          created_by: created_by,
          assigned_to: assigned_to,
          status_text: status_text
        });

        newIssue.save()
          .then(data => {
            return res.json(data);
          })
          .catch(err => {
            console.log("Error saving new Issue", err)
          });
      }
    })
    
    // things that didn't work:
    // 2. open is showing as updated but it's not going through
    .put(async (req, res) => {
      let project_name = req.params.project;
      let { _id, issue_title, issue_text, created_by, assigned_to, status_text } = req.body;
      let open = req.body.open ? false : true;
     // form req comes as String but should be saved as Bool
      // checking off the box = closing the issue = false
      
      if (!_id || !mongoose.isValidObjectId(_id)) {
        console.log({ error: 'missing _id' });
        return res.json({ error: 'missing _id' });
      }

      // if (mongoose.isObjectIdOrHexString(_id) === false) {
      //   console.log({ error: 'invalid _id' });
      //   return res.json({ error: 'could not update', '_id': _id })
      // }

      // create the update object
      let update = {};
      Object.keys(req.body).forEach(key => {
        if (req.body[key] != '') {
          update[key] = req.body[key]
        }
      })
      if (Object.keys(update).length < 2) { // check if update fields were sent
        return res.json({ error: 'no update field(s) sent', '_id': _id })
      }
      update['updated_on'] = new Date();

      
      Issue.findByIdAndUpdate(_id, update, { new: true })
        .then(doc =>{
          if (doc) {
            console.log({ result: 'successfully updated', doc});
            return res.json({ result: 'successfully updated', '_id': _id });
          } else {
            console.log({ error: 'could not update', '_id': _id })
            return res.json({ error: 'could not update', '_id': _id });
          }
        })
    })
    
    .delete(function (req, res){
      let project_name = req.params.project;
      
    });
    
};