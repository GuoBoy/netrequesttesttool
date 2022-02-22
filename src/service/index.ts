import { service } from './request'
import qs from 'qs'
import { AxiosRequestHeaders } from 'axios'

export class Request {
  static get = (url: string, params?: unknown, headers?: AxiosRequestHeaders): Promise<any> => {
    return new Promise((resolve, reject) => {
      service.get(url, { params: params, headers: headers as AxiosRequestHeaders }).then(res => {
        resolve(res)
      }).catch(er => {
        reject(er)
      })
    })
  }

  static post = (url: string, params?: unknown, headers?: AxiosRequestHeaders): Promise<any> => {
    return new Promise((resolve, reject) => {
      service.post(url, qs.stringify(params), { headers: headers as AxiosRequestHeaders }).then(res => {
        resolve(res)
      }).catch(er => {
        reject(er)
      })
    })
  }
}
