const checkAuth = require('../middleware/checkAuth');
const Shrimp = require('../models/shrimp');
const User = require('../models/user');
const jwt = require('jsonwebtoken');

module.exports = (app) => {
    app.get('/shrimps/new', (req, res) => {
        res.render('shrimps-new')
    });

    app.post('/shrimps/new', checkAuth, (req, res) => {
        if (!req.user) {
            return res.status(401).send({ message: 'You must be logged in to create a shrimp.' });
        }
        const shrimp = new Shrimp(req.body);
        shrimp.owner = req.user._id;
        shrimp
            .save()
            .then(shrimp => {
                return User.findById(req.user._id);
            })
            .then(user => {
                user.shrimps.unshift(shrimp);
                user.save();
                res.redirect(`/shrimps/${shrimp._id}`);
            })
            .catch(err => {
                console.log(err);
                res.status(500).send('An error occurred while saving the shrimp.'); // Internal Server Error
            });
    });

    app.get('/shrimps', (req, res) => {
        Shrimp.find()
            .then(shrimps => {
                res.json(shrimps);
            })
            .catch(err => {
                console.log(err);
            });
    });


    app.get('/shrimps/:id', checkAuth, async (req, res) => {
        const shrimp = await Shrimp.findById(req.params.id)
        if (!req.user || req.user._id != shrimp.owner) {
            return res.status(401).send({ message: 'You must be logged in as the owner to view this shrimp.' });
        }
        return res.json({ shrimp });
    });

    app.put('/shrimps/:id', checkAuth, async (req, res) => {
        const shrimp = await Shrimp.findById(req.params.id)
        if (!req.user || req.user._id != shrimp.owner) {
            return res.status(401).send({ message: 'You must be logged in as the owner to edit this shrimp.' });
        }
        shrimp.set(req.body);
        shrimp
            .save()
            .then(shrimp => {
                res.json(shrimp);
            })
    });

    app.delete('/shrimps/:id', checkAuth, async (req, res) => {
        const shrimp = await Shrimp.findById(req.params.id)
        if (!req.user || req.user._id != shrimp.owner) {
            return res.status(401).send({ message: 'You must be logged in as the owner to delete this shrimp.' });
        }
        Shrimp.findByIdAndRemove(req.params.id)
            .then(shrimp => {
                res.redirect('/');
            })
    });
};