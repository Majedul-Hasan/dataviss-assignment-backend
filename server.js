import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";

// dotenv config
dotenv.config();
// app
const app = express()
// database connect
connectDB()
// api rought middleware
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    next();
  });
// middleware
app.use(morgan('dev'))
app.use(express.json()); //this allows json to the body
app.use(cors()) // allows all requests from cross-domain


app.use("/users", userRoutes);
// default routes 
app.get('/', (req, res)=>{
    res.send("api is running...");
 
 })

 //port

const PORT = process.env.PORT || 8000

app.listen(PORT, ()=>{
    console.log(`server is running in ${process.env.NODE_ENV} mode port No.  ${PORT} to exit press ctrl + C`);
    
})