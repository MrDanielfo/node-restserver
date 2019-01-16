// Puerto
const PORT = process.env.PORT || 3000

// Vencimiento del Token
// 60 * 60 * 24 * 30
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30
const CADUCIDAD = process.env.CADUCIDAD_TOKEN
process.env.SEED =  process.env.SEED || "seed-desarrollo-server"
const SEED = process.env.SEED

// Seed o secret del Token

let MONGOURI

if (process.env.NODE_ENV === 'production') {
    MONGOURI = process.env.MONGO_URI; 
} else {
    MONGOURI = 'mongodb://localhost:27017/cafe'
}

// Google Client

process.env.CLIENT_ID = process.env.CLIENT_ID || '773056045243-ae2d8734cnahe9detpb8g4vjihe8ktdb.apps.googleusercontent.com';

const CLIENT = process.env.CLIENT_ID


module.exports = {
    PORT,
    MONGOURI,
    CADUCIDAD,
    SEED,
    CLIENT
}

