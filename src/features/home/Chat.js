import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Button, Col, Input, Layout, Modal, Row, Typography, Upload, Dropdown, Menu } from 'antd';
import { SkyRTC } from './webrtc/SkyRTC-client';
import { enhance } from './webrtc/enhance';
import { UpOutlined, PoweroffOutlined } from '@ant-design/icons';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Search } = Input;

var n1 = 1;
var n2 = 1;
var n3 = 1;
var n4 = 1;

var rtc = SkyRTC();
for (let i in enhance) rtc.prototype[i] = enhance[i];
rtc = new rtc();
let mediaRecorder;
let recorderFile;

export default function Chat() {

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
  const [recording, setRecording] = useState(false);
  const [recorded, setRecorded] = useState(false);
  const [fileList, setFileList] = useState([]);


  useEffect(() => {
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

////////////////////// HWL //////////////////////////////
  const record_oneVideo = mode => {
    switch (mode) {
      case 1:
        let buffer = [];
        mediaRecorder = new MediaRecorder(myVideoRef.current.srcObject);
        mediaRecorder.ondataavailable = e => buffer.push(e.data);
        mediaRecorder.onstop = e => {
          recorderFile = new Blob(buffer, { 'type': 'video/mp4' });
          buffer = [];
          alert('录制成功!');
        };
        mediaRecorder.start();
        n1++;
        break;
      case 2:
        stop_record_oneVideo();
        n1--;
        break;
      default:
    }
  };
  const stop_record_oneVideo = () => {
    mediaRecorder.stop();
    myVideoRef.current.css('border', '3px solid black');
    save_record_oneVideo();
  };
  const save_record_oneVideo = () => {
    alert('即将保存当前录制myVideo窗口内容...');
    var file = new File([recorderFile], 'MSE-' + (new Date).toISOString().replace(/:|\./g, '-') + '.mp4', {
      type: 'video/mp4',
    });

    // $('<a>').attr({
    //   'href':window.URL.createObjectURL(recorderFile),
    //   'download':`MSE-${(new Date).toISOString().replace(/:|\./g,'-')}.mp4`,
    // }).appendTo('body').bind('click',function(){this.click()}).click().remove()
  };

  const record_twoVideo = mode => {

  };
  const stop_record_twoVideo = () => {

  };

  const record_threeVideo = mode => {

  };
  const stop_record_threeVideo = () => {

  };

  const record_fourVideo = mode => {

  };
  const stop_record_fourVideo = () => {

  };
//////////////////////// END HWL ///////////////////////////////////

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

  const record = () => {
    setRecording(true);
    let buffer = [];
    mediaRecorder = new MediaRecorder(myVideoRef.current.srcObject);
    mediaRecorder.ondataavailable = e => buffer.push(e.data);
    mediaRecorder.onstop = e => {
      recorderFile = new Blob(buffer, { 'type': 'video/mp4' });
      buffer = [];
      console.log('录制成功!');
      setRecorded(true);
    };
    mediaRecorder.start();
  };

  const stopRecording = () => {
    setRecording(false);
    if (mediaRecorder) {
      mediaRecorder.stop();
    }
  };

  const saveRecord = () => {
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

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => record_oneVideo(n1)}>录制/保存我的窗口视频</Menu.Item>
      <Menu.Item key="2" onClick={() => record_twoVideo(n2)}>录制/保存二号窗口视频</Menu.Item>
      <Menu.Item key="3" onClick={() => record_threeVideo(n3)}>录制/保存三号窗口视频</Menu.Item>
      <Menu.Item key="4" onClick={() => record_fourVideo(n4)}>录制/保存四号窗口视频</Menu.Item>
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
              帅
            </Avatar>
          </div>
        </Header>
        <Layout>
          <Content>
            <div className="site-layout-content-left">
              <video autoPlay ref={myVideoRef} height='100%' />
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
                    <Col span={12}>
                      {!recording && <Button onClick={() => record()}>开始录制</Button>}
                      {recording &&
                      <Button type="dashed" icon={<PoweroffOutlined />} onClick={() => stopRecording()}>停止录制</Button>}
                    </Col>
                    <Col span={12}><Button onClick={() => saveRecord()} disabled={!recorded}>保存录制</Button></Col>
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
              <div className="site-layout-content-right">
                <video autoPlay ref={videoRef2} />
              </div>
              <div className="site-layout-content-right">
                <video autoPlay ref={videoRef3} />
              </div>
              <div className="site-layout-content-right">
                <video autoPlay ref={videoRef4} />
              </div>
            </div>
          </Sider>;
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
      </Modal>;
      <Modal
        title="Modal"
        visible={confirmFileModalVisible}
        onOk={confirmToReceiveFile}
        onCancel={hideFileModal}
        okText="接收"
        cancelText="拒绝"
      >
        <p>{fileModalMessage}</p>
      </Modal>;
      <Modal
        title="Modal"
        visible={recordModalVisible}
        onOk={() => {
          console.log('recorderFile', recorderFile);
          const a = document.createElement('a');
          a.href = URL.createObjectURL(recorderFile)
          a.download = `MSE-${(new Date).toISOString().replace(/:|\./g, '-')}.mp4`;
          a.click();
          URL.revokeObjectURL(a.href);
        }}
        onCancel={() => showRecordModal(false)}
      >
        <p>确认要下载视频吗</p>
      </Modal>;
    </div>
  );
};

Chat.propTypes = {};
Chat.defaultProps = {};
