import axios from 'axios'

const API_KEY = '43483190-79596e58d1ea9a6fa21521e98'

const apiUrl = `https://pixabay.com/api/?key=${API_KEY}`

const formatUrl = (params: any) => {
    let url = apiUrl + "&per_page=25&safesearch=true&editors_choice=true"

    if (!params) return url

    let paramKeys = Object.keys(params)
    paramKeys.map((key) => {
        let value = key === 'q' ? encodeURIComponent(params[key]) : params[key]
        url += `&${key}=${value}`
    })

    return url
}

export const apiCall = async (params: any) => {
    try {
        const response = await axios.get(formatUrl(params))
        const { data } = response
        return { success: true, data }
    } catch (e: any) {
        console.log(e)
        return { success: false, error: e.message }
    }
}