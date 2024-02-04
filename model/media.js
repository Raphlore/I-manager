const mongoose = require('mongoose')

const mediaSchema = new mongoose.Schema({
  mediaUrl: { type: String, required: true},
  userId: { type: mongoose.Types.ObjectId, required: true }
},
{ collection: 'media' }
)

const model = mongoose.model('mediaSchema', mediaSchema)

module.exports = model