import React, {useEffect} from 'react';
import {
  PermissionsAndroid,
  Platform,
  Alert,
  SafeAreaView,
  View,
  Button,
  Linking,
} from 'react-native';
import {
  AuthorizationStatus,
  getMessaging,
  getToken,
  onMessage,
} from '@react-native-firebase/messaging';
import {addPost, fetchUser} from './src/api';

const App = () => {
  // Handle foreground messages
  const messaging = getMessaging();
  onMessage(messaging, remoteMessage => {
    console.log('FCM Message Data:', remoteMessage);
    Alert.alert(
      remoteMessage.notification.title,
      remoteMessage.notification.body,
    );
  });

  function promptForPermission() {
    Alert.alert(
      'Enable Notifications',
      'Notifications are disabled. Please enable them in settings.',
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Open Settings',
          onPress: () => {
            Linking.openSettings(); // Open app settings
          },
        },
      ],
    );
  }

  const requestUserPermission = async () => {
    try {
      // if (Platform.OS === 'android') {
      //   const granted = await PermissionsAndroid.request(
      //     PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS,
      //   );
      //   console.log(granted, '------------');
      //   if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      //     console.warn('Notification permission denied');
      //     promptForPermission();
      //   } else {
      //     console.log('Notification permission granted');
      //   }
      // } else if (Platform.OS === 'ios') {
      const authStatus = await getMessaging().requestPermission();
      const enabled =
        authStatus === AuthorizationStatus.AUTHORIZED ||
        authStatus === AuthorizationStatus.PROVISIONAL;

      if (!enabled) {
        console.warn('Notification permission denied');
      } else {
        console.log('Notification permission granted');
      }
      // }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };

  const getFcmToken = async () => {
    try {
      const messaging = getMessaging();
      const token = await getToken(messaging);
      console.log('FCM Token:', token);
    } catch (error) {
      console.error('Failed to get FCM token:', error);
    }
  };

  const setBackgroundMessageHandler = () => {
    getMessaging().setBackgroundMessageHandler(async remoteMessage => {
      console.log('📩 Message handled in the background:', remoteMessage);
      addPost(remoteMessage);
    });
  };
  useEffect(() => {
    const initialize = async () => {
      try {
        await requestUserPermission();
        await getFcmToken();
        setBackgroundMessageHandler();
      } catch (error) {
        console.error('Error during initialization:', error);
      }
    };

    initialize(); // Call the async function
  }, []);

  return (
    <SafeAreaView style={[{flex: 1}]}>
      <View>
        <Button title="Click" onPress={() => console.log('Pressed')} />
      </View>
    </SafeAreaView>
  );
};

export default App;
