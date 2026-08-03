import { createContext, useContext, useMemo, useState } from 'react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([
    { id: 1, title: 'New tender requires review', read: false },
    { id: 2, title: 'AI analysis completed', read: false },
    { id: 3, title: 'Document verification flagged', read: true },
  ]);

  const markAllAsRead = () => setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));

  const value = useMemo(() => ({ notifications, markAllAsRead }), [notifications]);

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};

export const useNotifications = () => useContext(NotificationContext);
