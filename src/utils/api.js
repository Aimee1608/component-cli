import instance from './baseAxios'
let mock = false
const BASEURL = mock ? 'http://127.0.0.1:7001' : 'http://mangoya.cn/components'
export function saveComponentsMessage(params) {
	return instance.post(`${BASEURL}/components/add`, params)
}
export function getComDetail(params) {
	return instance.get(`${BASEURL}/components/getComDetail`, { params })
}
