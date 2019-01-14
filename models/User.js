const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const validator = require('mongoose-unique-validator')

let roles = {
    values: ['USER_ROLE', 'ADMIN_ROLE'],
    message: '{VALUE} no es admitido'
}

const UserSchema = new Schema({
  nombre: {
    type: String,
    required: [true, 'El nombre es necesario']
  },
  email: {
    type: String,
    unique: true,
    required: [true, 'El correo es necesario']
  },
  password: {
    type: String,
    required: [true, 'La contraseña es necesaria']
  },
  img: {
    type: String,
    required: false
  },
  role : {
    type: String,
    default: 'USER_ROLE',
    enum: roles
  },
  estado : {
    type: Boolean,
    default: true
  },
  google : {
    type: Boolean,
    default: false
  }

});

UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password; 

    return userObject; 
}

UserSchema.plugin(validator, {
    message: '{PATH} ya ha sido registrado'
})


const User = mongoose.model('User', UserSchema);

module.exports = User 