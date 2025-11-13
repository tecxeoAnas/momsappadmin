import React from 'react';
import { Card, Result } from 'antd';
import { WalletOutlined } from '@ant-design/icons';

const WealthHQ = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<WalletOutlined style={{ fontSize: '72px', color: '#faad14' }} />}
          title="Wealth HQ"
          subTitle="This module is under development. Coming soon!"
          status="info"
        />
      </Card>
    </div>
  );
};

export default WealthHQ;
