import React, { useEffect } from 'react';
import {
  FiAlertCircle,
  FiInfo,
  FiCheckCircle,
  FiXCircle,
} from 'react-icons/fi';

import { Container } from './styles';
import { ToastMessage, useToast } from '../../../hooks/toast';

interface ToastMessageProps {
  message: ToastMessage;
}

const icons = {
  info: <FiInfo />,
  error: <FiAlertCircle />,
  success: <FiCheckCircle />,
};

const Toast: React.FC<ToastMessageProps> = ({ message }) => {
  const { removeToast } = useToast();
  useEffect(() => {
    const time = setTimeout(() => {
      removeToast(message.id);
    }, 3000);
    return () => clearTimeout(time);
  }, [message.id, removeToast]);
  return (
    <Container type={message.type} hasDescription={!!message.descripion}>
      {icons[message.type || 'info']}
      <div>
        <strong>{message.title}</strong>
        {message.descripion && <p>{message.descripion}</p>}
      </div>
      <button onClick={() => removeToast(message.id)} type="button">
        <FiXCircle />
      </button>
    </Container>
  );
};

export default Toast;
