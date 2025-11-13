import React from 'react';
import { Card, Result } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';

const AccountBilling = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<CreditCardOutlined style={{ fontSize: '72px', color: '#52c41a' }} />}
          title="Your Account & Billing"
          subTitle="Manage your account and billing information"
          status="info"
        />
      </Card>
    </div>
  );
};

export default AccountBilling;
