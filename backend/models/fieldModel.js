const mongoose = require('mongoose');

const fieldSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  iconUrl: { type: String },
});

module.exports = mongoose.model('Field', fieldSchema);


