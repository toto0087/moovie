import { createContext, useCallback, useContext, useMemo } from 'react';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const items = useMemo(() => [], []);
  const unreadCount = 0;

  const markAsRead = useCallback(() => {}, []);
  const markAllAsRead = useCallback(() => {}, []);

  const value = useMemo(
    () => ({
      items,
      unreadCount,
      markAsRead,
      markAllAsRead,
    }),
    [items, unreadCount, markAsRead, markAllAsRead]
  );

  return (
    <NotificationsContext.Provider value={value}>{children}</NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe usarse dentro de NotificationsProvider');
  }
  return context;
}
