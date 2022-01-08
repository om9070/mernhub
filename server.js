require('dotenv').config(); ///use private data
const express = require("express");
require("./mongodb");
const model = require("./model"); //mongodb schema
const cookieParser = require("cookie-parser"); //transfer to another page cookie
const middleware = require("./authorize"); //this is middilware it cheak user valid before 144hr
const app = express();
const port = process.env.PORT || 5000;


///some middileware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())

//frist input credentilas data
app.post("/regvalue", async(req, res) => {
    const { name, user } = req.body;
    if (!name || !user) {
        return res.status(422).json("invalid data");
    }

    try {

        const user_data = new model({ name, user });

        ////generate token this toke will fail after 144 hour
        if (user_data) {

            const tokendata = await user_data.generatetoken();
            console.log("this is token", tokendata);

            res.cookie("jwt", tokendata, {
                ////valid jsonwebtoken 144 hours
                expires: new Date(Date.now() + 518400000),
                httpOnly: true
            });


            await user_data.save();
            res.status(201).json("add data");

        }
    } catch (e) {
        res.send(e);
        console.log("register problem", e);
    }
})

//this put methode use to remaing updated 

//and this middleware cheak validation

app.put("/process", middleware, async(req, res) => {
    try {
        console.log(req.user._id)
        const { hor, sec } = req.body;
        const gt = await model.findOne({ _id: req.user._id });
        if (gt) {
            const putdata = await gt.adddata(hor, sec);
            await gt.save();
            res.status(201).json("put methode is ok")
        }
    } catch (e) {
        console.log("this is notebad", e);
        // res.status(400).json("time out data");
    }
})


//this use return valid data from mongodb
app.get("/boomdata", middleware, async(req, res) => {
    res.send(req.user);
})

//deploy 
if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"))
}

app.listen(port, () => {
    console.log(`port is running ${port}`)
})