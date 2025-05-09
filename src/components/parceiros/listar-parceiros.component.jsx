// listar-parceiros.component.jsx
import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import ParceirosService from "../../services/parceiros.service";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { useNavigate, useLocation } from "react-router-dom";

export default function ListarParceiros() {
  const emptyPartner = {
    id: null,
    firstName: "",
    lastName: "",
    age: "",
    client: "",
    client2: "",
    project: "",
    project2: "",
  };

  const [partners, setPartners] = useState([]);
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
      .then((data) => setPartners(formatarDados(data)))
      .catch((error) => console.error("Erro ao buscar parceiros:", error));
  };

  const formatarDados = (users) =>
    users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName} ${user.lastName}`,
      description: `Idade: ${user.age} anos`,
      age: user.age,
      clients: user.clients || [user.company?.name || "Sem empresa"],
      projects: user.projects || [
        `Projeto ${user.id}`,
        `Projeto ${user.id + 1}`,
      ],
    }));

  const updateURLWithPage = (page, rows) => {
    const params = new URLSearchParams(location.search);
    params.set("page", page + 1);
    params.set("rows", rows);
    navigate({ search: params.toString() });
  };

  const onPageChange = (event) => {
    setCurrentPage(event.page);
    setRowsPerPage(event.rows);
    updateURLWithPage(event.page, event.rows);
  };

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromURL = parseInt(params.get("page"), 10) || 1;
    const rowsFromURL = parseInt(params.get("rows"), 10) || 10;

    setCurrentPage(pageFromURL - 1);
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

    const payload = {
      firstName: partner.firstName,
      lastName: partner.lastName,
      age: parseInt(partner.age),
      clients: [partner.client, partner.client2],
      projects: [partner.project, partner.project2],
    };

    if (partner.id) {
      ParceirosService.putParceiro(partner.id, payload)
        .then((response) => {
          const updated = {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            fullName: `${response.firstName} ${response.lastName}`,
            description: `Idade: ${response.age} anos`,
            age: response.age,
            clients: [partner.client, partner.client2],
            projects: [partner.project, partner.project2],
          };

          setPartners((prev) =>
            prev.map((p) => (p.id === updated.id ? updated : p))
          );
          setPartner(emptyPartner);
          setPartnerDialog(false);

          toast.current.show({
            severity: "success",
            summary: "Sucesso!",
            detail: "Parceiro atualizado",
            life: 3000,
          });
        })
        .catch((error) => console.error("Erro ao salvar parceiro", error));
    } else {
      ParceirosService.postParceiro(payload)
        .then((response) => {
          const newPartner = {
            id: response.id,
            firstName: response.firstName,
            lastName: response.lastName,
            fullName: `${response.firstName} ${response.lastName}`,
            description: `Idade: ${response.age} anos`,
            age: response.age,
            clients: response.clients || [partner.client, partner.client2],
            projects: response.projects || [partner.project, partner.project2],
          };

          setPartners((prev) => [...prev, newPartner]);
          setPartner(emptyPartner);
          setPartnerDialog(false);

          toast.current.show({
            severity: "success",
            summary: "Sucesso!",
            detail: "Parceiro cadastrado",
            life: 3000,
          });
        })
        .catch((error) => console.error("Erro ao cadastrar parceiro", error));
    }
  };

  const editPartner = (rowData) => {
    setPartner({
      id: rowData.id,
      firstName: rowData.firstName,
      lastName: rowData.lastName,
      age: rowData.age,
      client: rowData.clients?.[0] || "",
      client2: rowData.clients?.[1] || "",
      project: rowData.projects?.[0] || "",
      project2: rowData.projects?.[1] || "",
    });
    setPartnerDialog(true);
  };

  const confirmDeletePartner = (rowData) => {
    setPartner(rowData);
    setDeletePartnerDialog(true);
  };

  const deletePartner = () => {
    ParceirosService.deleteParceiroById(partner.id).then(() => {
      setPartners((prev) => prev.filter((p) => p.id !== partner.id));
      setDeletePartnerDialog(false);
      setPartner(emptyPartner);

      toast.current.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Parceiro deletado",
        life: 3000,
      });
    });
  };

  const onInputChange = (e, name) => {
    const val = e.target.value;
    setPartner((prevState) => ({
      ...prevState,
      [name]: name === "age" ? parseInt(val) || 0 : val,
    }));
  };

  const actionBodyTemplate = (rowData) => (
    <>
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
    </>
  );

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
    <>
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
    </>
  );

  const deletePartnerDialogFooter = (
    <>
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
    </>
  );

  const formatArray = (rowData, attribute) =>
    (rowData[attribute] || []).map((item, index) => (
      <React.Fragment key={index}>
        {item}
        <br />
      </React.Fragment>
    ));

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
          <Column field="id" header="Código" sortable />
          <Column field="fullName" header="Nome" sortable />
          <Column field="description" header="Descrição" sortable />
          <Column
            header="Clientes"
            body={(rowData) => formatArray(rowData, "clients")}
          />
          <Column
            header="Projetos"
            body={(rowData) => formatArray(rowData, "projects")}
          />
          <Column body={actionBodyTemplate} />
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
        {[
          "firstName",
          "lastName",
          "age",
          "client",
          "client2",
          "project",
          "project2",
        ].map((field) => (
          <div className="field" key={field}>
            <label htmlFor={field} className="font-bold">
              {field.charAt(0).toUpperCase() +
                field.slice(1).replace(/[0-9]/g, " $&")}
            </label>
            <InputText
              id={field}
              value={partner[field]}
              onChange={(e) => onInputChange(e, field)}
            />
          </div>
        ))}
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
              Tem certeza que deseja excluir o parceiro:
              <br />
              <b>
                {partner.firstName} {partner.lastName}
              </b>
              ?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
