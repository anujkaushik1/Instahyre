const express = require("express");
const dotenv = require("dotenv");
const app = express();

// Loading Env Variables
dotenv.config({ path: "./config/config.env" });

const PORT = process.env.PORT || 3000;


app.get('/', function(req, res){
    res.send("Hello World");
});

app.listen(PORT, function(){
    console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT} `);
})
