// Puerto
const PORT = process.env.PORT || 3000

let MONGOURI

if (process.env.NODE_ENV === 'production') {
    MONGOURI = process.env.MONGO_URI; 
} else {
    MONGOURI = 'mongodb://localhost:27017/cafe'
}


module.exports = {
    PORT,
    MONGOURI 
}

