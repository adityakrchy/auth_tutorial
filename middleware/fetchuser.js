// create a middleware to fetch the user from jwt token
const jwt = require("jsonwebtoken");

const fetchuser = async (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
    try {
        const data = jwt.verify(token, process.env.SECRET);
        // console.log(data);
        req.user = data.id;
        next();
    } catch (error) {
        res.status(401).send({ error: "Please authenticate using a valid token" })
    }
};
module.exports = fetchuser;