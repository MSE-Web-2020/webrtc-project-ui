module.exports.listen = function(WebRTC, rtc, errCb, db){
    const dbInit = (roomInit, userListInit) =>{
        if(roomInit){
            db.prepare(`DROP TABLE IF EXISTS "${roomInit}"`).run();
            db.prepare(`CREATE TABLE "${roomInit}" (
              "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
              "user" text(32) NOT NULL,
              "msg" text(32) NOT NULL
            )`).run()
        }
        if(userListInit){
            db.prepare(`DROP TABLE IF EXISTS "user"`).run();
            db.prepare(`CREATE TABLE "user" (
              "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
              "user" text(32) NOT NULL,
              "room" text(32) NOT NULL,
              UNIQUE(user)
            )`).run()
        }
    }
    dbInit('__default')
    if(!db.prepare(`select * from sqlite_master where type = 'table' and name = ?`).get('user')) dbInit(null, true)

    const dbExc = (mode, room, user, msg) =>{
        let result
        switch(mode){
            case 'write':
                room = room == '__default'?'__default':room.slice(1)
                result = db.prepare(`INSERT INTO ${room} (user,msg) VALUES (?,?)`).run(user, msg)
                return result
            case 'read':
                let res = ''
                room = room == '__default'?'__default':room.slice(1)
                if(room == 'user') return false
                if(db.prepare(`select * from sqlite_master where type = 'table' and name = ?`).get(room)){
                    result = db.prepare(`SELECT * FROM ${room} order by id desc`).all()
                    result.forEach(e=>{
                        let usr = e.user == user?'me':e.user
                        res += `${usr}: ${e.msg}\n`
                    })
                    return res.slice(0, -1)
                }else return false
            default:
                result = null
                break
        }
    }

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

    WebRTC.rtc.on('db_write', (msg, socket)=>{
        dbExc('write', socket.room, socket.id, msg)
    })
    WebRTC.rtc.on('db_init', (msg, socket)=>{
        let room = socket.room == '__default'?'__default':socket.room.slice(1)
        dbInit(room)
    })

    //监听日志
    WebRTC.on('connection', function(socket, req){
        socket.id = require("querystring").parse(req.url.split("?")[1]).username
        this.rtc.init(socket)
    })
    WebRTC.rtc.on('new_connect', socket=>{
        console.log('创建新连接')
    })
    WebRTC.rtc.on('remove_peer', socketId=>console.log(socketId + "用户离开"))
    WebRTC.rtc.on('new_peer', (socket, room)=>{
        console.log("新用户" + socket.id + "加入房间" + room)
        socket.send(JSON.stringify({"eventName": "init_message", data:dbExc('read',socket.room,socket.id)}), errCb)
    })
    WebRTC.rtc.on('socket_message', (socket, msg)=>console.log("接收到来自" + socket.id + "的新消息：" + msg))
    // WebRTC.rtc.on('ice_candidate', (socket, ice_candidate)=>console.log("接收到来自" + socket.id + "的ICE Candidate"))
    WebRTC.rtc.on('offer', (socket, offer)=>console.log("接收到来自" + socket.id + "的Offer"))
    WebRTC.rtc.on('answer', (socket, answer)=>console.log("接收到来自" + socket.id + "的Answer"))
    WebRTC.rtc.on('error', err=>console.log("发生错误：" + err.message))
}