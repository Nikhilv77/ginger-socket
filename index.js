const io = require('socket.io')(8900,{
  cors:{
    origin : 'http://localhost:3000'
  }
  
})
let users = [];
io.on('connection',(socket)=>{
  
    socket.on('add-user',(newUserId)=>{
      console.log(newUserId,'user to be added');
      if(!users.some(user=>user.id === newUserId)){
        users.push({id:newUserId,socketId:socket.id})
      }
      io.emit('get-users',users);
    })
    socket.on('send-message',(data)=>{
  if(data){
    const{receiverId} = data;
    console.log(users);
    const user = users.find(user=>user.id === receiverId)
    if(user){
      console.log(user);
      io.to(user.socketId).emit('receive-message',data)
    }
  }
    })
    socket.on('sending-new-post',(newPost)=>{
      io.emit('receiving-new-post', newPost);
    })
    socket.on('sending-likings',(likes)=>{
      console.log(likes,"this is sending likes");
       io.emit(`notifying-likings-${likes.postId}`)
    })
    socket.on('update-liked',(data)=>{
      io.to(data.socketId).emit(`receiving-liked-${data.postId}`, data.liked)
    })
    socket.on('sending-new-comment',(newComment)=>{
      io.emit('receiving-new-comment',newComment)
    })
    socket.on('delete-Post',(postId)=>{
      console.log(postId, "this is post id");
      io.emit('deleted-post',postId);
    })
    socket.on('disconnect',()=>{
      console.log("disconnected");
     users = users.filter(user=>user.socketId !==socket.id)
     io.emit('get-users',users)
    })
})