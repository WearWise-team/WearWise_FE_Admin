import fetchData from "@/api/page";

export const getAllUser = () =>
  fetchData("users", "GET");

export const getUsersIsDeleted = () =>
  fetchData("getAllUsersIsDeleted", "GET");

export const inactiveUser = (id) =>
  fetchData(`users/${id}`, "DELETE", null);

export const activateUserApi = (id) =>
  fetchData(`restoreUser/${id}`, "PUT", null);

export const getDetailUser = (userId) =>
  fetchData(`users/${userId}`, "GET");
