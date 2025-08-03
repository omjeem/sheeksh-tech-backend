import express, { Request, Response } from 'express';
import cors from 'cors';
import { envConfigs } from './config/envConfig';
import { connectToDatabase } from './config/db';

const app = express();
app.use(express.json());
app.use(cors());

app.get("/", (req:Request, res: Response)=>{
    return res.json({
        message : "Hello world"
    })
})


app.listen(envConfigs.port, ()=>{
    console.log(`Server is running on http://localhost:${envConfigs.port}`)
    connectToDatabase()
})