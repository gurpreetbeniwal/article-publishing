const mongoose = require('mongoose');

const mongoURI = 'mongodb+srv://gurpreetbeniwal31386:Gudu999@data.jgsnzrh.mongodb.net/'; // Change 'mydatabase' to your database name

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB successfully'))
.catch(err => console.error('Error connecting to MongoDB:', err));