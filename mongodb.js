const mongoose = require("mongoose");
mongoose.connect(process.env.mongo).then(() => {
    console.log("connection succesfully");
}).catch((e) => {
    console.log("databased problem", e);
})