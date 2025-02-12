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
    db_write:function(msg) {
        this.socket.send(JSON.stringify({eventName:"db_write",data:msg}))
    },
    db_read:function(a, b) {
        this.socket.send(JSON.stringify({eventName:"db_read",data:a}))
    },
    db_init:function() {
        this.socket.send(JSON.stringify({eventName:"db_init",data:''}))
    }
}