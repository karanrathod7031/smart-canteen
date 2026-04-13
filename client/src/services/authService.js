import api from "./api";

export async function loginStudent(payload) {
  const { data } = await api.post("/students/login", payload);
  return data;
}

export async function registerStudent(payload) {
  const { data } = await api.post("/students/register", payload);
  return data;
}

export async function loginAdmin(payload) {
  const { data } = await api.post("/admin/login", payload);
  return data;
}