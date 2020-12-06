import { SkyRTC } from './SkyRTC-client';
import { useSetMsg } from '../redux/hooks';
import { useSelector } from 'react-redux';


let rtc = SkyRTC();
//广播消息
// $('#sendBtn').click(() => {
//   rtc.broadcast($('#msgIpt').val());
//   $('<p>').text('me: ' + $('#msgIpt').val()).appendTo('#msgs');
//   $('#msgIpt').val('');
// });
//分享文件
// $('#sendFileBtn').click(()=>rtc.shareFile("fileIpt"));
//对方同意接收文件
rtc.on('send_file_accepted', (sendId, socketId, file) => $(`#sf-${sendId}`).text('对方接收' + file.name + '文件，等待发送'));
//对方拒绝接收文件
rtc.on('send_file_refused', (sendId, socketId, file) => $(`#sf-${sendId}`).text('对方拒绝接收' + file.name + '文件'));
//请求发送文件
rtc.on('send_file', (sendId, socketId, file) => $('<p>').text('请求发送' + file.name + '文件').attr('id', `#sf-${sendId}`).appendTo('#files'));
//文件发送成功
rtc.on('sended_file', (sendId, socketId, file) => $(`#sf-${sendId}`).remove());
//发送文件碎片
rtc.on('send_file_chunk', (sendId, socketId, percent, file) => $(`#sf-${sendId}`).text(`${file.name}文件正在发送:${Math.ceil(percent)}%`));
//接受文件碎片
rtc.on('receive_file_chunk', (sendId, socketId, fileName, percent) => $(`#rf-${sendId}`).text(`正在接收${fileName}文件：${Math.ceil(percent)}%`));
//接收到文件
rtc.on('receive_file', (sendId, socketId, name) => $(`#rf-${sendId}`).remove());
//发送文件时出现错误
rtc.on('send_file_error', err => console.log(err));
//接收文件时出现错误
rtc.on('receive_file_error', err => console.log(err));
//接受到文件发送请求
rtc.on('receive_file_ask', (sendId, socketId, fileName, fileSize) => {
  window.confirm(`${socketId}用户想要给你传送${fileName}文件，大小${fileSize}KB,是否接受？`)
    ? (rtc.sendFileAccept(sendId), $('<p>').text('准备接收' + fileName + '文件').attr('id', `rf-${sendId}`).appendTo('#files'))
    : rtc.sendFileRefuse(sendId);
});
//成功创建WebSocket连接
rtc.on('connected', socket => rtc.createStream({ 'video': true, 'audio': true }));
//创建本地视频流成功
rtc.on('stream_created', stream => {
  $('#me')[0].srcObject = stream;
  $('#me')[0].play();
  $('#me')[0].volume = 0.0;
///////////////////////////HWL///////////////////////////
  mediaRecorder = new MediaRecorder(stream);
  mediaStream = stream;
  var chunks = [],
    startTime = 0;
  mediaRecorder.ondataavailable = function(e) {
    mediaRecorder.blobs.push(e.data);
    chunks.push(e.data);
  };
  mediaRecorder.blobs = [];

  mediaRecorder.onstop = function(e) {
    recorderFile = new Blob(chunks, {
      'type': mediaRecorder.mimeType,
    });
    chunks = [];
    if (null != stopRecordCallback) {
      stopRecordCallback();
    }
  };
//////////////////////END HWL/////////////////////////////
});
//创建本地视频流失败
rtc.on('stream_create_error', () => alert('create stream failed!'));
//接收到其他用户的视频流
rtc.on('pc_add_stream', (stream, socketId) => {
  var id = 'other-' + socketId;
  $('<video>').attr({ id: id, class: 'other', autoplay: 'autoplay' }).appendTo('#videos');
  rtc.attachStream(stream, id);
});
//删除其他用户
rtc.on('remove_peer', socketId => $(`#other-${socketId}`).remove());
//接收到文字信息



rtc.on('data_channel_message', (channel, socketId, message) => $('<p>').text(`${socketId}: ${message}`).appendTo('#msgs'));
//连接WebSocket服务器
rtc.connect('wss:' + window.location.href.substring(window.location.protocol.length).split('#')[0] + '/wss', window.location.hash.slice(1));