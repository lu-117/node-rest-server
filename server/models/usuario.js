const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');



let Schema = mongoose.Schema;

let rolesValidos = {
    values: ['AMIN_ROLE', 'USER_ROLE'],
    message: '{ VALUE } no es un rol valido'
}
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        require: [true, 'El nombre es necesario']
    },
    email: {
        type: String,
        unique: true,
        require: [true, 'El correo es necesario']
    },
    password: {
        type: String,
        require: [true, 'El password es necesario']
    },
    img: {
        type: String,
        require: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

//no mande password en la respuesta

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userOject = user.toObject();
    delete userOject.password;
    return userOject;
}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });
module.exports = mongoose.model('Usuario', usuarioSchema);