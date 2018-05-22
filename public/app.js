const socket = io('http://104.251.212.128:99991');

socket.emit('admin', socket.id)

$('#tree-view')
  .jstree({ 
    "core" : {
      "themes" : { "stripes" : true },
      "data" :  [{
        text: 'Live Code',
        children: []
      }]
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
      socket.emit('fileReadRequest', filePath)
    }catch(e){
      console.log('empty path')
    }
  })

let events = ['add', 'change', 'ready', 'unlink']

events.forEach( function(eventName){
  socket.on(eventName, function(data){
    if(eventName == 'change'){
      previewFileAndHighlight(data.fileStr)
    }
    updateData(data)
  })  
})

socket.on('fileReadResponse', function(fileStr){
  previewFileAndHighlight(fileStr)  
})

function previewFileAndHighlight(fileStr){
  $('#file-content').html(`
    <pre>
      <code>${fileStr}</code>
    </pre>
  `)
  $('pre code').each(function(i, block) {
    hljs.highlightBlock(block);
  });
}

function updateData(data){
  let instance = $('#tree-view').jstree(true)
  let children = instance.settings.core.data[0].children
  let sessionNames = children.map( child => child.text)
  let sessionExists = sessionNames.includes(data.text)
  
  if(sessionExists){
    data = children.map( tree => (tree.text == data.text) ? data : tree)
    children = data;
  }else{
    children.push(data);
  }
  instance.refresh();
}