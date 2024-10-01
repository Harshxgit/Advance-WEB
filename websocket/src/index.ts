import express from 'express'
import { WebSocket, WebSocketServer } from 'ws'

const app = express()
const httpserver = app.listen(8080 ,()=>{
    console.log("i m listenting")
})

const wss = new WebSocketServer({server:httpserver})
let connection = 0
wss.on('connection',(ws)=>{
    ws.on('error',console.error)
    ws.on('message',(data)=>{
        wss.clients.forEach((client)=>{
            if(client.readyState == WebSocket.OPEN){
                // client.send(data.toString())
                 client.send("hello harshu")

              
            }
        })
    })

})

// websocket sever in express server