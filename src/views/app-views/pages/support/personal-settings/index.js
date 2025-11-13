import React from 'react';
import { Card, Result } from 'antd';
import { SettingOutlined } from '@ant-design/icons';

const PersonalSettings = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<SettingOutlined style={{ fontSize: '72px', color: '#722ed1' }} />}
          title="Personal Settings"
          subTitle="Manage your personal preferences and settings"
          status="info"
        />
      </Card>
    </div>
  );
};

export default PersonalSettings;
