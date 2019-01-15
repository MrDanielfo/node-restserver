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


module.exports = {
    PORT,
    MONGOURI,
    CADUCIDAD,
    SEED
}

