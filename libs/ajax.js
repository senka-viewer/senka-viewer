import Axios from "axios";

export default Axios.create({
    baseURL: process.browser ? '' : process.env.INNER_BASE_URL
});
