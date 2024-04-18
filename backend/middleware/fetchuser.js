const jwt = require('jsonwebtoken');

const JWT_SECRET = 'Harryisagoodb$oy';

const fetchuser = (req, res, next) => {
    // get the user from jwt token and add id to req object
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate with valid token" });
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        req.user = data.user;

        next();
    } catch (error) {
        console.error(error.message);
        res.status(401).send({ error: "Some error occured" });
    }


}

module.exports = fetchuser;