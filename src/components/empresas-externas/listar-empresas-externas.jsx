import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import EmpresasExternasService from "../../services/empresas-externas.service";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { RadioButton } from "primereact/radiobutton";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Tag } from "primereact/tag";
import { useNavigate, useLocation } from "react-router-dom";

export default function ListarEmpresasExternas() {
  let emptyCompany = {
    nome: "",
    empresa: "",
    numColaboradores: "",
    status: "",
  };
  const [companies, setCompanies] = useState(null);
  const [companyDialog, setCompanyDialog] = useState(false);
  const [deleteCompanyDialog, setDeleteCompanyDialog] = useState(false);
  const [company, setCompany] = useState(emptyCompany);
  const [submitted, setSubmitted] = useState(false);
  const [globalFilter, setGlobalFilter] = useState(null);
  const toast = useRef(null);
  const dt = useRef(null);

  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

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

  const getEmpresasExternas = () => {
    EmpresasExternasService.getEmpresasExternas()
      .then((data) => {
        console.log(data.data);
        console.log(formatarEmpresas(data.data));
        setCompanies(formatarEmpresas(data.data));
      }) // Ajustando os dados antes de setar
      .catch((error) =>
        console.error("Erro ao buscar empresas externas:", error)
      );
  };

  const formatarEmpresas = (empresas) => {
    return empresas.map((empresa) => ({
      id: empresa.id,
      nome: empresa.nome || "Sem Nome",
      empresa: empresa.empresa || "Não Informada",
      numColaboradores: empresa.numColaboradores || 0,
      status: empresa.status || "Desconhecido",
    }));
  };

  // No carregamento da página, recupera os parâmetros da URL e ajusta a página atual
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pageFromURL = parseInt(params.get("page"), 10) || 1; // Padrão é 1 se não houver parâmetro
    const rowsFromURL = parseInt(params.get("rows"), 10) || 10;

    setCurrentPage(pageFromURL - 1); // pageFromURL começa em 1 na URL, mas em 0 na tabela
    setRowsPerPage(rowsFromURL);
    getEmpresasExternas(); // Chama o serviço para buscar os dados
  }, [location.search]);

  const openNew = () => {
    setCompany(emptyCompany);
    setSubmitted(false);
    setCompanyDialog(true);
  };

  const hideDialog = () => {
    setSubmitted(false);
    setCompanyDialog(false);
  };

  const hideDeleteCompanyDialog = () => {
    setDeleteCompanyDialog(false);
  };

  const saveCompany = () => {
    setSubmitted(true);
    setCompanyDialog(false);

    if (company.id) {
      EmpresasExternasService.putEmpresaExterna(company.id, company)
        .then((response) => {
          const savedCompany = response.data; // Dados completos vindos do backend

          let _companies = [...companies];

          const index = findIndexById(company.id);
          _companies[index] = savedCompany; // Atualizar a empresa com os dados do backend
          toast.current.show({
            severity: "success",
            summary: "Sucesso!",
            detail: "Empresa Atualizada",
            life: 3000,
          });

          setCompanies(_companies);
          setCompany(emptyCompany);
        })
        .catch((error) => {
          // Tratar erro, se necessário
          console.error("Erro ao salvar empresa", error);
        });
    } else {
      EmpresasExternasService.postEmpresaExterna(company)
        .then((response) => {
          const savedCompany = response.data; // Dados completos vindos do backend

          let _companies = [...companies];

          _companies.push(savedCompany); // Adicionar a nova empresa com os dados completos
          toast.current.show({
            severity: "success",
            summary: "Sucesso!",
            detail: "Empresa Cadastrada",
            life: 3000,
          });

          setCompanies(_companies);
          setCompany(emptyCompany);
        })
        .catch((error) => {
          // Tratar erro, se necessário
          console.error("Erro ao salvar parceira", error);
        });
    }
  };

  const editCompany = (company) => {
    setCompany({ ...company });
    setCompanyDialog(true);
  };

  const confirmDeleteCompany = (company) => {
    setCompany(company);
    setDeleteCompanyDialog(true);
  };

  const deleteCompany = () => {
    let _companies = companies.filter((val) => val.id !== company.id);

    setCompanies(_companies);
    setDeleteCompanyDialog(false);
    EmpresasExternasService.deleteEmpresaExternaById(company.id).then(() =>
      toast.current.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Empresa deletada.",
        life: 3000,
      })
    );
  };

  const findIndexById = (id) => {
    let index = -1;

    for (let i = 0; i < companies.length; i++) {
      if (companies[i].id === id) {
        index = i;
        break;
      }
    }

    return index;
  };

  const onInputChange = (e, name) => {
    const val = (e.target && e.target.value) || "";
    let _company = { ...company };

    _company[`${name}`] = val;

    setCompany(_company);
  };

  const statusBodyTemplate = (rowData) => {
    const status =
      rowData.status === true || rowData.status === "Ativa"
        ? "Ativa"
        : "Inativa";

    return <Tag value={status} severity={getSeverity(status)} />;
  };

  const getSeverity = (status) => {
    return status === "Ativa" ? "success" : "danger";
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
          onClick={() => editCompany(rowData)}
        />
        <Button
          icon="pi pi-trash"
          rounded
          outlined
          severity="danger"
          onClick={() => confirmDeleteCompany(rowData)}
        />
      </React.Fragment>
    );
  };

  const header = (
    <div className="header-container">
      <div className="header-left">
        <h4 className="m-0">Empresas Externas</h4>
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
          label="Adicionar Empresa Externa"
          icon="pi pi-plus"
          severity="success"
          onClick={openNew}
        />
      </div>
    </div>
  );

  const companyDialogFooter = (
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
        onClick={saveCompany}
        className="btn-orange"
      />
    </React.Fragment>
  );
  const deleteCompanyDialogFooter = (
    <React.Fragment>
      <Button
        label="Não"
        icon="pi pi-times"
        outlined
        className="btn-orange-not-bg"
        onClick={hideDeleteCompanyDialog}
      />
      <Button
        label="Sim"
        icon="pi pi-check"
        severity="danger"
        onClick={deleteCompany}
      />
    </React.Fragment>
  );

  const onCategoryChange = (e) => {
    let _company = { ...company };

    _company["isActive"] = e.value;
    setCompany(_company);
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className="card">
        <DataTable
          header={header}
          globalFilter={globalFilter}
          ref={dt}
          value={companies}
          dataKey="id"
          paginator
          first={currentPage * rowsPerPage}
          rows={rowsPerPage}
          onPage={onPageChange}
          rowsPerPageOptions={[5, 10, 25]}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
          currentPageReportTemplate="{first} ao {last} de {totalRecords} empresas"
        >
          <Column
            field="id"
            header="Código"
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            field="nome"
            header="Nome"
            sortable
            style={{ minWidth: "16rem" }}
          ></Column>
          <Column
            field="empresa"
            header="Empresa"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="numColaboradores"
            header="N° de Colaboradores"
            sortable
            style={{ minWidth: "10rem" }}
          ></Column>
          <Column
            field="status"
            header="Status"
            body={statusBodyTemplate}
            sortable
            style={{ minWidth: "12rem" }}
          ></Column>
          <Column
            body={actionBodyTemplate}
            style={{ minWidth: "12rem" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        visible={companyDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Dados da Empresa"
        modal
        className="p-fluid"
        footer={companyDialogFooter}
        onHide={hideDialog}
      >
        <div className="field">
          <label htmlFor="nome" className="font-bold">
            Nome
          </label>
          <InputText
            id="nome"
            value={company.nome}
            onChange={(e) => onInputChange(e, "nome")}
            autoFocus
          />
        </div>
        <div className="field">
          <label htmlFor="empresa" className="font-bold">
            Nome da Empresa
          </label>
          <InputText
            id="empresa"
            value={company.empresa}
            onChange={(e) => onInputChange(e, "empresa")}
          />
        </div>
        <div className="field">
          <label htmlFor="numColaboradores" className="font-bold">
            N° de Colaboradores
          </label>
          <InputText
            id="numColaboradores"
            value={company.numColaboradores}
            onChange={(e) => onInputChange(e, "numColaboradores")}
            keyfilter="int"
          />
        </div>
        <div className="field">
          <label className="mb-3 font-bold">Status da Empresa</label>

          <div className="formgrid grid">
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="status"
                name="status"
                value="Ativa"
                onChange={onCategoryChange}
                checked={company.status || company.status === "Ativa"}
              />
              <label className="mb-0" htmlFor="status">
                Ativa
              </label>
            </div>
            <div className="field-radiobutton col-6">
              <RadioButton
                inputId="status2"
                name="status2"
                value="Inativa"
                onChange={onCategoryChange}
                checked={company.status === "Inativa"}
              />
              <label className="mb-0" htmlFor="status2">
                Inativa
              </label>
            </div>
          </div>
        </div>
      </Dialog>

      <Dialog
        visible={deleteCompanyDialog}
        style={{ width: "32rem" }}
        breakpoints={{ "960px": "75vw", "641px": "90vw" }}
        header="Confirmar"
        modal
        footer={deleteCompanyDialogFooter}
        onHide={hideDeleteCompanyDialog}
      >
        <div className="confirmation-content">
          <i
            className="pi pi-exclamation-triangle mr-3"
            style={{ fontSize: "2rem" }}
          />
          {company && (
            <span>
              Tem certeza que deseja excluir a seguinte empresa: <br></br>
              <b>{company.name}</b>?
            </span>
          )}
        </div>
      </Dialog>
    </div>
  );
}
