/* eslint-disable consistent-return */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { Schema } = mongoose;

const UserSchema = new Schema(
  {
    createdAt: { type: Date },
    updatedAt: { type: Date },
    password: { type: String, select: false },
    username: { type: String, required: true },
    shrimps: [{ type: Schema.Types.ObjectId, ref: 'Shrimp' }]
  },
  { timestamps: { createdAt: 'created_at' } }
);

UserSchema.pre('save', function (next) {
  const user = this;
  if (!user.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(user.password, salt, (hash) => {
      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function (password, done) {
  bcrypt.compare(password, this.password, (err, isMatch) => {
    done(err, isMatch);
  });
};

const User = mongoose.model('User', UserSchema);
module.exports = User;
