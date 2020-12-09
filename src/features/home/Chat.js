import React, { useEffect, useRef, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Col, Dropdown, Input, Layout, Menu, Row, Typography, Modal, Button } from 'antd';
import { SkyRTC } from './webrtc/SkyRTC-client';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Search } = Input;

const rtc = SkyRTC();

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
    rtc.connect('wss://localhost?username=dongbeiqing', window.location.hash.slice(1));
    rtc.on('connected', () => {
      console.log('websocket connected');
      rtc.createStream({ 'video': true, 'audio': true });
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
      setMsg(msg + '\n' + socketId + ':' + message);
    });
  }, [msg]);

  useEffect(() => {
    rtc.on('pc_add_stream', (stream, socketId) => {
      let item = refUseMap[socketId];
      if (item != null) {
        return;
      }
      if (videoRef2.current != null && videoRef2.current.srcObject === null) {
        videoRef2.current.srcObject = stream;
        videoRef2.current.play();
        videoRef2.current.volume = 0.0;
        refUseMap[socketId] = 'videoRef2';
      } else if (videoRef3.current != null && videoRef3.current.srcObject === null) {
        videoRef3.current.srcObject = stream;
        videoRef3.current.play();
        videoRef3.current.volume = 0.0;
        refUseMap[socketId] = 'videoRef3';
      } else if (videoRef4.current != null && videoRef4.current.srcObject === null) {
        videoRef4.current.srcObject = stream;
        videoRef4.current.play();
        videoRef4.current.volume = 0.0;
        refUseMap[socketId] = 'videoRef4';
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
    </Menu>
  );

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
