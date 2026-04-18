import { useApp } from '../context/AppContext.js';

export default function Notification() {
  const { notifications } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map(notif => (
        <div key={notif.id} className={`notification notification-${notif.type}`}>
          <span className="notif-icon-msg">
            {notif.type === 'success' ? '' : notif.type === 'error' ? '' : ''}
          </span>
          {notif.message}
        </div>
      ))}
    </div>
  );
}
