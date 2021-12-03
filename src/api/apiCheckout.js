import apiClientWithToken from './clientTokenAuth'

const endpoint='/api/create-checkout-session'

export const postTransaction = async (token, data)=>{
    const response = await apiClientWithToken(token).post(endpoint, data);
    return window.location.href=response.data.url
}