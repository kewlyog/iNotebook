const connectToMongo = require('./db');

connectToMongo();

console.log('connected to Mongo successfully');

const express = require('express');
const app = express();
const port = 5001;

app.use(express.json());

// Available Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));

app.get('/api/v1/login', (req, res) => {
    res.send('Login');
});

app.get('/api/v1/signup', (req, res) => {
    res.send('Sign Up');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
})
