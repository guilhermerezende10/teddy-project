import React, { useEffect, useState } from "react";
import {
  Routes,
  Route,
  useLocation,
  useNavigate,
  Link,
} from "react-router-dom";
import "primereact/resources/themes/saga-orange/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import Cookies from "js-cookie";
import { Menubar } from "primereact/menubar";
import LogoTeddy from "./assets/gymtech.png";
import "./App.css";

import ListarParceiros from "./components/parceiros/listar-parceiros.component";
import ListarEmpresasExternas from "./components/empresas-externas/listar-empresas-externas";
import Sobre from "./components/sobre/sobre";
import Login from "./components/login/login";
import Cadastro from "./components/cadastro/Cadastro";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/"); // Redireciona para a página de login
  };

  const items = [
    {
      label: "Parceiros",
      url: "/ListarParceiros",
    },
    {
      label: "Empresas Externas",
      url: "/ListarEmpresasExternas",
    },
    {
      label: "Sobre",
      url: "/Sobre",
    },
    {
      label: "Sair",
      command: handleLogout, // Adiciona a função de logout ao clicar em "Sair"
    },
  ];

  const start = (
    <Link to="/ListarParceiros">
      <img alt="logo" src={LogoTeddy} height="40" className="mr-2" />
    </Link>
  );

  return (
    <div className="card">
      {location.pathname !== "/" && location.pathname !== "/login" && (
        <Menubar model={items} start={start} className="custom-menubar" />
      )}

      <div className="container mt-3">
        <Routes>
          <Route path="/" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          <Route path="/ListarParceiros" element={<ListarParceiros />} />
          <Route
            path="/ListarEmpresasExternas"
            element={<ListarEmpresasExternas />}
          />
          <Route path="/Sobre" element={<Sobre />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
