const express = require('express')
const app   = express()
const port  = 5000
const fs    = require('fs')

var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.set('view engine', 'ejs')
app.use(express.static('public'))

var adminId = null
io.on('connection', function(client){
  console.log('-----------ada koneksi', client.id)

  let events = ['add', 'change', 'ready', 'unlink']

  events.forEach( function(eventName){
    client.on(eventName, function(data){
      console.log('---------------------masuk sini')
      console.log('--------------:', eventName, client.id)
      client.to(adminId).emit(eventName, data)
    })
  })

  client.on('admin', function(){
    adminId = client.id
    console.log('------admin:', client.id)
  })

  client.on('fileReadRequest', function(path){
    try{
      let fileStr = fs.readFileSync(path, 'utf8')
      client.emit('fileReadResponse', fileStr)
    }catch(e){
      console.log('-------path', path)
    }
  })

});


app.get('/', (req,res,next) => {
  res.render('index')
})

app.listen(port, ()=>{
  console.log('-----------server started at port', port)
})

io.listen(50001)


[
  {name: "A", pos: 4},
  {name: "B", pos: 0},
  {name: "C", pos: 0}
]
