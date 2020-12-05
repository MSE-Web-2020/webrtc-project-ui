import React from 'react';
// import PropTypes from 'prop-types';
import { Layout, Typography, Avatar } from 'antd';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

export default function Chat() {
  return (
    <div className="home-chat">
      <Layout>
        <Header>
          <div style={{display: 'inline-flex'}}>
            <Title level={2} style={{marginTop: 10}}>Chat Room</Title>
          </div>
          <div style={{float: 'right'}}>
            <Avatar style={{ backgroundColor: '#0078ff', verticalAlign: 'middle' }} size="large" gap={4}>
              帅
            </Avatar>
          </div>
        </Header>
        <Layout>
          <Content style={{ padding: '0 5px' }}>
            <div className="site-layout-content-left">Content</div>
            <div className="site-layout-content-left">Content</div>
          </Content>
          <Sider>
            <div className="site-layout-content-right">Content</div>
            <div className="site-layout-content-right">Content</div>
            <div className="site-layout-content-right">Content</div>
          </Sider>
        </Layout>

      </Layout>
    </div>
  );
};

Chat.propTypes = {};
Chat.defaultProps = {};
