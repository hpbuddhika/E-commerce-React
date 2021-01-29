const express = require('express');
const app = express();
require('dotenv').config();

app.get('/',(req,res)=>{
    res.send("hellow from node");
});

const port = process.env.PORT || 8000

app.listen(port,()=>{
    console.log(`server is runing on ${port}`);
})

