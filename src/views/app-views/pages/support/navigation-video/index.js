import React from 'react';
import { Card, Result } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';

const NavigationVideo = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<PlayCircleOutlined style={{ fontSize: '72px', color: '#1890ff' }} />}
          title="Navigation Video"
          subTitle="Video tutorials coming soon!"
          status="info"
        />
      </Card>
    </div>
  );
};

export default NavigationVideo;
