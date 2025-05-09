import React, { Component, useEffect, useState } from "react";
import { Modal, ProgressBar, Row } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { BACKEND } from "../../constants/index.js";
import DataTable from "./DataTablePemasukan.js";
import DatatablePengeluaran from "./DataTablePengeluaran.js";
import { COLUMNSPEMASUKAN } from "./ColumnsPemasukan.js";
import { COLUMNSPENGELUARAN } from "./ColumnsPengeluaran.js";
import ModalCreatePengeluaran from "./ModalCreatePengeluaran.js";
import ExcelExportForm from "../Recap/ExcelExportForm.js";

export const RecapCvj = () => {
  const apiUrl = BACKEND;
  const [show, setShow] = useState(false);
  const [rowid, setRowid] = useState(false);
  const [loading, setLoading] = useState(true);

  function formatIDR(amount) {
    const formatter = new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    });
    return formatter.format(amount);
  }

  const handleDelete = async () => {
    try {
      const response = await fetch(apiUrl + "/api/product", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: parseInt(rowid) }), // Replace with your JSON data
      });

      if (response.ok) {
        console.log("Item deleted successfully");
        // Perform any additional actions upon successful deletion
      } else {
        console.error("Error deleting item:", response.status);
        // Handle the error appropriately
      }

      // Update the state or perform any other necessary actions
    } catch (error) {
      // Handle error
      console.error("Error deleting item:", error);
    }
  };

  const handleClose = () => setShow(false);
  const handleShow = (e) => {
    setShow(true);
    setRowid(e.currentTarget.value);
  };
  const [datsa, setData] = useState(null);
  const [datsaPengeluaran, setDataPengeluaran] = useState(null);
  const [datsaPendapatanHarian, setDataPendapatanHarian] = useState(null);
  const [datsaPengeluaranHarian, setDataPengeluaranHarian] = useState(null);
  const [datsaKeuntunganHarian, setDataKeuntunganHarian] = useState(null);
  const [datsaPendapatanBulanan, setDataPendapatanBulanan] = useState(null);
  const [datsaPengeluaranBulanan, setDataPengeluaranBulanan] = useState(null);
  const [datsaKeuntunganBulanan, setDataKeuntunganBulanan] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState({}); // State to hold modal data

  // Function to handle opening modal and set data
  const showModalPengeluaran = (rowData) => {
    setModalData(rowData); // Set modal data based on row data
    setShowModal(true); // Show modal
  };

  // Function to handle closing modal
  const handleCloseModalPengeluaran = () => {
    setShowModal(false); // Close modal
    setModalData({}); // Clear modal data
  };

  const fetchData = async () => {
    try {
      const response = await fetch(
        apiUrl + "/api/transaction/show_transaction_cvj"
      );
      const datsa = await response.json();
      setData(datsa);
    } catch (error) {
      return <div>Error {error} </div>;
    }
  };
  const fetchData2 = async () => {
    try {
      const response = await fetch(
        apiUrl + "/api/transaction/show_pengeluaran_cvj"
      );
      const datsa = await response.json();
      setDataPengeluaran(datsa);
    } catch (error) {
      return <div>Error {error} </div>;
    }
  };

  const fetchAllKeuntungan = async () => {
    try {
      const responsePemasukanToday = await fetch(
        apiUrl + "/api/pendapatan/show_pendapatan_harian_cvj"
      );
      const dataPemasukanToday = await responsePemasukanToday.json();
      setDataPendapatanHarian(dataPemasukanToday.total_today);

      const responsePemasukanMonth = await fetch(
        apiUrl + "/api/pendapatan/show_pendapatan_bulanan_cvj"
      );
      const dataPemasukanMonth = await responsePemasukanMonth.json();
      setDataPendapatanBulanan(dataPemasukanMonth.total_current_month);

      const responsePengeluaranToday = await fetch(
        apiUrl + "/api/pendapatan/show_pengeluaran_harian_cvj"
      );
      const dataPengeluaranToday = await responsePengeluaranToday.json();
      setDataPengeluaranHarian(dataPengeluaranToday.total_pengeluaran_today);

      const responsePengeluaranMonth = await fetch(
        apiUrl + "/api/pendapatan/show_pengeluaran_bulanan_cvj"
      );
      const dataPengeluaranMonth = await responsePengeluaranMonth.json();
      setDataPengeluaranBulanan(
        dataPengeluaranMonth.total_pengeluaran_current_month
      );

      const responseKeuntunganToday = await fetch(
        apiUrl + "/api/pendapatan/show_keuntungan_harian_cvj"
      );
      const dataKeuntunganToday = await responseKeuntunganToday.json();
      setDataKeuntunganHarian(
        dataKeuntunganToday.total_keuntungan_bersih_current_day
      );

      const responseKeuntunganMonth = await fetch(
        apiUrl + "/api/pendapatan/show_keuntungan_bulanan_cvj"
      );
      const dataKeuntunganMonth = await responseKeuntunganMonth.json();
      setDataKeuntunganBulanan(
        dataKeuntunganMonth.total_keuntungan_bersih_current_month
      );
    } catch (error) {
      console.error("Error fetching data:", error);
      // Handle errors as needed
    }
  };

  useEffect(() => {
    fetchData();
    fetchData2();
    fetchAllKeuntungan();
    return;
    // dispatch(getSandwichLists());
  }, []);

  if (!datsa) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }
  if (!datsaPengeluaran) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }

  const datas = datsa.data;
  const datasPengeluaran = datsaPengeluaran.data;
  function getButtonColor(data) {
    if (data === "rice") {
      return "badge badge-outline-primary";
    } else if (data === "sandwich") {
      return "badge badge-outline-success";
    }
    if (data === "coffee") {
      return "badge badge-outline-warning";
    } else {
      return "badge badge-outline-info";
    }
  }

  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title">
            {" "}
            Rekap <label className="badge badge-warning">CVJ</label>
          </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Rekap CVJ
                </a>
              </li>
              {/* <li className="breadcrumb-item active" aria-current="page">Basic tables</li> */}
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg, #0000ff, #ffffff)", // Gradient from blue to white
              }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0 text-dark">
                        {formatIDR(datsaPendapatanHarian)}
                      </h3>
                      {/* <p className="text-success ml-2 mb-0 font-weight-medium">
              +3.5%
            </p> */}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-dark">
                      <span className="mdi mdi-cash-usd icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-dark font-weight-normal">
                  Pemasukan Hari Ini
                </h6>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(to right, #FFA500, #FFFFFF)", // Gradient from orange to white
              }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0 text-dark">
                        {formatIDR(datsaPengeluaranHarian)}
                      </h3>
                      {/* <p className="text-success ml-2 mb-0 font-weight-medium">
              +11%
            </p> */}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-dark">
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-dark font-weight-normal">
                  Pengeluaran Hari ini
                </h6>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                background: "linear-gradient(135deg, #808080, #ffffff)", // Gradient from grey to white
              }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0" style={{ color: "yellow" }}>
                        {formatIDR(datsaKeuntunganHarian)}
                      </h3>
                      {/* <p
              className="text-danger ml-2 mb-0 font-weight-medium"
              style={{ color: "#39ff14" }}
            >
              -2.4%
            </p> */}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-dark">
                      <span
                        className="mdi mdi-cash-multiple icon-item"
                        style={{ color: "yellow" }}
                      ></span>
                    </div>
                  </div>
                </div>
                <h6 className="font-weight-normal text-dark">
                  Pendapatan Bersih Hari ini
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                backgroundImage: "linear-gradient(to right, #000000, #0000ff)", // Gradient from black to blue
              }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0" style={{ color: "blue" }}>
                        {formatIDR(datsaPendapatanBulanan)}
                      </h3>
                      {/* <p
              className="text-success ml-2 mb-0 font-weight-medium"
              style={{ color: "#39ff14" }}
            >
              +3.5%
            </p> */}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-dark">
                      <span className="mdi mdi-cash-usd icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-white font-weight-normal">
                  Pemasukan Bulan Ini
                </h6>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                backgroundImage: "linear-gradient(to right, #000000, #FFA500)", // Gradient from black to orange
              }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0" style={{ color: "#FFA500" }}>
                        {formatIDR(datsaPengeluaranBulanan)}
                      </h3>
                      {/* <p
              className="text-success ml-2 mb-0 font-weight-medium"
              style={{ color: "#ff0000" }}
            >
              +11%
            </p> */}
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-dark">
                      <span className="mdi mdi-arrow-top-right icon-item"></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-white font-weight-normal">
                  Pengeluaran Bulan ini
                </h6>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 grid-margin stretch-card">
            <div
              className="card"
              style={{
                backgroundImage: "linear-gradient(to right, #000000, #808080)", // Gradient from black to grey
              }}
            >
              <div className="card-body">
                <div className="row">
                  <div className="col-9">
                    <div className="d-flex align-items-center align-self-start">
                      <h3 className="mb-0" style={{ color: "yellow" }}>
                        {formatIDR(datsaKeuntunganBulanan)}
                      </h3>
                    </div>
                  </div>
                  <div className="col-3">
                    <div className="icon icon-box-dark">
                      <span
                        className="mdi mdi-cash-multiple icon-item"
                        style={{ color: "yellow" }}
                      ></span>
                    </div>
                  </div>
                </div>
                <h6 className="text-white font-weight-normal">
                  Pendapatan Bersih Bulan ini
                </h6>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Row>
                  <div className="col-lg-6 grid-margin stretch-card">
                    {/* <label className="badge badge-success"> */}

                    <h4 className="card-title text-success">
                      Rekap Pemasukan CVJ
                    </h4>
                    {/* </label> */}
                  </div>
                  <div className="col-lg-6 mr-auto text-sm-right ">
                    {/* <a href="/inventory/create" className="align-items-right">
                      <button className="btn btn-outline-warning">
                        <span>
                          <i className="mdi mdi-plus"></i>
                        </span>
                        Create Pemasukan
                      </button>
                    </a> */}
                    <ExcelExportForm
                      jenisLayanan={1}
                      jenisRekap={"pemasukan"}
                    />
                  </div>
                </Row>
                <div className="table-responsive">
                  <DataTable
                    columns={COLUMNSPEMASUKAN}
                    data={datas}
                    fetchData={fetchData}
                    fetchAllKeuntungan={fetchAllKeuntungan}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Row>
                  <div className="col-lg-6 grid-margin stretch-card">
                    <h4 className="card-title text-danger">
                      Rekap Pengeluaran CVJ
                    </h4>
                  </div>
                  <div className="col-lg-6 mr-auto text-sm-right ">
                    <div className="row mb-3">
                      <div className="col-lg-12 mr-auto text-sm-right">
                        <button
                          className="btn btn-warning"
                          onClick={() => showModalPengeluaran()}
                        >
                          <span>
                            <i className="mdi mdi-plus"></i>
                          </span>
                          Create Pengeluaran
                        </button>
                      </div>
                    </div>
                    <div className="row mb-3">
                      <div className="col-lg-12 mr-auto text-sm-right">
                        <ExcelExportForm
                          jenisLayanan={1}
                          jenisRekap={"pengeluaran"}
                        />
                      </div>
                    </div>
                  </div>
                </Row>
                <div className="table-responsive">
                  <DatatablePengeluaran
                    columns={COLUMNSPENGELUARAN}
                    data={datasPengeluaran}
                    fetchData={fetchData2}
                    fetchAllKeuntungan={fetchAllKeuntungan}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        {/* <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header> */}
        <Modal.Body>
          <Loading
            loading={loading}
            // Optional props
            color="orange"
            backgroundColor="blue"
            fullPage
            size={100}
            speed="fast"
            // Use your own component, or the 'threeDots' component for the loading screen (default is spinner).
            loadingComponent="threeDots"
          ></Loading>

          <div className="text-center">
            <i
              sty
              className="icon-lg text-danger mdi mdi-comment-question-outline"
            ></i>
          </div>
          <div className="text-center">Are you sure want to delete ?</div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <ModalCreatePengeluaran
        show={showModal}
        fetchData={fetchData2}
        handleShow={showModalPengeluaran}
        handleClose={handleCloseModalPengeluaran}
        fetchAllKeuntungan={fetchAllKeuntungan}
      />
    </>
  );
};
export default RecapCvj;
