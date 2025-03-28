import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Alert, Platform } from 'react-native';
import FetchRequestBuilder from '../utils/fetchRequest';
import { API } from '../constants/api_constants';
import { ensurePermissionOrMoveToSetting } from '../utils/permissionHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AlertTitle = '알림 권한 필요';
const AlertMessage = '알림 권한이 필요합니다. 설정 화면으로 이동하여 권한을 허용해주세요.';

const TOKEN_STORAGE_KEY = '@expo_token';

/**
 * Notification 권한 확인 메서드
 * @returns {Promise<boolean>} 사용자가 권한을 허용했으면 true, 그렇지 않으면 false
 */

export const checkNotificationPermission = async () => {
    try {
        // 권한 상태 확인
        const {status} = await Notifications.getPermissionsAsync();
        // iOS
        if (Platform.OS === 'ios') 
        {
            if (status === 'granted') 
            {
                return true;
            }
        } 
        // Android: granted 상태만 확인
        else if (Platform.OS === 'android') 
        {
            if (status === 'granted') 
            {
                return true;
            }
        }

        // 권한 요청
        const {status: newStatus} = await Notifications.requestPermissionsAsync();
        // iOS
        if (Platform.OS === 'ios') 
        {
            return newStatus === 'granted';
        }
        // Android: granted 상태만 확인
        else if (Platform.OS === 'android') 
        {
            return newStatus === 'granted';
        }

        return false;

    } 
    catch (error) 
    {
        console.error('Error checking notification permissions:', error);
        return false;
    }
};

 

/**
 * 권한 확인 및 설정 화면으로 이동
 * @returns {Promise<void>}
 */
export const ensureNotificationPermission = async () => {
    await ensurePermissionOrMoveToSetting(
        checkNotificationPermission,
        AlertTitle,
        AlertMessage
    );
};

/**
 * 디바이스 및 앱 특정하는 토큰 서버에 전달
 * @returns {Promise<void>}
 */
export const sendTokenToServe = async() => {

    try {

        cur_token = await AsyncStorage.getItem(TOKEN_STORAGE_KEY); // AsyncStorage에서 토큰 가져오기

        // 알림 토큰 가져오기
        const token = (await Notifications.getExpoPushTokenAsync()).data; 

        if (token == cur_token) // 현재 토큰과 같으면 전송하지 않음
        {
            return;
        }


        const fetchRequest = new FetchRequestBuilder(); //FetchRequestBuilder 인스턴스 생성

        // 토큰 전송
        const response = await fetchRequest
            .setUrl(API.PUSH_TOKEN)
            .setMethod('POST')
            .addBody({ token: token, device: Device.modelName })
            .build();

        if (response.ok)
        {

            // Android용 설정
            if (Platform.OS === 'android') 
            {
                Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
                });
            }

            await AsyncStorage.setItem(TOKEN_STORAGE_KEY, token); // AsyncStorage에 토큰 저장

        }
        else 
        {
            Alert.alert('오류', '토큰 전송에 실패했습니다.' + response.status);
        }

    }
    catch(e)
    {
        Alert.alert('오류', '토큰 전송에 실패했습니다.' + response.status);
    }
     


}
