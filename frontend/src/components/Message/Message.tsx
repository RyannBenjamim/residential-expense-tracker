import styles from './styles.module.css';

type MessageType = 'error' | 'info' | 'success';

interface MessageProps {
  text: string;
  type?: MessageType;
}

export const Message: React.FC<MessageProps> = ({ text, type = 'info' }) => {
  if (!text) return null;

  const icons = {
    error: 'fa-solid fa-circle-exclamation',
    info: 'fa-solid fa-circle-info',
    success: 'fa-solid fa-circle-check',
  };

  return (
    <div className={`${styles.message_box} ${styles[type]}`}>
      <i className={icons[type]}></i>
      <span>{text}</span>
    </div>
  );
};

export default Message;