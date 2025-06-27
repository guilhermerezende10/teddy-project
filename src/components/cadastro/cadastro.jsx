import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";
import "./cadastro.css";

export default function Cadastro() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleCadastro = async () => {
    setErro("");

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      await createUserWithEmailAndPassword(auth, email, senha);
      navigate("/ListarParceiros");
    } catch (err) {
      console.error(err);
      setErro("Erro ao cadastrar. Verifique os dados.");
    }
  };

  const irParaLogin = () => {
    navigate("/login");
  };

  return (
    <div
      className="login-page"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card title="Cadastro" style={{ width: "300px" }}>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="email">E-mail</label>
            <InputText
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="senha">Senha</label>
            <InputText
              id="senha"
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="confirmar">Confirmar Senha</label>
            <InputText
              id="confirmar"
              type="password"
              value={confirmarSenha}
              onChange={(e) => setConfirmarSenha(e.target.value)}
            />
          </div>
          {erro && <small style={{ color: "red" }}>{erro}</small>}
          <Button
            label="Cadastrar"
            onClick={handleCadastro}
            className="btn-entrar p-mt-3"
          />
          <Button
            label="Já tem conta? Fazer login"
            link
            className="p-mt-2"
            onClick={irParaLogin}
          />
        </div>
      </Card>
    </div>
  );
}
