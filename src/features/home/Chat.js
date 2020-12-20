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

let playRecorderFile;

var n=0;
var flag=1;
var flagPlay=1;

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

  const [flagStopVideo, setflagStopVideo] = useState("'none'|'inline-flex'");

  const [flagPlayVideo, setflagPlayVideo] = useState(true);
  const [flagPlayVideo2, setflagPlayVideo2] = useState(false);
  const [flagPlayVideo3, setflagPlayVideo3] = useState(false);
  const [flagPlayVideo4, setflagPlayVideo4] = useState(false);

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
        playRecorderFile = new Blob(buffer, { 'type': 'video/mp4' });
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
        playRecorderFile = new Blob(buffer, { 'type': 'video/mp4' });
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
        playRecorderFile = new Blob(buffer, { 'type': 'video/mp4' });
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
    setflagStopVideo("'block'|'inline-flex'");
    if(playRecorderFile != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }
  const playVideo2 = () => {
    setflagStopVideo("'block'|'inline-flex'");
    if(playRecorderFile != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }
  const playVideo3 = () => {
    setflagStopVideo("'block'|'inline-flex'");
    if(playRecorderFile != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile)
      playVideoRef.current.play();
    }else{
      alert("无可预览的存储视频文件！");
    }
  }
  const playVideo4 = () => {
    setflagStopVideo("'block'|'inline-flex'");
    if(playRecorderFile != null){
      playVideoRef.current.src=URL.createObjectURL(playRecorderFile)
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
              <video autoPlay ref={myVideoRef} height='100%' />
			  <video style={{ display: flagStopVideo}} autoPlay ref={playVideoRef} height='100%'/>
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
                    <Col span={24}>
                      <Button onClick={() => changePlayVideo()}>点击切换预览视频按钮</Button></Col>
                    <Col span={24}>
                      {flagPlayVideo && <Button onClick={() => playVideo()}>预览录制视频</Button>}
                      {flagPlayVideo2 && <Button onClick={() => playVideo2()}>预览录制视频2</Button>}
                      {flagPlayVideo3 && <Button onClick={() => playVideo3()}>预览录制视频3</Button>}
                      {flagPlayVideo4 && <Button onClick={() => playVideo4()}>预览录制视频4</Button>}
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
                <video autoPlay ref={videoRef2} />
              </div>
              <div className="site-layout-content-right" onDoubleClick={switch13}>
                <video autoPlay ref={videoRef3} />
              </div>
              <div className="site-layout-content-right" onDoubleClick={switch14}>
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
