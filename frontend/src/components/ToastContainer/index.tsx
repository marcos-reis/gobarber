import React from 'react';

import { Container } from './styles';
import { ToastMessage } from '../../hooks/toast';
import Toast from './Toast';

interface ToastContainerprops {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerprops> = ({ messages }) => {
  return (
    <Container>
      {messages &&
        messages.map((message) => <Toast key={message.id} message={message} />)}
    </Container>
  );
};

export default ToastContainer;
