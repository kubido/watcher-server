const socket = io('http://localhost:50001');

socket.emit('admin', socket.id)

$('#tree-view')
  .jstree({ 
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
  })

  .on("changed.jstree", function (e, data) {
    try{
      let filePath = data.node.li_attr.path
      console.log('-------->',filePath);
    }catch(e){
      console.log('--------> empty path');
    }
  })

let events = ['add', 'change', 'ready', 'unlink']

events.forEach( function(eventName){
  socket.on(eventName, function(data){
    updateData(data)
  })  
})

function updateData(data){
  $('#tree-view').jstree(true).settings.core.data = data;
  $('#tree-view').jstree(true).refresh();
}