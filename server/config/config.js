// Puerto
const PORT = process.env.PORT || 3000

let MONGOURI

if (process.env.NODE_ENV === 'production') {
    MONGOURI = 'mongodb://danielfo:danielfo89@ds257054.mlab.com:57054/cafe-prod'
} else {
    MONGOURI = 'mongodb://localhost:27017/cafe'
}


module.exports = {
    PORT,
    MONGOURI 
}

