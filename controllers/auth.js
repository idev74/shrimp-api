const jwt = require('jsonwebtoken');
const User = require('../models/user');

module.exports = (app) => {
   app.get('/', (req, res) => res.json("hello world"));

   app.get('/sign-up', (req, res) => res.render('sign-up'));

   app.post('/sign-up', async (req, res) => {
      try {
         const user = new User(req.body);
         await user.save();
         const token = jwt.sign({ _id: user._id }, process.env.SECRET, { expiresIn: '60 days' });
         res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
         return res.redirect('/');
      } catch (err) {
         console.log(err.message);
         return res.status(400).send({ err });
      }
   });

   app.get('/logout', (req, res) => {
      res.clearCookie('nToken');
      return res.redirect('/');
   });

   app.get('/login', (req, res) => res.render('login'));

   app.post('/login', async (req, res) => {
      const { username, password } = req.body;
      try {
         const user = await User.findOne({ username }, 'username password');
         if (!user) {
            return res.status(401).send({ message: 'Wrong Username or Password' });
         }
         user.comparePassword(password, (err, isMatch) => {
            if (!isMatch) {
               return res.status(401).send({ message: 'Wrong Username or password' });
            }
            const token = jwt.sign({ _id: user._id, username: user.username }, process.env.SECRET, {
               expiresIn: '60 days',
            });
            res.cookie('nToken', token, { maxAge: 900000, httpOnly: true });
            return res.redirect('/');
         });
      } catch (err) {
         console.log(err);
      }
   });
};