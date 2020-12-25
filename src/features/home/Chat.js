import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Button, Col, Input, Layout, Modal, Row, Typography, Upload, Dropdown, Menu } from 'antd';
import { SkyRTC } from './webrtc/SkyRTC-client';
import { enhance } from './webrtc/enhance';
import { UpOutlined, PoweroffOutlined } from '@ant-design/icons';
import { getQueryString } from '../common/url_utils';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Search } = Input;

var rtc = SkyRTC();
for (let i in enhance) rtc.prototype[i] = enhance[i];
rtc = new rtc();
let mediaRecorder;
let mediaRecorder2;
let mediaRecorder3;
let mediaRecorder4;
let recorderFile;
let recorderFile2;
let recorderFile3;
let recorderFile4;

let playRecorderFile = null;
let playRecorderFile2 = null;
let playRecorderFile3 = null;
let playRecorderFile4 = null;

var n=0;
var flag=1;
var flagPlay=1;
var flagFilter=1;
var flagShoot=1;

export default function Chat() {

  
  const playVideoRef = useRef(null);
  const myVideoRef = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const videoRef4 = useRef(null);
  const refUseMap = {};

  const [myInput, setMyInput] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);
  const [confirmFileModalVisible, setConfirmFileModalVisible] = useState(false);
  const [recordModalVisible, setRecordModalVisible] = useState(false);
  const [fileModalMessage, setFileModalMessage] = useState('');
  const [fileSendId, setFileSendId] = useState(null);

  const [flagPlayVideo, setflagPlayVideo] = useState(true);
  const [flagPlayVideo2, setflagPlayVideo2] = useState(false);
  const [flagPlayVideo3, setflagPlayVideo3] = useState(false);
  const [flagPlayVideo4, setflagPlayVideo4] = useState(false);

  const [flagVideoFilter, setflagVideoFilter] = useState(true);
  const [flagVideoFilter2, setflagVideoFilter2] = useState(false);
  const [flagVideoFilter3, setflagVideoFilter3] = useState(false);
  const [flagVideoFilter4, setflagVideoFilter4] = useState(false);
  
  const [flagVideoShoot, setflagVideoShoot] = useState(true);
  const [flagVideoShoot2, setflagVideoShoot2] = useState(false);
  const [flagVideoShoot3, setflagVideoShoot3] = useState(false);
  const [flagVideoShoot4, setflagVideoShoot4] = useState(false);

  const [flagVideo, setflagVideo] = useState(true);
  const [flagVideo2, setflagVideo2] = useState(false);
  const [flagVideo3, setflagVideo3] = useState(false);
  const [flagVideo4, setflagVideo4] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recording2, setRecording2] = useState(false);
  const [recording3, setRecording3] = useState(false);
  const [recording4, setRecording4] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [recorded2, setRecorded2] = useState(false);
  const [recorded3, setRecorded3] = useState(false);
  const [recorded4, setRecorded4] = useState(false);
  const [fileList, setFileList] = useState([]);


  useEffect(() => {
    if (!getQueryString('username')) {
      login();
    }
    let url = new URL(window.location.href), port = '443';
    rtc.connect(`wss:${url.hostname}:${port}${url.search}`, url.hash);
    rtc.on('connected', () => {
      console.log('websocket connected');
      rtc.createStream({ 'video': true, 'audio': true });
    });
    rtc.on('not_login', () => {
      login();
    });
    rtc.on('stream_created', stream => {
      myVideoRef.current.srcObject = stream;
      myVideoRef.current.play();
      myVideoRef.current.volume = 0.0;
      console.log('myVideo is setup successfully');
    });
    rtc.on('stream_create_error', () => alert('create stream failed!'));
  }, []);

  useEffect(() => {
    rtc.on('data_channel_message', (channel, socketId, message) => {
      console.log('channel', channel);
      console.log('socketId', socketId);
      console.log('message', message);
      setMsg(`${msg}\n${socketId}: ${message}`);
    });
    rtc.on('one_mate', message => alert(`来自 ${message.src} 的私信：\n${message.data}`));
    rtc.on('all_mate', message => {
      switch (message.mode) {
        case 'text':
          setMsg(`${msg}\n房间推送信息: ${message.data}`);
          break;
        case 'effect':
          break;
        default:
          break;
      }
    });
    rtc.on('all_room', message => {
      switch (message.mode) {
        case 'text':
          setMsg(`${msg}\n系统推送信息: ${message.data}`);
          break;
        case 'effect':
          break;
        default:
          break;
      }
    });
  }, [msg]);

  useEffect(() => {
    rtc.on('pc_add_stream', (stream, socketId) => {
      for (let i of [2, 3, 4]) {
        let video = eval(`videoRef${i}.current`);
        if (video && !!!video.srcObject) {
          video.srcObject = stream;
          let vp = video.play();
          if (vp !== undefined) vp.then(() => video.play()).catch(() => {
          });
          video.volume = 0.0;
          refUseMap[socketId] = `videoRef${i}`;
          break;
        }
      }
    });
    rtc.on('remove_peer', socketId => {
      let item = refUseMap[socketId];
      if (item != null) {
        switch (item) {
          case 'videoRef2':
            videoRef2.current.srcObject = null;
            break;
          case 'videoRef3':
            videoRef3.current.srcObject = null;
            break;
          case 'videoRef4':
            videoRef4.current.srcObject = null;
            break;
          default:
            break;
        }
      }
    });
    rtc.on('stream_changed', id => {
      eval(`${refUseMap[id]}.current.srcObject = null`);
      rtc.createPeerConnection(id);
    });
  }, [refUseMap]);

  useEffect(() => {
    rtc.on('send_file_accepted',
      (sendId, socketId, file) => {

      });
    rtc.on('send_file_refused',
      (sendId, socketId, file) => {

      });
    rtc.on('send_file',
      (sendId, socketId, file) => {

      });
    rtc.on('sended_file',
      (sendId, socketId, file) => {

      });
    rtc.on('send_file_chunk',
      (sendId, socketId, percent, file) => {

      });
    rtc.on('receive_file_chunk', (sendId, socketId, fileName, percent) => {

    });
    rtc.on('receive_file', (sendId, socketId, name) => {

    });
    rtc.on('send_file_error', () => {

    });
    rtc.on('send_file_error', err => console.log(err));
    rtc.on('receive_file_error', err => console.log(err));
    rtc.on('receive_file_ask', (sendId, socketId, fileName, fileSize) => {
      showFileModal();
      setFileModalMessage(`${socketId}用户想要给你传送${fileName}文件，大小${fileSize}KB,是否接受？`);
      setFileSendId(sendId);
    });
  }, []);

  const msgSend = mode => {
    switch (mode) {
      case 1:
        rtc.one_mate({ dst: 'a', data: '一对一私信' });
        break;
      case 2:
        rtc.all_mate({ mode: 'text', data: '向房间成员发送通知' });
        break;
      case 3:
        rtc.all_room({ mode: 'text', data: '向全体成员发送通知' });
        break;
      default:
    }
  };

  const login = () => {
    window.location.href = '/login.html';
  };

  const stream_change = mode => {
    let success = stream => {
        rtc.localMediaStream = stream;
        rtc.emit('stream_created', stream);
        rtc.socket.send(JSON.stringify({ eventName: 'stream_change' }));
        rtc.emit('ready');
      },
      error = e => console.log(e),
      options = { video: true, audio: true };
    mode ? navigator.mediaDevices.getDisplayMedia(options).then(success).catch(error)
      : navigator.mediaDevices.getUserMedia(options).then(success).catch(error);
  };

  const showInfo = () => {
    showModal();
  };

  const showEffect = () => {
    showModal();
  };

  const share = () => {
    showModal();
  };

  const uploadFile = () => {
    console.log('Upload', fileList);
    rtc.shareFile(fileList);
  };

  const showModal = () => {
    setConfirmModalVisible(true);
  };

  const hideModal = () => {
    setConfirmModalVisible(false);
  };

  const showFileModal = () => {
    setConfirmFileModalVisible(true);
  };

  const hideFileModal = () => {
    setConfirmFileModalVisible(false);
    setFileSendId(null);
  };

  const confirmToReceiveFile = () => {
    rtc.sendFileAccept(fileSendId);
    setConfirmFileModalVisible(false);
  };

  const showRecordModal = (visible) => {
    setRecordModalVisible(visible);
  };

  const exchange = () => {
    if(flag==1){
      flag = flag+1;
      setflagVideo(false);
      setflagVideo2(true);
      setflagVideo3(false);
      setflagVideo4(false);
    }else if(flag==2){
      flag = flag+1;
      setflagVideo(false);
      setflagVideo2(false);
      setflagVideo3(true);
      setflagVideo4(false);
    }else if(flag==3){
      flag = flag+1;
      setflagVideo(false);
      setflagVideo2(false);
      setflagVideo3(false);
      setflagVideo4(true);
    }else if(flag==4){
      flag = flag - 3;
      setflagVideo(true);
      setflagVideo2(false);
      setflagVideo3(false);
      setflagVideo4(false);
    }
  }
  
  const changePlayVideo = () => {
    if(flagPlay == 1){
      flagPlay = 2;
      setflagPlayVideo(false);
      setflagPlayVideo2(true);
      setflagPlayVideo3(false);
      setflagPlayVideo4(false);
    }else if(flagPlay == 2){
      flagPlay = 3;
      setflagPlayVideo(false);
      setflagPlayVideo2(false);
      setflagPlayVideo3(true);
      setflagPlayVideo4(false);
    }else if(flagPlay == 3){
      flagPlay = 4;
      setflagPlayVideo(false);
      setflagPlayVideo2(false);
      setflagPlayVideo3(false);
      setflagPlayVideo4(true);
    }else if(flagPlay == 4){
      flagPlay = 1;
      setflagPlayVideo(true);
      setflagPlayVideo2(false);
      setflagPlayVideo3(false);
      setflagPlayVideo4(false);
    }
  }

  const changeFilterWindow = () => {
    if(flagFilter == 1){
      flagFilter=2;
      setflagVideoFilter(false);
      setflagVideoFilter2(true);
      setflagVideoFilter3(false);
      setflagVideoFilter4(false);
    }else if(flagFilter == 2){
      flagFilter=3;
      setflagVideoFilter(false);
      setflagVideoFilter2(false);
      setflagVideoFilter3(true);
      setflagVideoFilter4(false);
    }else if(flagFilter == 3){
      flagFilter=4;
      setflagVideoFilter(false);
      setflagVideoFilter2(false);
      setflagVideoFilter3(false);
      setflagVideoFilter4(true);
    }else if(flagFilter == 4){
      flagFilter=1;
      setflagVideoFilter(true);
      setflagVideoFilter2(false);
      setflagVideoFilter3(false);
      setflagVideoFilter4(false);
    }
  }

  const changeShootWindow = () => {
    if(flagShoot == 1){
      flagShoot=2;
      setflagVideoShoot(false);
      setflagVideoShoot2(true);
      setflagVideoShoot3(false);
      setflagVideoShoot4(false);
    }else if(flagShoot == 2){
      flagShoot=3;
      setflagVideoShoot(false);
      setflagVideoShoot2(false);
      setflagVideoShoot3(true);
      setflagVideoShoot4(false);
    }else if(flagShoot == 3){
      flagShoot=4;
      setflagVideoShoot(false);
      setflagVideoShoot2(false);
      setflagVideoShoot3(false);
      setflagVideoShoot4(true);
    }else if(flagShoot == 4){
      flagShoot=1;
      setflagVideoShoot(true);
      setflagVideoShoot2(false);
      setflagVideoShoot3(false);
      setflagVideoShoot4(false);
    }
  }

  const record = () => {
    if(myVideoRef.current.srcObject != null){
      setRecording(true);
      let buffer = [];
      mediaRecorder = new MediaRecorder(myVideoRef.current.srcObject);
      mediaRecorder.ondataavailable = e => buffer.push(e.data);
      mediaRecorder.onstop = e => {
        recorderFile = new Blob(buffer, { 'type': 'video/mp4' });
        playRecorderFile = new Blob(buffer, { 'type': 'video/mp4' });
        buffer = [];
        console.log('录制成功!');
        setRecorded(true);
      };
      mediaRecorder.start();
    }else{
      alert("没有视频信息");
    }
  };
  const record2 = () => {
    if(videoRef2.current.srcObject != null){
      setRecording2(true);
      let buffer = [];
      mediaRecorder2 = new MediaRecorder(videoRef2.current.srcObject);
      mediaRecorder2.ondataavailable = e => buffer.push(e.data);
      mediaRecorder2.onstop = e => {
        recorderFile2 = new Blob(buffer, { 'type': 'video/mp4' });
        playRecorderFile2 = new Blob(buffer, { 'type': 'video/mp4' });
        buffer = [];
        console.log('录制成功!');
        setRecorded2(true);
      };
      mediaRecorder2.start();
    }else{
      alert("没有视频信息");
    }
  };
  const record3 = () => {
    if(videoRef3.current.srcObject != null){
      setRecording3(true);
      let buffer = [];
      mediaRecorder3 = new MediaRecorder(videoRef3.current.srcObject);
      mediaRecorder3.ondataavailable = e => buffer.push(e.data);
      mediaRecorder3.onstop = e => {
        recorderFile3 = new Blob(buffer, { 'type': 'video/mp4' });
        playRecorderFile3 = new Blob(buffer, { 'type': 'video/mp4' });
        buffer = [];
        console.log('录制成功!');
        setRecorded3(true);
      };
      mediaRecorder3.start();
    }else{
      alert("没有视频信息");
    }
  };
  const record4 = () => {
    if(videoRef4.current.srcObject != null){
      setRecording4(true);
      let buffer = [];
      mediaRecorder4 = new MediaRecorder(videoRef4.current.srcObject);
      mediaRecorder4.ondataavailable = e => buffer.push(e.data);
      mediaRecorder4.onstop = e => {
        recorderFile4 = new Blob(buffer, { 'type': 'video/mp4' });
        playRecorderFile4 = new Blob(buffer, { 'type': 'video/mp4' });
        buffer = [];
        console.log('录制成功!');
        setRecorded4(true);
      };
      mediaRecorder4.start();
    }else{
      alert("没有视频信息");
    }
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };
  const stopRecording2 = () => {
    setRecording2(false);
    if (mediaRecorder2) {
      mediaRecorder2.stop();
    }
  };
  const stopRecording3 = () => {
    setRecording3(false);
    if (mediaRecorder3) {
      mediaRecorder3.stop();
    }
  };
  const stopRecording4 = () => {
    setRecording4(false);
    if (mediaRecorder4) {
      mediaRecorder4.stop();
    }
  };
  
  const playVideo = () => {
    if(playRecorderFile != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }
  const playVideo2 = () => {
    if(playRecorderFile2 != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile2)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }
  const playVideo3 = () => {
    if(playRecorderFile3 != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile3)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }
  const playVideo4 = () => {
    if(playRecorderFile4 != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile4)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }

  const saveRecord = () => {
    n=1;
    // alert(n);
    showRecordModal(true);
  };
  const saveRecord2 = () => {
    n=2;
    // alert(n);
    showRecordModal(true);
  };
  const saveRecord3 = () => {
    n=3;
    // alert(n);
    showRecordModal(true);
  };
  const saveRecord4 = () => {
    n=4;
    // alert(n);
    showRecordModal(true);
  };

//切换我的窗口滤镜特效
var flag_count=0;
const changeVideoFilter = () => {
  if(myVideoRef.current.srcObject){
    flag_count++;
    switch(flag_count){
      case 1:myVideoRef.current.className = 'grayscale';break;
      case 2:myVideoRef.current.className = 'sepia';break;
      case 3:myVideoRef.current.className = 'blur';break;
      case 4:myVideoRef.current.className = '';flag_count=0;break;
    }
  }else{
    alert("无视频信息");
  }
}
//切换窗口2滤镜特效
var flag_count2=0;
const changeVideoFilter2 = () => {
  if(videoRef2.current.srcObject){
    flag_count2++;
    switch(flag_count2){
      case 1:videoRef2.current.className = 'grayscale';break;
      case 2:videoRef2.current.className = 'sepia';break;
      case 3:videoRef2.current.className = 'blur';break;
      case 4:videoRef2.current.className = '';flag_count2=0;break;
    }
  }else{
    alert("无视频信息");
  }
}
//切换窗口3滤镜特效
var flag_count3=0;
const changeVideoFilter3 = () => {
  if(videoRef3.current.srcObject){
    flag_count3++;
    switch(flag_count3){
      case 1:videoRef3.current.className = 'grayscale';break;
      case 2:videoRef3.current.className = 'sepia';break;
      case 3:videoRef3.current.className = 'blur';break;
      case 4:videoRef3.current.className = '';flag_count3=0;break;
    }
  }else{
    alert("无视频信息");
  }
}
//切换窗口4滤镜特效
var flag_count4=0;
const changeVideoFilter4 = () => {
  if(videoRef4.current.srcObject){
    flag_count4++;
    switch(flag_count4){
      case 1:videoRef4.current.className = 'grayscale';break;
      case 2:videoRef4.current.className = 'sepia';break;
      case 3:videoRef4.current.className = 'blur';break;
      case 4:videoRef4.current.className = '';flag_count4=0;break;
    }
  }else{
    alert("无视频信息");
  }
}

//截图功能实现
//反色
const shoot_reverse = flag => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if(flag == 1 && myVideoRef.current.srcObject != null){
    ctx.drawImage(myVideoRef.current,0,0);
  }else if(flag == 2 && videoRef2.current.srcObject != null){
    ctx.drawImage(videoRef2.current,0,0);
  }else if(flag == 3 && videoRef3.current.srcObject != null){
    ctx.drawImage(videoRef3.current,0,0);
  }else if(flag == 4 && videoRef4.current.srcObject != null){
    ctx.drawImage(videoRef4.current,0,0);
  }else{
    alert("无视频信息！");
    return;
  }
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);    
  var imageData_length = imageData.data.length / 4;
  // 解析之后进行算法运算
  for (var i = 0; i < imageData_length; i++) {
      imageData.data[i * 4] = 255 - imageData.data[i * 4];
      imageData.data[i * 4 + 1] = 255 - imageData.data[i * 4 + 1];
      imageData.data[i * 4 + 2] = 255 - imageData.data[i * 4 + 2];
  }
  ctx.putImageData(imageData, 0, 0);
  canvas.toBlob((myblob)=>{
    download(myblob);
  });
}
//卷积
const shoot_cnn = flag => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if(flag == 1 && myVideoRef.current.srcObject != null){
    ctx.drawImage(myVideoRef.current,0,0);
  }else if(flag == 2 && videoRef2.current.srcObject != null){
    ctx.drawImage(videoRef2.current,0,0);
  }else if(flag == 3 && videoRef3.current.srcObject != null){
    ctx.drawImage(videoRef3.current,0,0);
  }else if(flag == 4 && videoRef4.current.srcObject != null){
    ctx.drawImage(videoRef4.current,0,0);
  }else{
    alert("无视频信息！");
    return;
  }
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);    
  // 解析之后进行算法运算
  for (var i = 0; i < imageData.height; i++){
    for(var j = 0; j < imageData.width; j++){
      var x = i*4*imageData.width + 4*j;
      var r = imageData.data[x];
      var g = imageData.data[x+1];
      var b = imageData.data[x+2];
      imageData.data[x] = (r+g+b)/3;
      imageData.data[x+1] = (r+g+b)/3;
      imageData.data[x+2] = (r+g+b)/3;
    }
  }
  for (var i = 0; i < imageData.height; i++){
    for(var j = 0; j < imageData.width; j++){
      var x = i*4*imageData.width + 4*j;
      if(i>0 && j>0 && i<imageData.height-1 && j<imageData.width-1){
        var r1 = (i-1)*4*imageData.width + 4*j-4; var g1 = (i-1)*4*imageData.width + 4*j-3; var b1 = (i-1)*4*imageData.width + 4*j-2;
        var r2 = (i-1)*4*imageData.width + 4*j;   var g2 = (i-1)*4*imageData.width + 4*j+1; var b2 = (i-1)*4*imageData.width + 4*j+2;
        var r3 = (i-1)*4*imageData.width + 4*j+4; var g3 = (i-1)*4*imageData.width + 4*j+5; var b3 = (i-1)*4*imageData.width + 4*j+6;
        var r4 = i*4*imageData.width + 4*j-4;     var g4 = i*4*imageData.width + 4*j-3;     var b4 = i*4*imageData.width + 4*j-2;
        var r5 = i*4*imageData.width + 4*j+4;     var g5 = i*4*imageData.width + 4*j+5;     var b5 = i*4*imageData.width + 4*j+6;
        var r6 = (i+1)*4*imageData.width + 4*j-4; var g6 = (i+1)*4*imageData.width + 4*j-3; var b6 = (i+1)*4*imageData.width + 4*j-2;
        var r7 = (i+1)*4*imageData.width + 4*j;   var g7 = (i+1)*4*imageData.width + 4*j+1; var b7 = (i+1)*4*imageData.width + 4*j+2;
        var r8 = (i+1)*4*imageData.width + 4*j+4; var g8 = (i+1)*4*imageData.width + 4*j+5; var b8 = (i+1)*4*imageData.width + 4*j+6;
        imageData.data[x] = imageData.data[r1]+imageData.data[r2]+imageData.data[r3]+imageData.data[r4]+imageData.data[r5]+imageData.data[r6]+imageData.data[r7]+imageData.data[r8]-8*imageData.data[x];
        // imageData.data[x] = imageData.data[r2]+imageData.data[r4]+imageData.data[r5]+imageData.data[r7]-4*imageData.data[x];
        imageData.data[x+1] = imageData.data[x];
        imageData.data[x+2] = imageData.data[x];
      }
    }
  }
  ctx.putImageData(imageData, 0, 0);
  canvas.toBlob((myblob)=>{
    download(myblob);
  });
}
//gray
const shoot_gray = flag => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if(flag == 1 && myVideoRef.current.srcObject != null){
    ctx.drawImage(myVideoRef.current,0,0);
  }else if(flag == 2 && videoRef2.current.srcObject != null){
    ctx.drawImage(videoRef2.current,0,0);
  }else if(flag == 3 && videoRef3.current.srcObject != null){
    ctx.drawImage(videoRef3.current,0,0);
  }else if(flag == 4 && videoRef4.current.srcObject != null){
    ctx.drawImage(videoRef4.current,0,0);
  }else{
    alert("无视频信息！");
    return;
  }
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);    
  // 解析之后进行算法运算
  for (var i = 0; i < imageData.height; i++){
    for(var j = 0; j < imageData.width; j++){
      var x = i*4*imageData.width + 4*j;
      var r = imageData.data[x];
      var g = imageData.data[x+1];
      var b = imageData.data[x+2];
      var gray = 0.3 * r + 0.59 * g + 0.11 * b;//基于人眼颜色感知的去色效果
      imageData.data[x] = gray;
      imageData.data[x+1] = gray;
      imageData.data[x+2] = gray;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  canvas.toBlob((myblob)=>{
    download(myblob);
  });
}
//版画（二值化）
const shoot_bool = flag => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if(flag == 1 && myVideoRef.current.srcObject != null){
    ctx.drawImage(myVideoRef.current,0,0);
  }else if(flag == 2 && videoRef2.current.srcObject != null){
    ctx.drawImage(videoRef2.current,0,0);
  }else if(flag == 3 && videoRef3.current.srcObject != null){
    ctx.drawImage(videoRef3.current,0,0);
  }else if(flag == 4 && videoRef4.current.srcObject != null){
    ctx.drawImage(videoRef4.current,0,0);
  }else{
    alert("无视频信息！");
    return;
  }
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);    
  // 解析之后进行算法运算
  for (var i = 0; i < imageData.height; i++){
    for(var j = 0; j < imageData.width; j++){
      var x = i*4*imageData.width + 4*j;
      var r = imageData.data[x];
      var g = imageData.data[x+1];
      var b = imageData.data[x+2];
      var gray = 0.3 * r + 0.59 * g + 0.11 * b;//基于人眼颜色感知的去色效果
      var white_black;
      if (gray > 200) {
        white_black = 255;
      } else if(gray < 100){
        white_black = 0;
      }else{

      }
      imageData.data[x] = white_black;
      imageData.data[x+1] = white_black;
      imageData.data[x+2] = white_black;
    }
  }
  ctx.putImageData(imageData, 0, 0);
  canvas.toBlob((myblob)=>{
    download(myblob);
  });
}
//高斯模糊
const shoot_gaussBlur = flag => {
  const canvas = document.createElement('canvas');
  canvas.width = 640;
  canvas.height = 480;
  const ctx = canvas.getContext('2d');
  if(flag == 1 && myVideoRef.current.srcObject != null){
    ctx.drawImage(myVideoRef.current,0,0);
  }else if(flag == 2 && videoRef2.current.srcObject != null){
    ctx.drawImage(videoRef2.current,0,0);
  }else if(flag == 3 && videoRef3.current.srcObject != null){
    ctx.drawImage(videoRef3.current,0,0);
  }else if(flag == 4 && videoRef4.current.srcObject != null){
    ctx.drawImage(videoRef4.current,0,0);
  }else{
    alert("无视频信息！");
    return;
  }
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);    
  // 解析之后进行算法运算
  imageData = gaussBlur(imageData);
  ctx.putImageData(imageData, 0, 0);
  canvas.toBlob((myblob)=>{
    download(myblob);
  });
}
//高斯模糊公式
const gaussBlur = imgData => {
  console.log(imgData);
  var pixes = imgData.data;
  var width = imgData.width;
  var height = imgData.height;
  var gaussMatrix = [],
      gaussSum = 0,
      x, y,
      r, g, b, a,
      i, j, k, len;

  var radius = 30;
  var sigma = 5;

  a = 1 / (Math.sqrt(2 * Math.PI) * sigma);
  b = -1 / (2 * sigma * sigma);
  //生成高斯矩阵
  for (i = 0, x = -radius; x <= radius; x++, i++){
      g = a * Math.exp(b * x * x);
      gaussMatrix[i] = g;
      gaussSum += g;

  }
  //归一化, 保证高斯矩阵的值在[0,1]之间
  for (i = 0, len = gaussMatrix.length; i < len; i++) {
      gaussMatrix[i] /= gaussSum;
  }
  //x 方向一维高斯运算
  for (y = 0; y < height; y++) {
      for (x = 0; x < width; x++) {
          r = g = b = a = 0;
          gaussSum = 0;
          for(j = -radius; j <= radius; j++){
              k = x + j;
              if(k >= 0 && k < width){//确保 k 没超出 x 的范围
                  //r,g,b,a 四个一组
                  i = (y * width + k) * 4;
                  r += pixes[i] * gaussMatrix[j + radius];
                  g += pixes[i + 1] * gaussMatrix[j + radius];
                  b += pixes[i + 2] * gaussMatrix[j + radius];
                  // a += pixes[i + 3] * gaussMatrix[j];
                  gaussSum += gaussMatrix[j + radius];
              }
          }
          i = (y * width + x) * 4;
          // 除以 gaussSum 是为了消除处于边缘的像素, 高斯运算不足的问题
          // console.log(gaussSum)
          pixes[i] = r / gaussSum;
          pixes[i + 1] = g / gaussSum;
          pixes[i + 2] = b / gaussSum;
          // pixes[i + 3] = a ;
      }
  }
  //y 方向一维高斯运算
  for (x = 0; x < width; x++) {
      for (y = 0; y < height; y++) {
          r = g = b = a = 0;
          gaussSum = 0;
          for(j = -radius; j <= radius; j++){
              k = y + j;
              if(k >= 0 && k < height){//确保 k 没超出 y 的范围
                  i = (k * width + x) * 4;
                  r += pixes[i] * gaussMatrix[j + radius];
                  g += pixes[i + 1] * gaussMatrix[j + radius];
                  b += pixes[i + 2] * gaussMatrix[j + radius];
                  // a += pixes[i + 3] * gaussMatrix[j];
                  gaussSum += gaussMatrix[j + radius];
              }
          }
          i = (y * width + x) * 4;
          pixes[i] = r / gaussSum;
          pixes[i + 1] = g / gaussSum;
          pixes[i + 2] = b / gaussSum;
      }
  }
  console.log(imgData);
  return imgData;
}

const download = blob => {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = Math.random().toString(36).substr(2,14);
  a.click();
  URL.revokeObjectURL(a.href);                
}

  const fileButtonProps = {
    onRemove: file => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: file => {
      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const switch12 = () => {
    let temp = myVideoRef.current;
    myVideoRef.current.srcObject = videoRef2.current.srcObject
    myVideoRef.current.play()
    myVideoRef.current.volume = 0.0;
    videoRef2.current.srcObject = temp.srcObject
    videoRef2.current.play()
    videoRef2.current.volume = 0.0;
  }

  const switch13 = () => {
    let temp = myVideoRef.current;
    myVideoRef.current.srcObject = videoRef3.current.srcObject
    myVideoRef.current.play()
    myVideoRef.current.volume = 0.0;
    videoRef3.current.srcObject = temp.srcObject
    videoRef3.current.play()
    videoRef3.current.volume = 0.0;
  }

  const switch14 = () => {
    let temp = myVideoRef.current;
    myVideoRef.current.srcObject = videoRef4.current.srcObject
    myVideoRef.current.play()
    myVideoRef.current.volume = 0.0;
    videoRef4.current.srcObject = temp.srcObject
    videoRef4.current.play()
    videoRef4.current.volume = 0.0;
  }

  const menu = (
    <Menu>
      <Menu.Item key="5" onClick={() => msgSend(1)}>向用户名为a的用户发送私信</Menu.Item>
      <Menu.Item key="6" onClick={() => msgSend(2)}>向整个房间发送信息</Menu.Item>
      <Menu.Item key="7" onClick={() => msgSend(3)}>向所有房间发送信息</Menu.Item>
    </Menu>
  );
  //截图功能菜单
  const menu_shoot = (
    <Menu>
      <Menu.Item key="1" onClick={() => shoot_reverse(1)}>反色(负片)效果</Menu.Item>
      <Menu.Item key="2" onClick={() => shoot_cnn(1)}>边缘检测</Menu.Item>
      <Menu.Item key="3" onClick={() => shoot_gray(1)}>去色效果</Menu.Item>
      <Menu.Item key="4" onClick={() => shoot_bool(1)}>版画（二值化）</Menu.Item>
      <Menu.Item key="5" onClick={() => shoot_gaussBlur(1)}>高斯模糊</Menu.Item>
    </Menu>
  );
  const menu_shoot2 = (
    <Menu>
      <Menu.Item key="1" onClick={() => shoot_reverse(2)}>反色(负片)效果</Menu.Item>
      <Menu.Item key="2" onClick={() => shoot_cnn(2)}>边缘检测</Menu.Item>
      <Menu.Item key="3" onClick={() => shoot_gray(2)}>去色效果</Menu.Item>
      <Menu.Item key="4" onClick={() => shoot_bool(2)}>版画（二值化）</Menu.Item>
      <Menu.Item key="5" onClick={() => shoot_gaussBlur(2)}>高斯模糊</Menu.Item>
    </Menu>
  );
  const menu_shoot3 = (
    <Menu>
      <Menu.Item key="1" onClick={() => shoot_reverse(3)}>反色(负片)效果</Menu.Item>
      <Menu.Item key="2" onClick={() => shoot_cnn(3)}>边缘检测</Menu.Item>
      <Menu.Item key="3" onClick={() => shoot_gray(3)}>去色效果</Menu.Item>
      <Menu.Item key="4" onClick={() => shoot_bool(3)}>版画（二值化）</Menu.Item>
      <Menu.Item key="5" onClick={() => shoot_gaussBlur(3)}>高斯模糊</Menu.Item>
    </Menu>
  );
  const menu_shoot4 = (
    <Menu>
      <Menu.Item key="1" onClick={() => shoot_reverse(4)}>反色(负片)效果</Menu.Item>
      <Menu.Item key="2" onClick={() => shoot_cnn(4)}>边缘检测</Menu.Item>
      <Menu.Item key="3" onClick={() => shoot_gray(4)}>去色效果</Menu.Item>
      <Menu.Item key="4" onClick={() => shoot_bool(4)}>版画（二值化）</Menu.Item>
      <Menu.Item key="5" onClick={() => shoot_gaussBlur(4)}>高斯模糊</Menu.Item>
    </Menu>
  );

  return (
    <div className="home-chat">
      <Layout>
        <Header>
          <div style={{ display: 'inline-flex' }}>
            <Title level={2} style={{ marginTop: 10 }}>Chat Room</Title>
          </div>
          <div style={{ float: 'right' }}>
            <Avatar style={{ backgroundColor: '#0078ff', verticalAlign: 'middle' }} size="large" gap={4}>
              {getQueryString('username')}
            </Avatar>
          </div>
        </Header>
        <Layout>
          <Content>
            <div className="site-layout-content-left">
              <div id='canvas-div' style={{position:'absolute', zIndex:999}}><canvas id='canvas1'/></div>
              <video autoPlay ref={myVideoRef} height='100%' />
			        <video style={{ display: 'block'|'inline-flex'}} autoPlay ref={playVideoRef} height='100%'/>
            </div>
            <div className="site-layout-content-left">
              <Row>
                <Col span={18}>
                  <div>
                    <TextArea readOnly value={msg} />
                  </div>
                  <div style={{ marginTop: 5 }}>
                    <Search
                      placeholder="输入文字"
                      enterButton="发送"
                      size="middle"
                      value={myInput}
                      onChange={e => {
                        console.log('Input box value update', e.target.value);
                        setMyInput(e.target.value);
                      }}
                      onSearch={value => {
                        if (value === '') {
                          return;
                        }
                        setMsg(msg + '\nme:' + value);
                        rtc.broadcast(value);
                        console.log('msg sent', value);
                        setMyInput('');
                      }}
                    />
                  </div>
                </Col>
                <Col span={6} id="button-list">
                  <Row>
                    <Col span={24}><Button onClick={() => showInfo()}>用户和聊天室信息</Button></Col>
                    <Col span={12}><Upload {...fileButtonProps}><Button>选择文件</Button></Upload></Col>
                    <Col span={12}><Button onClick={() => uploadFile()}>上传文件</Button></Col>
                    <Col span={12}><Button onClick={() => share()}>分享</Button></Col>
                    <Col span={12}><Button onClick={() => showEffect()}>特效互动</Button></Col>
                    <Col span={12}><Button onClick={() => login()}>人脸登录</Button></Col>
                    <Col span={12}><Button onClick={() => stream_change(true)}>共享桌面</Button></Col>
                    <Col span={12}><Button onClick={() => stream_change(false)}>共享摄像头</Button></Col>
                    <Col span={12}><Button onClick={() => stream_change(false)}>共享摄像头</Button></Col>
                    <Col span={24}><Button onClick={() => exchange()}>切换视频录制按钮</Button></Col>
                    <Col span={12}>
                      {!recording && flagVideo && <Button onClick={() => record()}>开始录制</Button>}
                      {recording && flagVideo && <Button type="dashed" icon={<PoweroffOutlined />} onClick={() => stopRecording()}>停止录制</Button>}
                      {!recording2 && flagVideo2 && <Button onClick={() => record2()}>开始录制2</Button>}
                      {recording2 && flagVideo2 && <Button type="dashed" icon={<PoweroffOutlined />} onClick={() => stopRecording2()}>停止录制2</Button>}
                      {!recording3 && flagVideo3 && <Button onClick={() => record3()}>开始录制3</Button>}
                      {recording3 && flagVideo3 && <Button type="dashed" icon={<PoweroffOutlined />} onClick={() => stopRecording3()}>停止录制3</Button>}
                      {!recording4 && flagVideo4 && <Button onClick={() => record4()}>开始录制4</Button>}
                      {recording4 && flagVideo4 && <Button type="dashed" icon={<PoweroffOutlined />} onClick={() => stopRecording4()}>停止录制4</Button>}
                    </Col>
                    <Col span={12}>
                      {flagVideo && <Button onClick={() => saveRecord()} disabled={!recorded}>保存录制</Button>}
                      {flagVideo2 && <Button onClick={() => saveRecord2()} disabled={!recorded2}>保存录制2</Button>}
                      {flagVideo3 && <Button onClick={() => saveRecord3()} disabled={!recorded3}>保存录制3</Button>}
                      {flagVideo4 && <Button onClick={() => saveRecord4()} disabled={!recorded4}>保存录制4</Button>}
                    </Col>
                    <Col span={12}>
                      <Button onClick={() => changePlayVideo()}>切换预览视频按钮</Button></Col>
                    <Col span={12}>
                      {flagPlayVideo && <Button onClick={() => playVideo()}>预览录制窗口</Button>}
                      {flagPlayVideo2 && <Button onClick={() => playVideo2()}>预览录制窗口2</Button>}
                      {flagPlayVideo3 && <Button onClick={() => playVideo3()}>预览录制窗口3</Button>}
                      {flagPlayVideo4 && <Button onClick={() => playVideo4()}>预览录制窗口4</Button>}
                    </Col>
                    <Col span={12}>
                      <Button onClick={() => changeFilterWindow()}>切换滤镜窗口</Button>
                    </Col>
                    <Col span={12}>
                      {flagVideoFilter && <Button onClick={() => changeVideoFilter()}>切换视频滤镜</Button>}
                      {flagVideoFilter2 && <Button onClick={() => changeVideoFilter2()}>切换视频2滤镜</Button>}
                      {flagVideoFilter3 && <Button onClick={() => changeVideoFilter3()}>切换视频3滤镜</Button>}
                      {flagVideoFilter4 && <Button onClick={() => changeVideoFilter4()}>切换视频4滤镜</Button>}
                    </Col>
                    <Col span={12}>
                      <Button onClick={() => changeShootWindow()}>切换特效截图窗口</Button>
                    </Col>
                    <Col span={12}>
                    {flagVideoShoot && <Dropdown overlay={menu_shoot} placement="topLeft"><Button style={{ marginTop: 5, float: 'right' }}>特效截图<UpOutlined /></Button></Dropdown>}
                    {flagVideoShoot2 && <Dropdown overlay={menu_shoot2} placement="topLeft"><Button style={{ marginTop: 5, float: 'right' }}>特效截图2<UpOutlined /></Button></Dropdown>}
                    {flagVideoShoot3 && <Dropdown overlay={menu_shoot3} placement="topLeft"><Button style={{ marginTop: 5, float: 'right' }}>特效截图3<UpOutlined /></Button></Dropdown>}
                    {flagVideoShoot4 && <Dropdown overlay={menu_shoot4} placement="topLeft"><Button style={{ marginTop: 5, float: 'right' }}>特效截图4<UpOutlined /></Button></Dropdown>}
                    </Col>
                    <Col span={24}>
                      <Dropdown overlay={menu} placement="topLeft"><Button style={{ marginTop: 5, float: 'right' }}>更多功能<UpOutlined /></Button></Dropdown>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </div>
          </Content>
          <Sider width='360'>
            <div style={{ marginTop: 2 }}>
              <div className="site-layout-content-right" onDoubleClick={switch12}>
                <div className="canvas-div-others" style={{position:'absolute', zIndex:999}}><canvas id='canvas2'/></div>
                <video autoPlay ref={videoRef2} />
              </div>
              <div className="site-layout-content-right" onDoubleClick={switch13}>
                <div className="canvas-div-others" style={{position:'absolute', zIndex:999}}><canvas id='canvas3'/></div>
                <video autoPlay ref={videoRef3} />
              </div>
              <div className="site-layout-content-right" onDoubleClick={switch14}>
                <div className="canvas-div-others" style={{position:'absolute', zIndex:999}}><canvas id='canvas4'/></div>
                <video autoPlay ref={videoRef4} />
              </div>
            </div>
          </Sider>
        </Layout>
      </Layout>

      <Modal
        title="Modal"
        visible={confirmModalVisible}
        onOk={hideModal}
        onCancel={hideModal}
        okText="确认"
        cancelText="取消"
      >
        <p>敬请期待</p>
      </Modal>
      <Modal
        title="Modal"
        visible={confirmFileModalVisible}
        onOk={confirmToReceiveFile}
        onCancel={hideFileModal}
        okText="接收"
        cancelText="拒绝"
      >
        <p>{fileModalMessage}</p>
      </Modal>
      <Modal
        title="Modal"
        visible={recordModalVisible}
        onOk={() => {
          // alert("已进入switch:"+n);
          showRecordModal(false);
          switch (n) {
            case 1:
                console.log('recorderFile', recorderFile);
                const a = document.createElement('a');
                a.href = URL.createObjectURL(recorderFile)
                a.download = `MSE-${(new Date).toISOString().replace(/:|\./g, '-')}.mp4`;
                a.click();
                URL.revokeObjectURL(a.href);
                break;
            case 2:
                console.log('recorderFile2', recorderFile2);
                const a2 = document.createElement('a');
                a2.href = URL.createObjectURL(recorderFile2)
                a2.download = `MSE-${(new Date).toISOString().replace(/:|\./g, '-')}.mp4`;
                a2.click();
                URL.revokeObjectURL(a2.href);
                break;
            case 3:
                console.log('recorderFile3', recorderFile3);
                const a3 = document.createElement('a');
                a3.href = URL.createObjectURL(recorderFile3)
                a3.download = `MSE-${(new Date).toISOString().replace(/:|\./g, '-')}.mp4`;
                a3.click();
                URL.revokeObjectURL(a3.href);
                break;
            case 4:
                console.log('recorderFile4', recorderFile4);
                const a4 = document.createElement('a');
                a4.href = URL.createObjectURL(recorderFile4)
                a4.download = `MSE-${(new Date).toISOString().replace(/:|\./g, '-')}.mp4`;
                a4.click();
                URL.revokeObjectURL(a4.href);
                break;
            default:
          }
            
        }}
        onCancel={() => showRecordModal(false)}
      >
        <p>确认要下载视频吗</p>
      </Modal>
    </div>
  );
};

Chat.propTypes = {};
Chat.defaultProps = {};
