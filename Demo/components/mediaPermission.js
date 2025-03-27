import * as MediaLibrary from 'expo-media-library';
import { Alert, Linking, Platform } from 'react-native';
import {ensurePermissionOrMoveToSetting} from '../utils/permissionHandler';


const AlertTitle = '갤러리 권한 필요';
const AlertMessage = '갤러리 접근 권한이 필요합니다. 설정 화면으로 이동하여 권한을 허용해주세요.';


/**
 * 갤러리 이미지 Full Access 권한 확인 메서드
 * @returns {Promise<boolean>} 사용자가 권한을 허용했으면 true, 그렇지 않으면 false
 */
export const checkMediaLibraryPermission = async () => {
    try 
    {
        // 권한 상태 확인
        const { status, accessPrivileges } = await MediaLibrary.getPermissionsAsync();

        // iOS: Full Access 권한 확인
        if (Platform.OS === 'ios') 
        {
            if (status === 'granted' && accessPrivileges === 'all') 
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
        const { status: newStatus, accessPrivileges: newAccessPrivileges } = await MediaLibrary.requestPermissionsAsync();

        // iOS: Full Access 권한 확인
        if (Platform.OS === 'ios') 
        {
            return newStatus === 'granted' && newAccessPrivileges === 'all';
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
        console.error('Error checking media library permissions:', error);
        return false;
    }
};
 

/**
 * 권한 확인 및 설정 화면으로 이동
 * @returns {Promise<void>}
 */
export const ensureMediaLibraryPermission = async () => {
    await ensurePermissionOrMoveToSetting(
        checkMediaLibraryPermission,
        AlertTitle,
        AlertMessage
    );
};
