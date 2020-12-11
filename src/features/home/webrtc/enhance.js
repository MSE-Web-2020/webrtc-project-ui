export const enhance = {
    one_mate:function(msg){
        this.socket.send(JSON.stringify({eventName:"one_mate",data:msg}))
    },
    all_mate:function(msg){
        this.socket.send(JSON.stringify({eventName:"all_mate",data:msg}))
    },
    all_room:function(msg){
        this.socket.send(JSON.stringify({eventName:"all_room",data:msg}))
    },
    del_mate:function(id){
        this.socket.send(JSON.stringify({eventName:"del_mate",data:id}))
    },
    stream_change:function(options, mode){
        var that = this
        let success = stream => {
            that.localMediaStream = stream
            that.emit("stream_created", stream)
            that.socket.send(JSON.stringify({eventName:"stream_change"}))
            that.emit('ready')
        },
        error = e => console.log(e)
        mode?navigator.mediaDevices.getDisplayMedia(options).then(success).catch(error)
            :navigator.mediaDevices.getUserMedia(options).then(success).catch(error)
    },
    getThis:function(){return this},
}