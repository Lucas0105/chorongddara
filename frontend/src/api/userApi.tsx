/* eslint-disable no-console */
/* eslint-disable import/prefer-default-export */
import axios, { AxiosResponse } from 'axios';
import { authApi } from '../libs/axiosConfig';

interface UserData {
  resultcode: number;
  resultMsg: string;
  result: User; // result 속성 추가
}

interface User {
  userId: number;
  email: string;
  nickname: string;
}

interface SignUpData {
  email: string;
  password: string;
  nickname: string;
}

// 회원가입
export async function signUp(data: SignUpData): Promise<void> {
  await axios.post('/users/join', data);
}

// 사용자 정보
export async function getMe(): Promise<UserData | null> {
  try {
    const response: AxiosResponse<UserData> = await authApi.get('/users/');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
}
