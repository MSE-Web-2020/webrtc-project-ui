module.exports.listen = function(WebRTC, rtc, errCb){
    rtc.prototype.one_mate = function(data, socket){
        for (let i of this.rooms[socket.room]) {
            if(data.dst == i.id){
                i.send(JSON.stringify({"eventName": "one_mate", data:{src:socket.id, data:data.data}}), errCb)
                break
            }
        }
    }
    rtc.prototype.del_mate = function(data, socket){
        let curRoom = this.rooms[socket.room]
        for (i = curRoom.length; i--;) {
            curRoom[i].send(JSON.stringify({"eventName": "remove_peer","data": data}), errCb)
        }
    }
    rtc.prototype.stream_change = function(data, socket){
        let curRoom = this.rooms[socket.room]
        for (i = curRoom.length; i--;) {
            if (curRoom[i].id == socket.id) continue
            curRoom[i].send(JSON.stringify({"eventName": "stream_changed","data": socket.id}), errCb)
        }
    }



    WebRTC.rtc = new rtc()
    var errorCb = errCb(WebRTC.rtc)

    //向个人发送信息
    WebRTC.rtc.on('one_mate', (data,socket)=>{
        WebRTC.rtc.one_mate(data,socket)
    })

    //向特定房间广播
    WebRTC.rtc.on('all_mate', (data,socket)=>{
        WebRTC.rtc.broadcastInRoom(socket.room, JSON.stringify({eventName: 'all_mate', data: data}), errorCb)
    })

    //所有房间广播
    WebRTC.rtc.on('all_room', (data,socket)=>{
        WebRTC.rtc.broadcast(JSON.stringify({eventName: 'all_room', data: data}), errorCb)
    })

    //删除指定用户
    WebRTC.rtc.on('del_mate', (data,socket)=>{
        WebRTC.rtc.del_mate(data, socket)
    })

    WebRTC.rtc.on('stream_change', (data,socket)=>{
        WebRTC.rtc.stream_change(data, socket)
    })

    //监听日志
    WebRTC.on('connection', function(socket, req){
        socket.id = require("querystring").parse(req.url.split("?")[1]).username
        // if(this.rooms[socket.room] == 4)
        !!socket.id
            ?this.rtc.init(socket)
            :socket.send(JSON.stringify({"eventName": "not_login"}), errCb)
    })
    WebRTC.rtc.on('new_connect', socket=>console.log('创建新连接'))
    WebRTC.rtc.on('remove_peer', socketId=>console.log(socketId + "用户离开"))
    WebRTC.rtc.on('new_peer', (socket, room)=>console.log("新用户" + socket.id + "加入房间" + room))
    WebRTC.rtc.on('socket_message', (socket, msg)=>console.log("接收到来自" + socket.id + "的新消息：" + msg))
    // WebRTC.rtc.on('ice_candidate', (socket, ice_candidate)=>console.log("接收到来自" + socket.id + "的ICE Candidate"))
    WebRTC.rtc.on('offer', (socket, offer)=>console.log("接收到来自" + socket.id + "的Offer"))
    WebRTC.rtc.on('answer', (socket, answer)=>console.log("接收到来自" + socket.id + "的Answer"))
    WebRTC.rtc.on('error', err=>console.log("发生错误：" + err.message))
}