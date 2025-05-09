import http from "../http-common";

const url = "http://localhost:3001/empresasExternas";

class EmpresasExternasService {
  getEmpresasExternas() {
    return http.get(url);
  }

  getEmpresaExternaById(id) {
    return http.get(`${url}/${id}`);
  }

  postEmpresaExterna(data) {
    return http.post(url, data);
  }

  putEmpresaExterna(id, data) {
    return http.put(`${url}/${id}`, data);
  }

  deleteEmpresaExternaById(id) {
    return http.delete(`${url}/${id}`);
  }
}

export default new EmpresasExternasService();
