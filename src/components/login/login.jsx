import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Checkbox } from "primereact/checkbox";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { signInWithEmailAndPassword } from "firebase/auth"; // ajuste o caminho se necessário
import { auth } from "../../firebase"; // ajuste o caminho se necessário
import "./login.css";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    document.body.classList.add("login-page");
    return () => {
      document.body.classList.remove("login-page");
    };
  }, []);

  const handleLogin = async () => {
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;

      if (rememberMe) {
        Cookies.set("username", user.email || "", { expires: 7 });
      } else {
        localStorage.setItem("username", user.email || "");
      }

      navigate("/ListarParceiros");
      window.location.reload();
    } catch (error) {
      console.error(error);
      setError("E-mail ou senha inválidos.");
    }
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
      <Card title="Login" style={{ width: "300px" }}>
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="username">E-mail</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="field">
            <label htmlFor="password">Senha</label>
            <InputText
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="field-checkbox">
            <Checkbox
              inputId="rememberMe"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.checked)}
            />
            <label htmlFor="rememberMe">Manter Conectado</label>
          </div>
          {error && <small style={{ color: "red" }}>{error}</small>}
          <Button
            label="Entrar"
            onClick={handleLogin}
            className="btn-entrar p-mt-3"
          />
        </div>
      </Card>
    </div>
  );
}
