import { api } from '@shared/api';
import type { UserDetail, UserBalance, UserPreference } from '@shared/types/user';

/* ----- DTO ----- */

export interface ReqLogin {
    username: string;
    password: string;
    captcha?: string;
}

export interface RespLogin {
    id?: number;
    username?: string;
    access_token: string;
    refresh_token: string;
    expire_at?: number;
    refresh_expire_at?: number;
}

export interface ReqRegister {
    username: string;
    password: string;
    password_confirm: string;
    captcha?: string;

    language?: string;
    currency?: string;
    timezone?: string;
    country?: string;
}

export interface RespRegister {
    access_token: string;
    refresh_token: string;
}

export interface RespRefreshToken {
    access_token: string;
    refresh_token: string;
    expire_at?: number;
    refresh_expire_at?: number;
}

/* ----- 接口（一行式，错误统一冒泡到 axios 拦截器） ----- */

export const loginUser            = (params: ReqLogin)        => api.post<RespLogin>('/auth/login', params);
export const registerUser         = (params: ReqRegister)     => api.post<RespRegister>('/auth/register', params);
export const fetchUserInfo        = ()                        => api.get<UserDetail>('/user/detail');
export const fetchUserBalance     = ()                        => api.get<UserBalance>('/user/balance');
export const updateUserPreference = (params: UserPreference)  => api.post<void>('/user/preference', params);
export const refreshTokenRequest  = (refresh_token: string)   => api.post<RespRefreshToken>('/auth/refresh', { refresh_token });
export const logoutUser           = ()                        => api.post<void>('/auth/logout');

/** 修改登录密码:新密码 + 确认 + 资金密码(用于授权,后端 PassLoginRequest) */
export interface ReqModifyLoginPass {
  password: string;
  password_confirmation: string;
  password_sec: string;
}
export const modifyLoginPassword  = (params: ReqModifyLoginPass) => api.post<void>('/user/passLoginModify', params);

/** 设置/修改安全密码(资金密码):新安全密码 + 确认 + 当前登录密码(用于授权,后端 PassSecRequest) */
export interface ReqModifySecPass {
  password_sec: string;
  password_sec_confirmation: string;
  password: string;
}
export const modifySecPassword    = (params: ReqModifySecPass) => api.post<void>('/user/passSecModify', params);