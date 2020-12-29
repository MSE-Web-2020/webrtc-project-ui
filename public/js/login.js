///////////////////////参数///////////////////////
const video = $('#video')[0], canvas = $('#overlay')[0]
var snap, timer, username, stream, onff
var opt={
    vsize:400,	//视频框尺寸
    ssize:()=>{return opt.vsize/2},	//验证图像尺寸
    ldmks:false,	//是否开启特征点
    dtime:3000,	//初次验证所需时间
    color:{
    	show1:'rgba(255,0,0,0.8)',	//低精度颜色
    	show2:'rgba(0,255,0,0.8)'	//高精度颜色
    },
    score:{
        show1:0.1,	//低精度
        show2:0.5,	//高精度
        base:75,	//判断是否验证成功标准
        strict:90,	//判断是否已经注册标准
    },
    inputSize:[128,160,224,320,416,512,608],
    faceopt:()=>{return new faceapi.TinyFaceDetectorOptions({inputSize:opt.inputSize[2], scoreThreshold:opt.score.show1})},
    api:'https://aip.baidubce.com/rest/2.0/face/v3/',
    at:'?access_token=24.82354497b143b6dddc1de41cdf00c52a.2592000.1611802380.282335-23103930',
    url:mode=>{return opt.api + opt.mode[mode] + opt.at},
    type:'BASE64',
    group:'TEST',
    mode:{
        srh:'search',
        add:'faceset/user/add',
        del:'faceset/user/delete'
    },
    data:{
        srh:args=>{return {image:args[0], image_type:opt.type, group_id_list:opt.group}},
        add:args=>{return {image:args[0], image_type:opt.type, user_id:args[1], group_id:opt.group}},
        del:args=>{return {user_id:args[0], group_id:opt.group}}
    },
    datajs:(mode,args)=>{return JSON.stringify(opt.data[mode](args))},
    func:{
        srh:(data,args)=>args[1]?srh_add(data):srh_verify(data),
        add:(data,args)=>add_usr(data),
        del:(data,args)=>del_usr(data)
    },
}
///////////////////////初始样式///////////////////////
$('#video').attr({'width':opt.vsize,'height':opt.vsize})
$('#overlay').attr({'width':opt.vsize,'height':opt.vsize}).css('margin-left',-opt.vsize)
//按键绑定
$('#onff').click(()=>{
	if(onff){run();onff = null}
	else{stream.getTracks()[0].stop();onff = true}
})
$('#login').click(()=>{
	if(username){
		if(!$('#roomname').val()&&!confirm('尚未填写房间号，即将进入公共房间，是否进入？')) return false
		window.location.href=`/?username=${username}#${$('#roomname').val()}`
	}else alert('尚未验证')
})
$('#register').click(()=>{
	if(!$('#username').val()) alert('尚未填写用户名')
	else{getsnap();bdapi('srh',[snap,$('#username').val()])}
})
$('#delete').click(()=>
	confirm('确认删除用户？')
	&&bdapi('del',[$('#username').val()])
	&(username=null)
)
$('#video').click(()=>{$('#username').val('');snap = null})
///////////////////////function///////////////////////
bdapi=(mode,args)=>{$.ajax({
	url:opt.url(mode),
	type:'post',
	dateType:'json',
	data:opt.datajs(mode,args),
	success:data=>opt.func[mode](data,args),
	error:err=>console.log("error")
})}
srh_verify=data=>{
    if(data.result&&data.result.user_list[0].score>opt.score.base){
        username = data.result.user_list[0].user_id
        $('#username').val(username)
        alert(`用户 ${username} 验证成功, 匹配度：${data.result.user_list[0].score.toFixed(2)}`)
        return true
    }else{
        alert('No user matched!')
        return false
	}
}
srh_add=data=>{
    if(data.result&&data.result.user_list[0].score>opt.score.strict){
        let name = data.result.user_list[0].user_id
        alert(`您已注册！用户名为: ${name}`)
        username = name
        $('#username').val(name)
        return false
    }else{
        bdapi('add',[snap, $('#username').val()])
        return true
    }
}
add_usr=data=>{
    if(data.error_code!=0) alert(data.error_msg)
    else{
        username = $('#username').val()
        alert('注册成功')
        return true
    }
}
del_usr=data=>{
    if(data.error_code!=0) alert(data.error_msg)
    else alert(`用户 ${$('#username').val()} 删除成功`)
    $('#username').val('')
	return true
}
getsnap=()=>{
	$('<canvas>')
		.appendTo('body')
		.attr({id:'snapshot', width:opt.vsize, height:opt.vsize})[0]
		.getContext('2d')
		.drawImage(video, 0, 0, opt.ssize(), opt.ssize())
	snap = $('#snapshot')[0]
		.toDataURL()
		.replace(/^data:image\/\w+;base64,/, "")
	$('#snapshot')[0].remove()
}
async function onPlay(){
	let option = {}, box
	let result = opt.ldmks
		?await faceapi.detectSingleFace(video, opt.faceopt()).withFaceLandmarks(true)
		:await faceapi.detectSingleFace(video, opt.faceopt())
	if (result) {
		timer=timer||Date.now()
		let dims = faceapi.matchDimensions(canvas, video, true)
		let resize = faceapi.resizeResults(result, dims)
		if(resize.score){
			box = resize.box
			option.label = resize.score.toFixed(2)
		}else{
			box = resize.detection.box
			option.label = resize.detection.score.toFixed(2)
		}
		if(!snap&&option.label>opt.score.show2&&(Date.now()-timer)>opt.dtime){
			getsnap()
			bdapi('srh',[snap, false])
		}
		option.boxColor = option.label>opt.score.show2?opt.color.show2:opt.color.show1
		new faceapi.draw.DrawBox(box, option).draw(canvas)
		opt.ldmks&&faceapi.draw.drawFaceLandmarks(canvas, resize)
	}else{
		timer=null
		canvas.height=canvas.height
	}
	$('#video').show()
	setTimeout(()=>onPlay())
}
async function run(){
	await faceapi.nets.tinyFaceDetector.load('/js')
	opt.ldmks&&await faceapi.loadFaceLandmarkTinyModel('/js')
	navigator.mediaDevices
		.getUserMedia({video:{facingMode:"user",width:opt.vsize,height:opt.vsize}})
		.then(s=>(video.srcObject=stream=s))
		.catch(e=>console.log(e))
}
///////////////////////初始化///////////////////////
window.onload=()=>{
	video.onloadedmetadata=()=>onPlay()
	run()
}