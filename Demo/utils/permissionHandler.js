import { Alert, Linking, Platform } from 'react-native';
import * as IntentLauncher from 'expo-intent-launcher';

/**
 * 권한 확인 및 설정 화면으로 이동하는 공통 메서드
 * @param {Function} checkPermissionMethod - 권한 확인 메서드 (Promise<boolean> 반환)
 * @param {string} alertTitle - Alert 제목
 * @param {string} alertMessage - Alert 메시지
 * @returns {Promise<void>}
 */
export const ensurePermissionOrMoveToSetting = async (checkPermissionMethod, alertTitle, alertMessage) => {
    try {
        const hasPermission = await checkPermissionMethod();

        if (!hasPermission) {
            Alert.alert(
                alertTitle,
                alertMessage,
                [
                    // 선택지 1: 취소
                    {
                        text: '취소',
                        onPress: () => {
                            // 동일한 Alert를 다시 띄움
                            showPermissionAlert();
                        },
                        style: 'cancel',
                    },
                    // 선택지 2: 설정으로 이동
                    {
                        text: '설정으로 이동',
                        onPress: async () => {
                            // iOS: 앱 설정 화면으로 이동
                            if (Platform.OS === 'ios') 
                            {
                                await Linking.openURL('app-settings:');
                            }
                            // Android: 앱 설정 화면으로 이동
                            else if (Platform.OS === 'android') 
                            {
                                const intent = IntentLauncher.createIntent(
                                    IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
                                    { data: `package:${Application.applicationId}` }
                                );
                                IntentLauncher.startActivityAsync(intent);
                            }
                        },
                    },
                ]
            );
        }
    } 
    catch (error) 
    {
        console.error('Error ensuring permission:', error);
    }
};