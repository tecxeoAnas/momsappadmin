import React from 'react';
import { Card, Result } from 'antd';
import { HeartOutlined } from '@ant-design/icons';

const HabitsHQ = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<HeartOutlined style={{ fontSize: '72px', color: '#eb2f96' }} />}
          title="Habits HQ"
          subTitle="This module is under development. Coming soon!"
          status="info"
        />
      </Card>
    </div>
  );
};

export default HabitsHQ;
