'use strict';

require('./lib/test-env.js');


const mongoose = require('mongoose');
const request = require('superagent');
const expect = require('chai').expect;
const Promise = require('bluebird');

const server = require('../server.js');
const userMock = require('./lib/user-mock.js');
const profileMock = require('./lib/profile-mock.js');
const serverControl = require('./lib/server-control.js');
const cleanUpDatabase = require('./lib/clean-up-mock.js');

mongoose.Promise = Promise;

const url = `http://localhost:${process.env.PORT}`;

describe('testing profile routes', function() {
  before(done => serverControl.serverUp(server, done));
  after(done => serverControl.serverDown(server, done));

  describe('testing POST api/profile', () => {
    describe('testing with valid body', () => {
      before(done => userMock.call(this, done));
      after(done => {
        cleanUpDatabase();
        done();
      });
      it('expect to return res status eqaul to 200', done => {
        let exampleProfileData = {
          firstName: 'abba',
          lastName: 'team',
          phone: 4255555555,
          email: 'testy@test.com',
          status: 'owner',
        };
        request.post(`${url}/api/profile`)
        .send(exampleProfileData)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
      .end((err, res) => {
        if (err) return done(err);
        expect(res.status).to.equal(200);
        expect(res.body.firstName).to.equal(exampleProfileData.firstName);
        expect(res.body.lastName).to.equal(exampleProfileData.lastName);
        done();
      });
      });
    });
  });

  describe('testing GET to /api/profile/:id', () => {
    describe('testing with with valid profile_id', function() {
      before(done => profileMock.call(this, done));
      after(() => {
        delete this.tempProfile.userID;
      });

      it('should return a profile', done => {
        request.get(`${url}/api/profile/${this.tempProfile._id}`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          if (err) return done(err);
          expect(res.status).to.equal(200);
          expect(err).to.be.null;
          expect(res.body.firstName).to.equal(this.tempProfile.firstName);
          expect(res.body.lastName).to.equal(this.tempProfile.lastName);
          expect(res.body.userID).to.equal(this.tempUser._id.toString());
          done();
        });
      });
    });

    describe('testing with Invalid profile_id', function() {
      before(done => profileMock.call(this, done));

      after(() => {
        delete this.tempProfile.userID;
      });

      it('should return a 404 error', done => {
        request.get(`${url}/api/profile/3334`)
        .set({
          Authorization: `Bearer ${this.tempToken}`,
        })
        .end((err, res) => {
          expect(res.status).to.equal(404);
          expect(err).to.not.be.null;
          done();
        });
      });
    });

    describe('testing with Invalid token', function() {
      before(done => profileMock.call(this, done));

      after(() => {
        delete this.tempProfile.userID;
      });

      it('should return a 401 error', done => {
        request.get(`${url}/api/profile/${this.tempProfile._id}`)
        .set({})
        .end((err, res) => {
          expect(res.status).to.equal(401);
          expect(err).to.not.be.null;
          done();
        });
      });
    });
  });

  describe('testing DELETE api/profile/:id', () => {
    // describe('testing with valid profile_id', () => {
    //   before(done => profileMock.call(this, done));
    //
    //   it('should DELETE a profile with valid id', done => {
    //     request.delete(`${url}/api/profile/${this.tempProfile._id}`)
    //     .set({
    //       Authorization: `Bearer ${this.tempToken}`,
    //     })
    //     .end((err, res) => {
    //       if (err) return done(err);
    //       expect(res.status).to.equal(204);
    //       expect(err).to.be.null;
    //       done();
    //     });
    //   });
    // });
    //
    // describe('testing with Invalid profile_id', () => {
    // //  before(done => profileMock.call(this, done));
    //
    //   it('expect to return error for deleting profile with invalid id', done => {
    //     request.delete(`${url}/api/profile/${111}`)
    //     .set({
    //       Authorization: `Bearer ${this.tempToken}`,
    //     })
    //     .end((err, res) => {
    //       expect(res.status).to.equal(404);
    //       expect(err).to.not.be.null;
    //       done();
    //     });
    //   });
    // });
  });

});
