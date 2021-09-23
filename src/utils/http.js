import instance from "./baseAxios";
/**
 * @Description: 请求特殊状态码汇总
 *
 */
const errorMessage = {
    403: 'No Permission',
    404: 'Project Not Found',
    401: 'Unauthorized'
}
const proxy = new Proxy(errorMessage, {
    get(targe, key){
        return targe[key]
    }
})

export async function fetch (url, method, accessToken, data){
    try{
        return await instance({
            url,
            method: method || 'post',
            headers: {
                'PRIVATE-TOKEN': accessToken
            },
            data
        })
    }catch (err) {
        if (proxy[err.response.status]){
            return proxy[err.response.status]
        }
        console.log('ERRORINFO', err)
    }
}
export default fetch
