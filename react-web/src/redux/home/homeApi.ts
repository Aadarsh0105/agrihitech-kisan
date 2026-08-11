import axios from "../../api/axios";

export const getHomeData = async () => {
  const { data } = await axios.get("/home/user");
  return data;
};