import express from 'express'
const app = express()
import http from 'http'
const server = http.createServer(app)
const port = 3000
import  { Server } from "socket.io"
const io = new Server(server)

app.get('/', (req, res) => {
  res.send('Hello World!')
})
server.listen(port, () => {
    console.log('listening on *:${port}');
});
io.on('connection', (socket) => {
    console.log('a user connected');
});
  
app.use(express.static('lib'))
app.use(express.static('static'))

