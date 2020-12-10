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
    changeStream:function(options, mode){        
    },
    close:function(){
        this.socket.close()
    }
}