const jwt = require("jsonwebtoken");
const models = require("./model");


const auth = async(req, res, next) => {
    try {
        const token = req.cookies.jwt;
        const verifyuser = jwt.verify(token, process.env.secret_key); ///this is check toke is valid or not
        console.log(verifyuser);

        const user = await models.findOne({ _id: verifyuser._id }); //check id from database
        console.log(user);

        req.token = token; ///if got some datat then return
        req.user = user; ///if got some datat then return
        next(); ///it call to next performance  if not use next then you code is break here
    } catch (e) {
        res.status(401).json("jsonwebtokem fails", e);

    }
}

module.exports = auth;