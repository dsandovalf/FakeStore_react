import {create} from "apisauce";

const apiClientWithToken = (token) => create(
    {
        baseURL: "https://fakestoreapi.com/",
        headers:{
            Authorization: "Bearer " + token
        }
    }
);

export default apiClientWithToken