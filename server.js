import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
// dotenv config
dotenv.config();
// app
const app = express()
// database()
// middlewares
app.use(morgan('dev'))

// default routes 
app.get('/', (req, res)=>{
    res.send("api is running...");
 
 })

 //port

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
    
})