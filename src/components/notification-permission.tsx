'use client';

import { Bell, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { useFCM } from '@/hooks/use-fcm';

interface NotificationPermissionProps {
  onClose: () => void;
}

export default function NotificationPermission({ onClose }: NotificationPermissionProps) {
  const { requestPermission } = useFCM();

  const handleEnableNotifications = () => {
    requestPermission();
    onClose();
  };

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle className="text-lg text-blue-900">Enable Flood Alerts</CardTitle>
              <CardDescription className="text-blue-700">
                Get real-time push notifications even when the app is closed.
              </CardDescription>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="text-blue-500 hover:bg-blue-100">
             <X className="h-5 w-5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} className="text-blue-800">
                Maybe Later
            </Button>
            <Button onClick={handleEnableNotifications} className="bg-blue-600 hover:bg-blue-700 text-white">
                Enable Notifications
            </Button>
        </div>
      </CardContent>
    </Card>
  );
}
