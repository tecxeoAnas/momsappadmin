import React from 'react';
import { Card, Result } from 'antd';
import { ShopOutlined } from '@ant-design/icons';

const BusinessHQ = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<ShopOutlined style={{ fontSize: '72px', color: '#13c2c2' }} />}
          title="Business HQ"
          subTitle="This module is under development. Coming soon!"
          status="info"
        />
      </Card>
    </div>
  );
};

export default BusinessHQ;
