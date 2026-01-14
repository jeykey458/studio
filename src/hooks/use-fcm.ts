'use client';

import { useEffect, useState } from 'react';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { useFirebase } from '@/firebase/provider';

export function useFCM() {
  const { firebaseApp } = useFirebase();
  const [fcmToken, setFcmToken] = useState<string | null>(null);
  const [notificationPermissionStatus, setNotificationPermissionStatus] = useState<NotificationPermission | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator && firebaseApp) {
      if (notificationPermissionStatus === null) {
        setNotificationPermissionStatus(Notification.permission);
      }
    }
  }, [firebaseApp, notificationPermissionStatus]);

  const requestPermission = async () => {
    if (!firebaseApp) return;
    try {
      const permission = await Notification.requestPermission();
      setNotificationPermissionStatus(permission);
      if (permission === 'granted') {
        await retrieveToken();
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const retrieveToken = async () => {
     if (!firebaseApp) return;
    try {
      const messaging = getMessaging(firebaseApp);
      const currentToken = await getToken(messaging, { vapidKey: 'YOUR_VAPID_KEY' }); // Replace with your VAPID key
      if (currentToken) {
        setFcmToken(currentToken);
        // Here you would typically send this token to your server
        // to associate it with the current user.
        console.log('FCM Token:', currentToken);
      } else {
        console.log('No registration token available. Request permission to generate one.');
      }
    } catch (error) {
      console.error('An error occurred while retrieving token. ', error);
    }
  };

  useEffect(() => {
    // Retrieve token if permission is already granted
    if (notificationPermissionStatus === 'granted') {
      retrieveToken();
    }
  }, [notificationPermissionStatus, firebaseApp]);

  useEffect(() => {
    if (firebaseApp) {
        const messaging = getMessaging(firebaseApp);
        const unsubscribe = onMessage(messaging, (payload) => {
            console.log('Foreground message received.', payload);
            // Here you could display a toast or other in-app notification
        });
        return () => unsubscribe();
    }
  }, [firebaseApp]);

  return { fcmToken, notificationPermissionStatus, requestPermission };
}
