import axios, {AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse} from 'axios';
import Router from 'next/router';
import Message from '../components/Message';
import api from '../config/config';

// 401 豁免路径
const exemptPaths = [
  '/',
  '/auth/login',
    '/ServiceNotFound',
  '/download'
];

const BASE_URL = api.api;
class ApiClient {
  private axios: AxiosInstance;



  constructor(baseURL: string) {
    this.axios = axios.create({
      baseURL,
    });
    this.axios.interceptors.request.use(
        // @ts-ignore
      this.handleRequest.bind(this), // 绑定 this 上下文
    );
    this.axios.interceptors.response.use(
      this.handleSuccessResponse.bind(this), // 绑定 this 上下文
      this.handleErrorResponse.bind(this) // 绑定 this 上下文
    );
  }

    private handleRequest = (config: AxiosRequestConfig): AxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token) {
        (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  };

  private handleSuccessResponse = (response: AxiosResponse) => {
    return response.data;
  };

  private handleErrorResponse = (error: AxiosError) => {
    // 注意这里使用 error.response?.status 来获取状态码
    const statusCode = error.response?.status;
    switch (statusCode) {
      case 429:
        Message.error({content: "请求次数过多！", duration: 2000});
        break;
      case 401:
        if (!exemptPaths.includes(location.pathname)) {
          Router.push("/auth/login");
          localStorage.removeItem("token");
        }
        break;
      case 406:
        Router.push("/auth/login");
        Message.error({content: "您的账号已被封禁,原因详见邮件", duration: 1000});
        break;
      case 502:
        Message.error({content: "ME Frp API 状态异常，请联系管理员!", duration: 1000});
        break;
      default:
        // 处理其他错误
        break;
    }
    return Promise.reject(error);
  };
  get<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.axios.get<T>(url, config);
  }

  post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.axios.post<T>(url, data, config);
  }

  put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<any> {
    return this.axios.put<T>(url, data, config);
  }

  delete<T>(url: string, config?: AxiosRequestConfig): Promise<any> {
    return this.axios.delete<T>(url, config);
  }
}

const apiClient = new ApiClient(BASE_URL);

export default apiClient;