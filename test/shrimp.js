const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before, after } = require('mocha');
const app = require('../server');
const should = chai.should();
chai.use(chaiHttp);
const agent = chai.request.agent(app);
const User = require('../models/user');


describe('Shrimp', function () {
   const newShrimp = {
        species : 'neocaridina davidi',
        color : 'red',
        age : 1,
        sex : 'F',
        owner : '5e8e9b9b0b9b7c1b1c1b1c1b'
   }

    const user = {
        username: 'shrimpluvr',
        password: 'shrimpinainteasy'
    }
    after(function () {
        agent.close();
    });

    it('should be able to create a shrimp', function (done) {
        agent
            .post('/shrimp')
            .send(newShrimp)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it('should be able to get a shrimp', function (done) {
        agent
            .get('/shrimp')
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should be able to update a shrimp', function (done) {
        agent
            .put('/shrimp')
            .send(newShrimp)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

    it ('should be able to delete a shrimp', function (done) {
        agent
            .delete('/shrimp')
            .send(newShrimp)
            .end(function (err, res) {
                res.should.have.status(200);
                done();
            });
    });

});