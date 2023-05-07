const chai = require('chai');
const chaiHttp = require('chai-http');
const {
  describe, it, before, after
} = require('mocha');
const app = require('../server');
const Shrimp = require('../models/shrimp');
const User = require('../models/user');

const agent = chai.request.agent(app);
chai.use(chaiHttp);

describe('Shrimp', () => {
  const newShrimp = {
    species: 'neocaridina davidi',
    color: 'red',
    age: 1,
    sex: 'F',
    owner: '5e8e9b9b0b9b7c1b1c1b1c1b'
  };

  const user = {
    username: 'shrimpluvr',
    password: 'shrimpinainteasy'
  };

  after((done) => {
    Shrimp.findOneAndDelete(newShrimp)
      .then(() => {
        agent.close();

        User
          .findOneAndDelete({
            username: user.username
          })
          .then(() => {
            done();
          })
          .catch((err) => {
            done(err);
          });
      });

    before((done) => {
      agent
        .post('/sign-up')
        .set('content-type', 'application/x-www-form-urlencoded')
        .send(user)
        .then(() => {
          done();
        })
        .catch((err) => {
          done(err);
        });
    });

    it('should be able to create a shrimp', (done) => {
      agent
        .post('/shrimp')
        .send(newShrimp)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should be able to get a shrimp', (done) => {
      agent
        .get('/shrimp')
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should be able to update a shrimp', (done) => {
      agent
        .put('/shrimp')
        .send(newShrimp)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });

    it('should be able to delete a shrimp', (done) => {
      agent
        .delete('/shrimp')
        .send(newShrimp)
        .end((err, res) => {
          res.should.have.status(200);
          done();
        });
    });
  });
});
