import api from "./api";

export async function getFoods() {
  const { data } = await api.get("/foods");
  return Array.isArray(data) ? data : data?.foods || [];
}

export async function createFood(payload) {
  const { data } = await api.post("/foods", payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateFood(id, payload) {
  const { data } = await api.put(`/foods/${id}`, payload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return data;
}

export async function updateFoodStatus(id, payload) {
  const { data } = await api.patch(`/foods/${id}/status`, payload);
  return data;
}

export async function deleteFood(id) {
  const { data } = await api.delete(`/foods/${id}`);
  return data;
}