import axios from 'axios'

export default function createRequest(endpoint: string) {
    let source = axios.CancelToken.source()
    
    const makeRequest = async () => {
        const cancelToken = source.token
        try {
            var result = await axios({
                method: 'POST',
                url: process.env.REACT_APP_BACK_URI,
                data: {
                    endpoint
                },
                withCredentials: true,
                cancelToken
            })
        } catch (error){
            if (axios.isCancel(error)) return
            return error
        }
        return result.data
    }
    
    return {source, makeRequest}
}