// UserNotificationsContext.js
import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const UserNotificationsContext = createContext();

export const UserNotificationsProvider = ({ children }) => {
    const [userNotifications, setUserNotifications] = useState([]);

    // Load notifications from AsyncStorage on component mount
    useEffect(() => {
        const loadUserNotifications = async () => {
            try {
                const storedNotifications = await AsyncStorage.getItem('userNotifications');
                if (storedNotifications) {
                    const parsedNotifications = JSON.parse(storedNotifications);
                    setUserNotifications(parsedNotifications);
                    removeExpiredNotifications(parsedNotifications);
                }
            } catch (error) {
                console.error("Failed to load user notifications", error);
            }
        };

        loadUserNotifications();
    }, []);

    // Function to remove notifications older than 1 day
    const removeExpiredNotifications = async (notifications) => {
        const now = Date.now();
        const oneDayInMillis = 24 * 60 * 60 * 1000;
        const filteredNotifications = notifications.filter(notification => {
            return now - notification.timestamp < oneDayInMillis;
        });

        setUserNotifications(filteredNotifications);
        try {
            await AsyncStorage.setItem('userNotifications', JSON.stringify(filteredNotifications));
        } catch (error) {
            console.error("Failed to update user notifications", error);
        }
    };

    // Function to add a new user notification
    const addUserNotification = async (notification) => {
        try {
            const newNotification = { ...notification, timestamp: Date.now() };
            const newNotifications = [newNotification, ...userNotifications];
            setUserNotifications(newNotifications);
            await AsyncStorage.setItem('userNotifications', JSON.stringify(newNotifications));
        } catch (error) {
            console.error("Failed to save user notification", error);
        }
    };

    // Function to remove a user notification by ID
    const removeUserNotification = async (notificationId) => {
        try {
            const updatedNotifications = userNotifications.filter(notification => notification.id !== notificationId);
            setUserNotifications(updatedNotifications);
            await AsyncStorage.setItem('userNotifications', JSON.stringify(updatedNotifications));
        } catch (error) {
            console.error("Failed to delete user notification", error);
        }
    };

    // Periodically check for expired notifications
    useEffect(() => {
        const interval = setInterval(() => {
            removeExpiredNotifications(userNotifications);
        }, 24 * 60 * 60 * 1000); // Run every 24 hours

        return () => clearInterval(interval); // Cleanup on component unmount
    }, [userNotifications]);

    return (
        <UserNotificationsContext.Provider value={{ userNotifications, addUserNotification, removeUserNotification }}>
            {children}
        </UserNotificationsContext.Provider>
    );
};
