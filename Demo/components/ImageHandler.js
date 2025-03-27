
import { Alert } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FetchRequestBuilder from '../utils/fetchRequest';
import { API } from '../constants/api_constants';

const IMAGE_STORAGE_KEY = '@uploaded_images';

//이미지를 처리하는 기능 메서드들

/**
 * 이미지를 서버로 전송하고 중복 전송을 방지하는 함수
 * @param {Array} selectedImages - 사용자가 선택한 이미지의 URI 배열
 * @returns {Promise<void>}
 */
export const uploadImages = async (selectedImages) => {
    try {
        // 이미 전송된 이미지 목록 가져오기
        const uploadedImages = await getUploadedImages();

        // 전송할 이미지 필터링
        const imagesToUpload = selectedImages.filter(image => !uploadedImages.includes(image));

        // FormData 객체 생성
        const formData = new FormData();
        imagesToUpload.forEach((image, index) => {
            formData.append('multipartFile', {
                uri: image,
                name: `image_${index}.jpg`,
                type: 'image/jpeg',
            });
        });

        // FetchRequestBuilder 인스턴스 생성 및 서버에 이미지 전송
        const fetchRequest = new FetchRequestBuilder();
        const response = await fetchRequest
            .setUrl('https://your-server-url.com/upload')
            .setMethod('POST')
            .addBody(formData)
            .build();

        if (response.ok) 
        {
            // 성공적으로 전송된 이미지 저장
            for (const image of imagesToUpload)
            {
                await saveUploadedImage(image);
            }
            Alert.alert('성공', '이미지가 성공적으로 전송되었습니다.');
        } 
        else 
        {
            Alert.alert('전송 실패', '이미지 전송에 실패했습니다.');
        }
    } 
    catch (error) 
    {
        console.error('Error uploading images:', error);
        Alert.alert('오류', '이미지 전송 중 오류가 발생했습니다.');
    }
};

/**
 * 로컬 스토리지에서 전송된 이미지 목록 가져오기
 * @returns {Promise<Array>} - 전송된 이미지 URI 배열
 */
const getUploadedImages = async () => {
    try 
    {
        const storedImages = await AsyncStorage.getItem(IMAGE_STORAGE_KEY);
        return storedImages ? JSON.parse(storedImages) : [];
    } 
    catch (error) 
    {
        console.error('Error retrieving uploaded images:', error);
        return [];
    }
};

/**
 * 전송된 이미지를 로컬 스토리지에 저장
 * @param {string} imageUri - 전송된 이미지의 URI
 * @returns {Promise<void>}
 */
const saveUploadedImage = async (imageUri) => {
    try 
    {
        const uploadedImages = await getUploadedImages();
        uploadedImages.push(imageUri);
        await AsyncStorage.setItem(IMAGE_STORAGE_KEY, JSON.stringify(uploadedImages));
    } 
    catch (error) 
    {
        console.error('Error saving uploaded image:', error);
    }
};