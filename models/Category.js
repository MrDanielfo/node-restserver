const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const CategorySchema = new Schema({
  descripcion: {
    type: String,
    unique: true,
    required: [true, 'La descripción es obligatoria']
  },
  usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});


const Category = mongoose.model('Category', CategorySchema);

module.exports = Category; 