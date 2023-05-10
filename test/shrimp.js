const chai = require('chai');
const chaiHttp = require('chai-http');
const {
    describe, it, before, after
} = require('mocha');
const mongoose = require('mongoose');
const app = require('../server');
const Shrimp = require('../models/shrimp');
const User = require('../models/user');

const agent = chai.request.agent(app);
const expect = chai.expect;
const should = chai.should();
chai.use(chaiHttp);
const SAMPLE_OBJECT_ID = mongoose.Types.ObjectId();

describe('Shrimp', function () {
    before(async function () {
        const user = await chai
            .request(app)
            .post('/sign-up')
            .send({
                username: 'shrimpluvr',
                password: 'shrimpinainteasy'
            });

        const shrimp = new Shrimp({
            species: 'species nonexistus',
            color: 'red',
            age: 1,
            sex: 'F',
            owner: user._id,
            _id: 'AAAAAAAAAAAA'
        });
        try {
            const savedShrimp = await shrimp.save();
            this.shrimpId = savedShrimp._id;
        } catch (err) {
            console.log(err);
        }
    });

    after(async function () {
        try {
            await User.deleteMany({
                username: 'shrimpluvr'
            });

            await Shrimp.deleteOne({
                species: 'species nonexistus'
            });
            agent.close();
        } catch (err) {
            console.log(err);
        }
    });

    it('should not log in a user if not registered', function (done) {
        chai
            .request(app)
            .post('/login')
            .send({
                username: 'shrimpluvr',
                password: 'shrimpinainteasy'
            })
            .then(function (res) {
                res.should.have.status(401);
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });

    it('should sign up a user', function (done) {
        agent
            .post('/sign-up')
            .send({
                username: 'shrimpluvr',
                password: 'shrimpinainteasy'
            })
            .then(function (res) {
                res.should.have.status(200);
                agent.should.have.cookie('nToken');
                done();
            })
            .catch(function (err) {
                done(err);
            });
    });

    describe('GET /shrimps', () => {
        it('should return all shrimps', (done) => {
            agent
                .get('/shrimps')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.should.have.status(200);
                    res.body.should.be.an('array');
                    return done();
                });
        });
    });

    describe('POST /shrimps/new', () => {
        it('should create a new shrimp', (done) => {
            chai
                .request(app)
                .post('/shrimps/new')
                .send({
                    species: 'species nonexistus',
                    color: 'red',
                    age: 1,
                    sex: 'F',
                    owner: this.userId,
                    _id: 'AAAAAAAAAAAA'
                })
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.should.be.an('object');
                    return done();
                });
        });
    });

    describe('GET /shrimps/:id', () => {
        it('should return a single shrimp', (done) => {
            chai
                .request(app)
                .get('/shrimps/64572971f913a7683f5f96f9')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.should.be.an('object');
                    return done();
                });
        });
    });

    describe('PUT /shrimps/:id', () => {
        it('should update a shrimp if user is the owner', async () => {
          const testShrimp = new Shrimp({
            species: 'sunkist',
            color: 'orange',
            age: 1,
            sex: 'F',
            owner: '6456ae71d32efcd0bf8fe831',
          });
      
          await testShrimp.save();
      
          const res = await chai.request(app)
            .put(`/shrimps/${testShrimp._id}`)
            .send({
              species: 'tangerine tiger',
            });
            expect(testShrimp).to.have.property('species', 'sunkist');
        });
      });

    describe('DELETE /shrimps/:id', () => {
        it('should delete a shrimp', (done) => {
            chai
                .request(app)
                .delete('/shrimps/64572971f913a7683f5f96f9')
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }
                    res.body.should.be.an('object');
                    return done();
                });
        });
    });
      
});