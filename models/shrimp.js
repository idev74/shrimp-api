const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('./user');

const ShrimpSchema = new Schema({
    createdAt: { type: Date },
    updatedAt: { type: Date },
    species : { type: String, required: true },
    color : { type: String, required: false },
    age : { type: Number, required: false },
    sex : { type: String, required: false },
    owner: { type: Schema.Types.ObjectId, ref: "User", required: true },
},
    { timestamps: { createdAt: 'created_at' } }
);

const Shrimp = mongoose.model("Shrimp", ShrimpSchema);

module.exports = Shrimp;
