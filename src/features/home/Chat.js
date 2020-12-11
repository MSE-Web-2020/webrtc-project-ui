import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Col, Dropdown, Input, Layout, Menu, Row, Typography, Modal, Button } from 'antd';
import { SkyRTC } from './webrtc/SkyRTC-client';
import { enhance } from './webrtc/enhance';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Search } = Input;

var rtc = SkyRTC()
for (let i in enhance) rtc.prototype[i] = enhance[i]
rtc = new rtc()

export default function Chat() {

  const myVideoRef = useRef(null);
  const videoRef2 = useRef(null);
  const videoRef3 = useRef(null);
  const videoRef4 = useRef(null);
  const refUseMap = {};

  const [myInput, setMyInput] = useState('');
  const [msg, setMsg] = useState('');
  const [confirmModalVisible, setConfirmModalVisible] = useState(false);

  useEffect(() => {
    let url = new URL(window.location.href), port = '443';
    rtc.connect(`wss:${url.hostname}:${port}${url.search}`, url.hash);
    rtc.on('connected', () => {
      console.log('websocket connected');
      rtc.createStream({ 'video': true, 'audio': true });
    });
    rtc.on('not_login', () => {
        login()
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
    rtc.on('one_mate', message =>alert(`来自 ${message.src} 的私信：\n${message.data}`));
    rtc.on('all_mate', message => {
      switch(message.mode){
        case 'text':
          setMsg(`${msg}\n房间推送信息: ${message.data}`)
          break
        case 'effect':
          break
        default:
          break
      }
    });
    rtc.on('all_room', message => {
      switch(message.mode){
        case 'text':
          setMsg(`${msg}\n系统推送信息: ${message.data}`)
          break
        case 'effect':
          break
        default:
          break
      }
    });
  }, [msg]);

  useEffect(() => {
    rtc.on('pc_add_stream', (stream, socketId) => {
      for (let i of [2, 3, 4]) {
        let video = eval(`videoRef${i}.current`)
        if (video && !!!video.srcObject){
          video.srcObject = stream
          let vp = video.play()
          if (vp !== undefined) vp.then(()=>video.play()).catch(()=>{})
          video.volume = 0.0
          refUseMap[socketId] = `videoRef${i}`
          break
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
      eval(`${refUseMap[id]}.current.srcObject = null`)
      rtc.createPeerConnection(id)
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
    rtc.on('receive_file_chunk', (sendId, socketId, fileName, percent)=>{

    });
    rtc.on('receive_file', (sendId, socketId, name)=>{

    });
    rtc.on('send_file_error', () => {

    });
    rtc.on('send_file_error', err=>console.log(err));
    rtc.on('receive_file_error', err=>console.log(err));
    rtc.on('receive_file_ask', (sendId, socketId, fileName, fileSize)=>{

    });
  }, []);

  const menu = (
    <Menu>
      <Menu.Item key="1" onClick={() => showInfo()}>用户和聊天室信息</Menu.Item>
      <Menu.Item key="2" onClick={() => showEffect()}>特效互动</Menu.Item>
      <Menu.Item key="3" onClick={() => share()}>分享</Menu.Item>
      <Menu.Item key="4" onClick={() => chooseFile()}>选择文件</Menu.Item>
      <Menu.Item key="5" onClick={() => uploadFile()}>上传文件</Menu.Item>
      <Menu.Item key="6" onClick={() => msgSend(1)}>向用户名为a的用户发送私信</Menu.Item>
      <Menu.Item key="7" onClick={() => msgSend(2)}>向整个房间发送信息</Menu.Item>
      <Menu.Item key="8" onClick={() => msgSend(3)}>向所有房间发送信息</Menu.Item>
      <Menu.Item key="9" onClick={() => login()}>人脸登录</Menu.Item>
      <Menu.Item key="10" onClick={() => stream_change(true)}>共享桌面</Menu.Item>
      <Menu.Item key="11" onClick={() => stream_change(false)}>共享摄像头</Menu.Item>
    </Menu>
  );

  const msgSend = mode => {
    switch(mode){
      case 1:
        rtc.one_mate({dst:'a',data:'一对一私信'})
        break
      case 2:
        rtc.all_mate({mode:'text',data:'向房间成员发送通知'})
        break
      case 3:
        rtc.all_room({mode:'text',data:'向全体成员发送通知'})
        break
      default:
    }
  };

  const login = () => {
    window.location.href = '/login.html'
  }

  const stream_change = mode => {
    let success = stream => {
        rtc.localMediaStream = stream
        rtc.emit("stream_created", stream)
        rtc.socket.send(JSON.stringify({eventName:"stream_change"}))
        rtc.emit('ready')
    },
    error = e => console.log(e),
    options = {video: true, audio: true }
    mode?navigator.mediaDevices.getDisplayMedia(options).then(success).catch(error)
        :navigator.mediaDevices.getUserMedia(options).then(success).catch(error)
  }

  const showInfo = () => {
    showModal()
  };

  const showEffect = () => {
    showModal()
  };

  const share = () => {
    rtc.shareFile('fileIpt');
  };

  const chooseFile = () => {
    showModal()
  };

  const uploadFile = () => {
    showModal()
  };

  const showModal = () => {
    setConfirmModalVisible(true)

  };

  const hideModal = () => {
    setConfirmModalVisible(false)
  };

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
              <div>
                <TextArea readOnly value={msg} />
              </div>
              <Row>
                <Col span={18}>
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
                <Col span={6}>
                  <Dropdown overlay={menu} placement="topLeft" ><Button style={{ marginTop: 5, float: 'right' }}>更多功能</Button></Dropdown>
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
    </div>
  );
};

Chat.propTypes = {};
Chat.defaultProps = {};
