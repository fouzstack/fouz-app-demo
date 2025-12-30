import { useState, useEffect } from 'react';
import { Button } from '@heroui/button';

interface MessageProps {
  message: string;
}

const ToastMessage = ({ message }: MessageProps) => {
  const [showMessage, setShowMessage] = useState(true);
  //@ts-expect-error
  const [duration, setDuration] = useState(3000); // 3000 = 3 seconds

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration]);

  return (
    <Button
      variant='faded'
      className={`bg-white dreamworks-title text-center text-black text-xs mb-4  ${showMessage ? 'visible' : 'hidden'}`}
    >
      {message}
    </Button>
  );
};

export default ToastMessage;
