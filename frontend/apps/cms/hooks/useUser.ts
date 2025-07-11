import { useQuery } from "@tanstack/react-query";
import axios from "~lib/axios";

const fetchUser = async () => {
  const res = await axios.get("/auth/me");
  return res.data;
};

export const useUser = () => {
  return useQuery({ queryKey: ["user"], queryFn: fetchUser });
};
