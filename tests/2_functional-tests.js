const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');
const URL = '/api/issues/functest'


chai.use(chaiHttp);
let _id;

suite('Functional Tests', function() {
    suite('Test POST /api/issues/{project}', () => {
        test('Create issue with every field', done => {
            const postData = {
                issue_title: 'title',
                issue_text: 'text',
                created_by: 'author',
                open: true,
                assigned_to: 'assigned to',
                status_text: 'status'
            };

            chai
                .request(server)
                .post(URL)
                .send(postData)
                .end((err, res) => {
                    assert.equal(res.body.issue_title, postData.issue_title);
                    assert.equal(res.body.issue_text, postData.issue_text);
                    assert.equal(res.body.created_by, postData.created_by);
                    assert.equal(res.body.assigned_to, postData.assigned_to);
                    assert.equal(res.body.status_text, postData.status_text);
                    _id = res.body._id;
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Create issue with only required fields', done => {
            const reqData = {
                issue_title: 'title',
                issue_text: 'text',
                created_by: 'author'
            };

            chai
                .request(server)
                .post(URL)
                .send(reqData)
                .end((err, res) => {
                    assert.equal(res.body.issue_title, reqData.issue_title);
                    assert.equal(res.body.issue_text, reqData.issue_text);
                    assert.equal(res.body.created_by, reqData.created_by);
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                })
        });

        test('Create issue with missing required fields', done => {
            const undefData = {
                issue_title: undefined,
                issue_text: undefined,
                created_by: undefined
            };

            chai
                .request(server)
                .post(URL)
                .send(undefData)
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'required field(s) missing' });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        })
    });

    suite('Test GET /api/issues/{project}', () => {
        test('View issues on a project', done => {
            chai
                .request(server)
                .get(URL)
                .end((err, res) => {
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.property(issue, "issue_title");
                        assert.property(issue, "issue_text");
                        assert.property(issue, "created_on");
                        assert.property(issue, "updated_on");
                        assert.property(issue, "created_by");
                        assert.property(issue, "assigned_to");
                        assert.property(issue, "open");
                        assert.property(issue, "status_text");
                    });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('View issues with one filter', done => {
            chai
                .request(server)
                .get(URL)
                .query({ open: false })
                .end((err, res) => {
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.equal(issue.open, false)
                    });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('View issues with multiple filters', done => {
            chai
                .request(server)
                .get(URL)
                .query({ issue_title: 'test', open: false })
                .end((err, res) => {
                    assert.isArray(res.body);
                    res.body.forEach(issue => {
                        assert.equal(issue.issue_title, 'test');
                        assert.equal(issue.open, false);
                    });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

    });

    suite('Test PUT /api/issues/{project}', () => {
        test('Update one field on an issue', done => {
            chai
                .request(server)
                .put(URL)
                .send({
                    _id: _id,
                    issue_title: 'update'
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { result: 'successfully updated', '_id': _id });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Update multiple fields on an issue', done => {
            chai
                .request(server)
                .put(URL)
                .send({
                    _id: _id,
                    issue_title: 'update',
                    issue_text: 'updated text',
                    open: false
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { result: 'successfully updated', '_id': _id });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Update an issue with missing _id', done => {
            chai
                .request(server)
                .put(URL)
                .send({
                    issue_title: 'update',
                    issue_text: 'updated text',
                    open: false
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'missing _id' });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Update an issue with no fields to update', done => {
            chai
                .request(server)
                .put(URL)
                .send({
                    _id: _id
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'no update field(s) sent', '_id': _id });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Update an issue with an invalid _id', done => {
            chai
                .request(server)
                .put(URL)
                .send({
                    _id: '645c722f6f0d908d6abb815d',
                    issue_text: 'update text'
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'could not update', '_id': '645c722f6f0d908d6abb815d' });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

    });

    suite('Test DELETE /api/issues/{project}', () => {
        test('Delete an issue', done => {
            chai
                .request(server)
                .delete(URL)
                .send({
                    _id: _id
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { result: 'successfully deleted', '_id': _id });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Delete an issue with an invalid _id', done => {
            chai
                .request(server)
                .delete(URL)
                .send({
                    _id: '645c722f6f0d908d6abb815d'
                })
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'could not delete', '_id': '645c722f6f0d908d6abb815d' });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });

        test('Delete an issue with missing _id', done => {
            chai
                .request(server)
                .delete(URL)
                .end((err, res) => {
                    assert.deepEqual(res.body, { error: 'missing _id' });
                    if (err) {
                        done(err);
                    } else {
                        done();
                    }
                });
        });
    });

});
