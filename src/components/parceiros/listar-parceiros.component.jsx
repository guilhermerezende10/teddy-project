import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ParceirosService from "../../services/parceiros.service";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { useNavigate, useLocation } from "react-router-dom";

export default function ListarParceiros() {
  let emptyPartner = {
    name: "",
    description: "",
    client: "",
    client2: "",
  };

  const [partners, setPartners] = useState(null);
  const [partnerDialog, setPartnerDialog] = useState(false);
  const [deletePartnerDialog, setDeletePartnerDialog] = useState(false);
  const [partner, setPartner] = useState(emptyPartner);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  const getParceiros = () => {
    ParceirosService.getParceiros()
      .then((data) => setPartners(formatarDados(data))) // Ajusta os dados antes de setar
      .catch((error) => console.error("Erro ao buscar parceiros:", error));
  };

  const formatarDados = (users) => {
    console.log(users);
    return users.map((user) => ({
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      description: `Idade: ${user.age} anos`, // Usando "age" como uma descrição fictícia
      clients: [user.company?.name || "Sem empresa"], // Coloca o nome da empresa como cliente
      projects: [`Projeto ${user.id}`, `Projeto ${user.id + 1}`], // Criando projetos fictícios
    }));
  };

  // Atualiza a URL com os parâmetros da página atual
  const updateURLWithPage = (page, rows) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page + 1); // page começa em 0, então adicionamos 1 para a URL
    params.set("rows", rows);
    navigate({ search: params.toString() });
  };

  // Função chamada ao mudar de página
  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    updateURLWithPage(event.page, event.rows);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromURL = parseInt(params.get("page"), 10) || 1; // Padrão é 1 se não houver parâmetro
    const rowsFromURL = parseInt(params.get("rows"), 10) || 10;

    setCurrentPage(pageFromURL - 1); // pageFromURL começa em 1 na URL, mas em 0 na tabela
    setRowsPerPage(rowsFromURL);
    getParceiros();
  }, [location.search]);

  const openNew = () => {
    setPartner(emptyPartner);
    setSubmitted(false);
    setPartnerDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setPartnerDialog(false);
  };

  const hideDeletePartnerDialog = () => {
    setDeletePartnerDialog(false);
  };

  const savePartner = () => {
    setSubmitted(true);

    // Definir os arrays de clients e projects
    partner.clients = [partner.client, partner.client2];
    partner.projects = [partner.project, partner.project2];

    // Remover os campos temporários
    delete partner.client;
    delete partner.client2;
    delete partner.project;
    delete partner.project2;

    setPartnerDialog(false);

    if (partner.id) {
      ParceirosService.putParceiro(partner.id, partner)
        .then((response) => {
          const savedPartner = response.data; // Dados completos vindos do backend

          let _partners = [...partners];

          const index = findIndexById(partner.id);
          _partners[index] = savedPartner; // Atualizar o parceiro com os dados do backend
          toast.current.show({
            severity: "success",
            summary: "Sucesso!",
            detail: "Parceiro Atualizado",
            life: 3000,
          });

          setPartners(_partners);
          setPartner(emptyPartner);
        })
        .catch((error) => {
          // Tratar erro, se necessário
          console.error("Erro ao salvar parceiro", error);
        });
    } else {
      ParceirosService.postParceiro(partner)
        .then((response) => {
          const savedPartner = response.data; // Dados completos vindos do backend

          let _partners = [...partners];

          _partners.push(savedPartner); // Adicionar o novo parceiro com os dados completos
          toast.current.show({
            severity: "success",
            summary: "Sucesso!",
            detail: "Parceiro Cadastrado",
            life: 3000,
          });

          setPartners(_partners);
          setPartner(emptyPartner);
        })
        .catch((error) => {
          // Tratar erro, se necessário
          console.error("Erro ao salvar parceiro", error);
        });
    }
  };

  const editPartner = (partner) => {
    partner.client = partner.clients[0];
    partner.client2 = partner.clients[1];
    partner.project = partner.projects[0];
    partner.project2 = partner.projects[1];

    setPartner({ ...partner });
    setPartnerDialog(true);
  };

  const confirmDeletePartner = (partner) => {
    setPartner(partner);
    setDeletePartnerDialog(true);
  };

  const deletePartner = () => {
    let _partners = partners.filter((val) => val.id !== partner.id);

    setPartners(_partners);
    setDeletePartnerDialog(false);
    ParceirosService.deleteParceiroById(partner.id).then(() =>
      toast.current.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Parceiro deletado.",
        life: 3000,
      })
    );
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < partners.length; i++) {
      if (partners[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _partner = { ...partner };

    _partner[`${name}`] = val;

    setPartner(_partner);
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          rounded
          outlined
          className="mr-2"
          severity="warning"
          onClick={() => editPartner(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeletePartner(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="header-container">
      <div className="header-left">
        <h4 className="m-0">Parceiros</h4>
        <div className="search-container">
          <span className="p-input-icon-left">
            <InputText
              type="search"
              onInput={(e) => setGlobalFilter(e.target.value)}
              placeholder="Buscar..."
            />
          </span>
        </div>
      </div>
      <div className="header-right">
        <Button
          label="Adicionar Parceiro"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    </div>
  );

  const partnerDialogFooter = (
    <React.Fragment>
      <Button
        label="Cancelar"
        icon="pi pi-times"
        outlined
        onClick={hideDialog}
        className="btn-red-not-bg"
      />
      <Button
        label="Confirmar"
        icon="pi pi-check"
        onClick={savePartner}
        className="btn-orange"
      />
    </React.Fragment>
  );
  const deletePartnerDialogFooter = (
    <React.Fragment>
      <Button
        label="Não"
        icon="pi pi-times"
        outlined
        className="btn-orange-not-bg"
        onClick={hideDeletePartnerDialog}
      />
      <Button
        label="Sim"
        icon="pi pi-check"
        severity="danger"
        onClick={deletePartner}
      />
    </React.Fragment>
  );

  const formatArray = (rowData, attribute) => {
    return (rowData[attribute] || []).map((item, index) => (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    ));
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          header={header}
          globalFilter={globalFilter}
          ref={dt}
          value={partners}
          dataKey="id"
          paginator
          first={currentPage * rowsPerPage}
          rows={rowsPerPage}
          onPage={onPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} ao {last} de {totalRecords} parceiros"
        >
          <Column
            field="id"
            header="Código"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="name"
            header="Nome"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="description"
            header="Descrição"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            header="Clientes"
            body={(rowData) => formatArray(rowData, "clients")}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            header="Projetos"
            body={(rowData) => formatArray(rowData, "projects")}
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={partnerDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Dados do Parceiro"
        modal
        className="p-fluid"
        footer={partnerDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="name" className="font-bold">
            Nome
          </label>
          <InputText
            id="name"
            value={partner.name}
            onChange={(e) => onInputChange(e, "name")}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="description" className="font-bold">
            Descrição
          </label>
          <InputTextarea
            id="description"
            value={partner.description}
            onChange={(e) => onInputChange(e, "description")}
            rows={3}
            cols={20}
          />
        </div>
        <div className="field">
          <label htmlFor="client" className="font-bold">
            Cliente
          </label>
          <InputText
            id="client"
            value={partner.client}
            onChange={(e) => onInputChange(e, "client")}
          />
        </div>
        <div className="field">
          <label htmlFor="client2" className="font-bold">
            Cliente 2
          </label>
          <InputText
            id="client2"
            value={partner.client2}
            onChange={(e) => onInputChange(e, "client2")}
          />
        </div>
        <div className="field">
          <label htmlFor="project" className="font-bold">
            Projeto
          </label>
          <InputText
            id="project"
            value={partner.project}
            onChange={(e) => onInputChange(e, "project")}
          />
        </div>
        <div className="field">
          <label htmlFor="project2" className="font-bold">
            Projeto 2
          </label>
          <InputText
            id="project2"
            value={partner.project2}
            onChange={(e) => onInputChange(e, "project2")}
          />
        </div>
      </Dialog>

      <Dialog
        visible={deletePartnerDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deletePartnerDialogFooter}
        onHide={hideDeletePartnerDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {partner && (
            <span>
              Tem certeza que deseja excluir o seguinte parceiro: <br></br>
              <b>{partner.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
