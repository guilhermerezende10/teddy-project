import http from "../http-common";

const url = "https://dummyjson.com/users";

class ParceirosService {
  getParceiros() {
    return fetch(url)
      .then((response) => response.json())
      .then((data) => data.users); // DummyJSON retorna { users: [...] }
  }

  getParceiroById(id) {
    return fetch(`${url}/${id}`).then((response) => response.json());
  }

  postParceiro(data) {
    return fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }

  putParceiro(id, data) {
    return fetch(`${url}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then((response) => response.json());
  }

  deleteParceiroById(id) {
    return fetch(`${url}/${id}`, { method: "DELETE" }).then((response) =>
      response.json()
    );
  }
}

export default new ParceirosService();
