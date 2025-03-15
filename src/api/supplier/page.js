import fetchData from "@/api/page";

export const getSuppliers = () => fetchData("suppliers");

export const deleteSupplier = (id) => fetchData(`suppliers/${id}`, "DELETE");