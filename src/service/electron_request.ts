import { net } from 'electron'
import { IpcMainEvent } from 'electron/main'

interface HeadOrParam {
  [index: string]: string | number
}

interface RequestConfig extends Object {
  url: string
  headers?: HeadOrParam
  params?: HeadOrParam
}

export function sendPOST(config: RequestConfig, event: IpcMainEvent): void {
  let responseData = ''
  const request = net.request({
    url: config.url,
    method: 'POST'
  })
  if (Object.prototype.hasOwnProperty.call(config, 'headers')) {
    const headers = config.headers
    for (const key in headers) {
      request.setHeader(key, headers[key] as string)
    }
  }
  if (Object.prototype.hasOwnProperty.call(config, 'params')) {
    request.write(JSON.stringify(config.params))
  }
  request.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      responseData += chunk.toString()
    })
    response.on('end', () => {
      event.reply('response-data', responseData)
    })
    response.on('error', () => {
      event.reply('response-error', '响应错误')
    })
  })
  request.end()
  request.on('error', () => {
    event.reply('response-error', '请求失败')
  })
}
// example
// post({ url: 'he', headers: { ua: 'useragnet' } })

export function sendGET(config: RequestConfig, event: IpcMainEvent): void {
  let responseData = ''
  const request = net.request({
    url: config.url,
    method: 'GET'
  })
  if (Object.prototype.hasOwnProperty.call(config, 'headers')) {
    const headers = config.headers
    for (const key in headers) {
      request.setHeader(key, headers[key] as string)
    }
  }
  if (Object.prototype.hasOwnProperty.call(config, 'params')) {
    request.write(JSON.stringify(config.params))
  }
  request.on('response', (response) => {
    // console.log(`STATUS: ${response.statusCode}`)
    // console.log(`HEADERS: ${JSON.stringify(response.headers)}`)
    response.on('data', (chunk) => {
      responseData += chunk.toString()
    })
    response.on('end', () => {
      event.reply('response-data', responseData)
    })
  })
  request.end()
}
