import React from "react";
import { Card } from "primereact/card";
import { Avatar } from "primereact/avatar";
import profileImage from "../../assets/gymtech.png";
import "primeflex/primeflex.css";
import { Button } from "primereact/button";
import Curriculo from "../../assets/Curriculo_Kaya_Haufe.pdf";

export default function Sobre() {
  const header = (
    <h1 className="mt-0">
      Aplicação de Gestão de Empresas Externas e Parceiros
    </h1>
  );

  return (
    <div className="sobre flex justify-content-center align-items-center">
      <Card title={header}>
        <section id="sobre">
          <h2>Sobre o Projeto</h2>
          <p>
            O projeto tem como objetivo gerar dados fictícios de empresas,
            facilitando a criação de protótipos e testes de sistemas para que
            Academias cadastrem e administrem seus parceiros e as empresas com
            vínculos. Utilizando uma API personalizada, o sistema oferece
            informações como nome da empresa, quantidade de funcionários e
            outros.
          </p>
        </section>

        <section id="funcionalidades">
          <h2>Funcionalidades</h2>
          <ul>
            <li>
              <strong>Personalização:</strong> Possibilidade de customizar a
              quantidade e o tipo de dados gerados.
            </li>
            <li>
              <strong>Facilidade de Integração:</strong> A API foi desenvolvida
              para fácil integração com outras aplicações.
            </li>
          </ul>
        </section>

        <section id="tecnologias">
          <h2>Tecnologias Utilizadas</h2>
          <p>
            O projeto foi desenvolvido utilizando diversas tecnologias modernas
            para garantir uma experiência eficiente e de alta qualidade.
          </p>
          <ul>
            <li>
              <strong>Backend:</strong> Node.js.
            </li>
            <li>
              <strong>Banco de Dados:</strong> Firestore e JSON Server.
            </li>
            <li>
              <strong>Geração de Dados:</strong> DummyJson para gerar dados
              falsos realistas.
            </li>
            <li>
              <strong>Frontend:</strong> React para construção da interface de
              visualização e interação com a API.
            </li>
            <li>
              <strong>Testes:</strong> Jest e Postman para garantir que a API e
              suas funcionalidades estejam funcionando corretamente.
            </li>
          </ul>
        </section>
      </Card>
    </div>
  );
}
