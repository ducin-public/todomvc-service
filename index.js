const app = require('express')()
const cors = require('cors')

const server = require('http').createServer(app)
const io = require('socket.io')(server)

const { randomId, randomGuid, getDelay, stringify } = require('./utils')

const argv = require('yargs')
  .alias('v', 'verbose')
  .option('port', {
    default: 3000,
    alias: 'p'
  }).option('delay', {
    default: 2000,
    alias: 'd'
  }).argv;

const todomvcSvc = require('./todomvc-svc').getStore()
const initialTodos = require('./default.json')
todomvcSvc.init(initialTodos)

const clients = []

app.use(cors())

app.get('/todos', function (req, res) {
  // res.sendFile(__dirname + '/index.html');
  res.json(todomvcSvc.getAllItems())
});

const delay = getDelay(argv.delay)

console.info(`TodoMVC service listening on port ${argv.port}`)
console.info(`with delay: ${argv.delay}ms`)
console.info()

io.on('connection', (socket) => {
  const logClients = () => console.info(`CONNECTION > Total number of clients: ${clients.length}`)

  // const subscribe = () => {
    let id = randomGuid()
    const client = { id, socket }
    clients.push(client)
    console.info(`CONNECTION > Client id:${id} connected`)
    logClients()
  // }
  // subscribe()

  const unsubscribe = (id) => {
    let idx = clients.findIndex(c => c.id === id)
    clients.splice(idx, 1)
    console.info(`CONNECTION > Client id:${id} disconnected`)
    logClients()
  }

  socket.on('cmd', (cmd, ackFn) => {
    const requestID = randomId();
    console.info(`Request with local ID:${requestID}, received: ${stringify(cmd)}`)
    let item
    try {
      switch(cmd.type){

        case "DELETE":
          item = todomvcSvc.deleteItem(cmd.payload.id)
          delay(() => {
            if (ackFn) {
              ackFn(item)
              console.info(`Responding to sender, request ID:${requestID}: ${stringify(item)}`)
            }
            console.info(`Broadcasting request ID:${requestID} starting`)
            socket.broadcast.emit('cmd', cmd)
            console.info(`Broadcasting request ID:${requestID} completed`)
          })
          break

        case "ADD":
          item = todomvcSvc.addItem(cmd.payload.title)
          delay(() => {
            if (ackFn) {
              ackFn(item)
              console.info(`Responding to sender: ${stringify(item)}`)
            }
            console.info(`Broadcasting request ID:${requestID} starting`)
            socket.broadcast.emit('cmd', { ...cmd, payload: item })
            console.info(`Broadcasting request ID:${requestID} completed`)
          })
          break

        case "UPDATE":
          item = todomvcSvc.updateItem(cmd.payload.id, cmd.payload.data)
          delay(() => {
            if (ackFn) {
              ackFn(item)
              console.info(`Responding to sender: ${stringify(item)}`)
            }
            console.info(`Broadcasting request ID:${requestID} starting`)
            socket.broadcast.emit('cmd', cmd)
            console.info(`Broadcasting request ID:${requestID} completed`)
          })
          break
        }      
    } catch (e) {
      console.error('Error!', e)
    }
  })

  socket.on('disconnect', function () {
    unsubscribe(id)
  });
})

server.listen(argv.port)
