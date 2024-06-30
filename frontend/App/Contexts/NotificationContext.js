import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    // Load notifications from AsyncStorage on component mount
    useEffect(() => {
        const loadNotifications = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem('notifications');
                if (storedNotifications) {
                    const parsedNotifications = JSON.parse(storedNotifications);
                    setNotifications(parsedNotifications);
                    removeExpiredNotifications(parsedNotifications);
                }
            } catch (error) {
                console.error("Failed to load notifications", error);
            }
        };

        loadNotifications();
    }, []);

    // Function to remove notifications older than 1 day
    const removeExpiredNotifications = async (notifications) => {
        const now = Date.now();
        // const fiveMinutesInMillis = 5 * 60 * 1000;
        // const threeDaysInMillis = 3 * 24 * 60 * 60 * 1000;
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const filteredNotifications = notifications.filter(notification => {
            return now - notification.timestamp < oneDayInMillis;
        });

        setNotifications(filteredNotifications);
        try {
            await AsyncStorage.setItem('notifications', JSON.stringify(filteredNotifications));
        } catch (error) {
            console.error("Failed to update notifications", error);
        }
    };

    // Function to add a new notification
    const addNotification = async (notification) => {
        try {
            const newNotification = { ...notification, timestamp: Date.now() };
            const newNotifications = [...notifications, newNotification];
            setNotifications(newNotifications);
            await AsyncStorage.setItem('notifications', JSON.stringify(newNotifications));
        } catch (error) {
            console.error("Failed to save notification", error);
        }
    };

    // Function to remove a user notification by ID
    const removeNotification = async (notificationId) => {
        try {
            const updatedNotifications = notifications.filter(notification => notification.id !== notificationId);
            setNotifications(updatedNotifications);
            await AsyncStorage.setItem('notifications', JSON.stringify(updatedNotifications));
        } catch (error) {
            console.error("Failed to delete notification", error);
        }
    };

    // Periodically check for expired notifications
    useEffect(() => {
        const interval = setInterval(() => {
            removeExpiredNotifications(notifications);
        }, 24 * 60 * 60 * 1000);      // Run every 24 hours (24 * 60 * 60 * 1000) [Run every 5 minutes (5 * 60 * 1000)]

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [notifications]);

    return (
        <NotificationContext.Provider value={{ notifications, addNotification, removeNotification }}>
            {children}
        </NotificationContext.Provider>
    );
};
