const socket = io('http://localhost:50001');

socket.emit('admin', socket.id)

$('#tree-view').jstree({ 
    "core" : {
      "themes" : { "stripes" : true },
      "data" :  []
    },
    "types" : {
      "file" : {
        "icon" : "jstree-file",
        "valid_children" : []
      }
    },
    "plugins" : [
      "contextmenu", "dnd", "search",
      "state", "types", "wholerow"
    ]

  });

let events = ['add', 'change', 'ready', 'unlink']

events.forEach( function(eventName){
  socket.on(eventName, function(data){
    alert('on', eventName)
    updateData(data)
  })  
})

function updateData(data){
  $('#tree-view').jstree(true).settings.core.data = data;
  $('#tree-view').jstree(true).refresh();
}