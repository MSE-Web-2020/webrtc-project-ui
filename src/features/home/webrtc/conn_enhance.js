export const connect_enhance = function(){
    //监听服务器端信息
    this.on('send_to_client', data=>{
        alert(data)
    })

    this.on('all_room',data=>{
        // $('<p>').text(`系统广播: ${data}`).appendTo('#msgs')
    })
}

export const custom_enhance = {
    //向服务器端发送数据
    enhance:function(message){
        this.socket.send(JSON.stringify({eventName:"send_to_server",data:message}))
    },
    all_room:function(message){
        this.socket.send(JSON.stringify({eventName:"all_room",data:message}))
    },
}


//按键绑定
// $('#test1').click(()=>{
//     rtc.all_room('向全体成员广播信息')
// })
// $('#test2').click(()=>{
//     rtc.enhance('服务器向我推送信息')
// })