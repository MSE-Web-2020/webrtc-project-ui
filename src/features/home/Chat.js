import React, { useEffect, useState } from 'react';
// import PropTypes from 'prop-types';
import { Avatar, Col, Dropdown, Input, Layout, Menu, Row, Typography } from 'antd';
import { SkyRTC } from './webrtc/SkyRTC-client';
import { useSetMsg } from './redux/setMsg';
import { useSelector } from 'react-redux';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;
const { TextArea } = Input;
const { Search } = Input;

const rtc = SkyRTC();

export default function Chat() {

  const [myInput, setMyInput] = useState('');

  const { setMsg } = useSetMsg();
  let chatMsg = useSelector(state => state.home.chatMsg)

  useEffect(() => {
    console.log('componentDidMount');
    //成功创建WebSocket连接
    rtc.on('connected', () => {
      console.log('websocket connected');
      rtc.createStream({ 'video': true, 'audio': true });
    });
    //创建本地视频流成功
    rtc.on('stream_created', stream => {

    });
    //创建本地视频流失败
    rtc.on('stream_create_error', () => alert('create stream failed!'));
    //接收到其他用户的视频流
    rtc.on('pc_add_stream', (stream, socketId) => {
      var id = 'other-' + socketId;
      // $('<video>').attr({ id: id, class: 'other', autoplay: 'autoplay' }).appendTo('#videos');
      // rtc.attachStream(stream, id);
    });
    //删除其他用户
    // rtc.on('remove_peer', socketId => $(`#other-${socketId}`).remove());
    //接收到文字信息
    rtc.on('data_channel_message', (channel, socketId, message) => {
      console.log('channel', channel);
      console.log('socketId', socketId);
      console.log('message', message);
      setMsg(message)
    });
    //连接WebSocket服务器
    rtc.connect('wss://localhost/wss', window.location.hash.slice(1));

  }, [setMsg]);

  const menu = (
    <Menu>
      <Menu.Item key="1">用户和聊天室信息</Menu.Item>
      <Menu.Item key="2">特效互动</Menu.Item>
      <Menu.Item key="3">分享</Menu.Item>
      <Menu.Item key="4">选择文件</Menu.Item>
      <Menu.Item key="5">上传文件</Menu.Item>
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
            <div className="site-layout-content-left">Video</div>
            <div className="site-layout-content-left">
              <div>
                <TextArea readOnly value={chatMsg} />
              </div>
              <Row>
                <Col span={18}>
                  <div style={{ marginTop: 5 }}>
                    <Search
                      placeholder="input your text"
                      allowClear
                      enterButton="Send"
                      size="middle"
                      value={myInput}
                      onChange={e => {
                        setMyInput(e.target.value);
                      }}
                      onSearch={value => {
                        rtc.broadcast(value);
                        console.log('msg sent', value);
                      }}

                    />
                  </div>
                </Col>
                <Col span={6}>
                  <Dropdown.Button overlay={menu} style={{ marginTop: 5, float: 'right' }}
                                   size='middle'>More</Dropdown.Button>
                </Col>
              </Row>

            </div>
          </Content>
          <Sider>
            <div className="site-layout-content-right">Video</div>
            <div className="site-layout-content-right">Video</div>
            <div className="site-layout-content-right">Video</div>
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
};

Chat.propTypes = {};
Chat.defaultProps = {};
