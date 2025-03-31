import http from "../http-common";

const url = "http://localhost:3000/empresasExternas";

class EmpresasExternasService {
  getEmpresasExternas() {
    return Promise.resolve(http.get(url));
  }

  getEmpresaExternaById(id) {
    return Promise.resolve(http.get(`${url}/${id}`));
  }

  postEmpresaExterna(data) {
    return Promise.resolve(http.post(`${url}`, data));
  }

  putEmpresaExterna(id, data) {
    return Promise.resolve(http.put(`${url}/${id}`, data));
  }

  deleteEmpresaExternaById(id) {
    return Promise.resolve(http.delete(`${url}/${id}`));
  }
}

export default new EmpresasExternasService();
