import React from 'react';
import { Card, Result, Button } from 'antd';
import { MessageOutlined } from '@ant-design/icons';

const FeedbackForm = () => {
  return (
    <div style={{ padding: '50px' }}>
      <Card>
        <Result
          icon={<MessageOutlined style={{ fontSize: '72px', color: '#faad14' }} />}
          title="Feedback Form"
          subTitle="Share your feedback and suggestions with us"
          extra={
            <Button type="primary" size="large">
              Submit Feedback
            </Button>
          }
        />
      </Card>
    </div>
  );
};

export default FeedbackForm;
