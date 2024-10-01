import express from 'express'
import {createClient} from 'redis'

const app = express()
app.use(express.json())

const client = createClient()
client.connect()

app.post("/submit",(req,res)=>{
    const
})