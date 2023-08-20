import Axios from "axios";

export default Axios.create({
    baseURL: typeof window !== 'undefined' ? '' : process.env.INNER_BASE_URL
});
