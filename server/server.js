global.path = require("path")
global.fs = require('fs')
const db = require('better-sqlite3')(path.join(__dirname, 'message.db').toString(), {verbose: null})
const ws = require('ws').Server
const express = require('express')
const app = express()
const server = require('https').createServer({
    key:fs.readFileSync(path.join(__dirname,'../ssl.key')),
    cert:fs.readFileSync(path.join(__dirname,'../ssl.crt'))
},app)
const host = '0.0.0.0'
const port = 443

let errorCb = rtc =>{return err=>err&&rtc.emit("error", err)};
function WebRTC(){
    this.sockets = [];
    this.rooms = {};
    this.on('__join', function (data, socket) {
        console.log("房间里有" + this.sockets.length + "人");
        let ids = [], i, m, room = data.room || "__default",
            curSocket, curRoom;
        curRoom = this.rooms[room] = this.rooms[room] || [];
        for (i = 0, m = curRoom.length; i < m; i++) {
            curSocket = curRoom[i];
            if (curSocket.id === socket.id) continue;
            ids.push(curSocket.id);
            curSocket.send(JSON.stringify({"eventName": "_new_peer","data": {"socketId": socket.id}}), errorCb);
        }
        curRoom.push(socket);
        socket.room = room;
        socket.send(JSON.stringify({"eventName": "_peers","data": {"connections": ids,"you": socket.id}}), errorCb);
        this.emit('new_peer', socket, room);
    });
    this.on('__ice_candidate', function (data, socket) {
        var soc = this.getSocket(data.socketId);
        soc&&(
            soc.send(JSON.stringify({"eventName": "_ice_candidate","data": {"id": data.id,"label": data.label,"sdpMLineIndex" :data.label,"candidate": data.candidate,"socketId": socket.id}}), errorCb),
            this.emit('ice_candidate', socket, data))
    });
    this.on('__offer', function (data, socket) {
        var soc = this.getSocket(data.socketId);
        soc&&(
            soc.send(JSON.stringify({"eventName": "_offer","data": {"sdp": data.sdp,"socketId": socket.id}}), errorCb),
            this.emit('offer', socket, data))
    });
    this.on('__answer', function (data, socket) {
        var soc = this.getSocket(data.socketId);
        soc&&(
            soc.send(JSON.stringify({"eventName": "_answer","data": {"sdp": data.sdp,"socketId": socket.id}}), errorCb),
            this.emit('answer', socket, data))
    });
    this.on('__invite', function (data) {});
    this.on('__ack', function (data) {});
}
require('util').inherits(WebRTC, require('events').EventEmitter);
WebRTC.prototype.addSocket = function (socket) {this.sockets.push(socket)};
WebRTC.prototype.removeSocket = function (socket) {
    var i = this.sockets.indexOf(socket), room = socket.room;
    this.sockets.splice(i, 1);
    if (room) {
        i = this.rooms[room].indexOf(socket);
        this.rooms[room].splice(i, 1);
        if (this.rooms[room].length === 0) delete this.rooms[room];
    }
};
WebRTC.prototype.broadcast = function (data, errorCb) {
    for (var i = this.sockets.length; i--;)  this.sockets[i].send(data, errorCb);
};
WebRTC.prototype.broadcastInRoom = function (room, data, errorCb) {
    var curRoom = this.rooms[room], i;
    if(curRoom) for (i = curRoom.length; i--;) curRoom[i].send(data, errorCb)
};
WebRTC.prototype.getRooms = function () {
    let rooms = [], room;
    for (room in this.rooms) rooms.push(room);
    return rooms;
};
WebRTC.prototype.getSocket = function (socketId) {
    let i, curSocket;
    if (!this.sockets) return;
    for (i = this.sockets.length; i--;) {
        curSocket = this.sockets[i];
        if (socketId === curSocket.id) return curSocket;
    }
};
WebRTC.prototype.init = function (socket) {
    let that = this;
    that.addSocket(socket);
    socket.on('message', function (data) {
        // console.log(data);
        let json = JSON.parse(data);
        if (json.eventName) that.emit(json.eventName, json.data, socket);
        else that.emit("socket_message", socket, data);
    });
    socket.on('close', function () {
        let i, m, room = socket.room, curRoom;
        if (room) {
            curRoom = that.rooms[room];
            for (i = curRoom.length; i--;) {
                if (curRoom[i].id === socket.id) continue;
                curRoom[i].send(JSON.stringify({"eventName": "_remove_peer","data": {"socketId": socket.id}}), errorCb);
            }
        }
        that.removeSocket(socket);
        that.emit('remove_peer', socket.id, that);
    });
    that.emit('new_connect', socket);
};

require('./enhance').listen(new ws({server: server}), WebRTC, errorCb, db)
server.listen(port, host)

app.get('/webrtc/login',(req, res)=>{
    let mode = req.query.mode
    let user = req.query.user
    let room = req.query.room || '__default'
    let result
    res.header("Access-Control-Allow-Origin", "*")
    switch(mode){
        case 'login':
            result = db.prepare(`REPLACE INTO user (user,room) VALUES (?,?)`).run(user, room)
            db.prepare(`create table if not exists ${room}(
                "id" integer PRIMARY KEY AUTOINCREMENT NOT NULL,
                "user" text(32) NOT NULL,
                "msg" text(32) NOT NULL)`).run();
            res.send()
            break
        case 'create':
            db.prepare(`REPLACE INTO user (user,room) VALUES (?,?)`).run(user, room)
            res.send()
            break
        case 'query':
            result = db.prepare(`SELECT * FROM user where user = ?`).get(user)
            res.send(JSON.stringify(result))
            break
        default:
            res.send()
            break
    }
})


