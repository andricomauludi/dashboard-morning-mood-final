import React, { Component, useEffect, useState } from "react";
import { Modal, ProgressBar, Row } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { BACKEND } from "../../constants/index.js";
import DataTable from "./DataTablePemasukan.js";
import { COLUMNSPEMASUKAN } from "./ColumnsPemasukan.js";

export const Recap = () => {
  const apiUrl = BACKEND;
  const [show, setShow] = useState(false);
  const [rowid, setRowid] = useState(false);
  const [loading, setLoading] = useState(true);

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
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          apiUrl + "/api/transaction/show_transaction"
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
          apiUrl + "/api/transaction/show_pengeluaran"
        );
        const datsa = await response.json();
        setDataPengeluaran(datsa);
      } catch (error) {
        return <div>Error {error} </div>;
      }
    };
    fetchData();
    fetchData2();
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
          <h3 className="page-title"> Rekap </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Rekap
                </a>
              </li>
              {/* <li className="breadcrumb-item active" aria-current="page">Basic tables</li> */}
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <Row>
                  <div className="col-lg-6 grid-margin stretch-card">
                    {/* <label className="badge badge-success"> */}

                    <h4 className="card-title text-success">Rekap Pemasukan</h4>
                    {/* </label> */}
                  </div>
                  <div className="col-lg-6 mr-auto text-sm-right ">
                    <a href="/inventory/create" className="align-items-right">
                      <button className="btn btn-outline-warning">
                        <span>
                          <i className="mdi mdi-plus"></i>
                        </span>
                        Create Pemasukan
                      </button>
                    </a>
                  </div>
                </Row>
                <div className="table-responsive">
                  <DataTable columns={COLUMNSPEMASUKAN} data={datas} />
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
                      Rekap Pengeluaran
                    </h4>
                  </div>
                  <div className="col-lg-6 mr-auto text-sm-right ">
                    <a href="/inventory/create" className="align-items-right">
                      <button className="btn btn-outline-warning">
                        <span>
                          <i className="mdi mdi-plus"></i>
                        </span>
                        Create Product
                      </button>
                    </a>
                  </div>
                </Row>
                <div className="table-responsive">
                  <table className="table table-dark table-hover">
                    <thead>
                      <tr>
                        <th>id</th>
                        <th>Nama Pengeluaran</th>
                        <th>Jenis Pengeluaran</th>
                        <th>Waktu Pengeluaran</th>
                        <th>Harga Pengeluaran</th>
                        <th>Jumlah Barang</th>
                        <th>Satuan</th>
                        <th>Total Pengeluaran</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datasPengeluaran && datasPengeluaran.length > 0 ? (
                        datasPengeluaran.map((row, index) => (
                          <tr
                            key={index}                          
                          >
                            <td>{"Pengeluaran #" + row.id}</td>
                            <td>{row.nama_pengeluaran}</td>
                            <td>
                              <label className="badge badge-warning">
                                {row.jenis_pengeluaran}
                              </label>
                            </td>
                            <td>{row.waktu_pengeluaran}</td>
                            <td>{row.harga_pengeluaran}</td>
                            <td>{row.jumlah_barang}</td>
                            <td>{row.satuan}</td>
                            <td>{row.total_pengeluaran}</td>
                            <td>
                              <button className="btn btn-danger">Delete</button>
                              <button className="btn btn-primary">Edit</button>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="4" className="text-center">
                            Tidak ada pengeluaran yang tersimpan.
                          </td>
                        </tr>
                      )}                    
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Transactions</h4>
                <p className="card-description">
                  {" "}
                  Add className <code>.table-hover</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Product</th>
                        <th>Sale</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jacob</td>
                        <td>Photoshop</td>
                        <td className="text-danger">
                          {" "}
                          28.76% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td>
                          <label className="badge badge-danger">Pending</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Messsy</td>
                        <td>Flash</td>
                        <td className="text-danger">
                          {" "}
                          21.06% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td>
                          <label className="badge badge-warning">
                            In progress
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td>Premier</td>
                        <td className="text-danger">
                          {" "}
                          35.00% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td>
                          <label className="badge badge-info">Fixed</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Peter</td>
                        <td>After effects</td>
                        <td className="text-success">
                          {" "}
                          82.00% <i className="mdi mdi-arrow-up"></i>
                        </td>
                        <td>
                          <label className="badge badge-success">
                            Completed
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>Dave</td>
                        <td>53275535</td>
                        <td className="text-success">
                          {" "}
                          98.05% <i className="mdi mdi-arrow-up"></i>
                        </td>
                        <td>
                          <label className="badge badge-warning">
                            In progress
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Transaction</h4>
                <p className="card-description">
                  {" "}
                  Add className <code>.table-hover</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Product</th>
                        <th>Sale</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Jacob</td>
                        <td>Photoshop</td>
                        <td className="text-danger">
                          {" "}
                          28.76% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td>
                          <label className="badge badge-danger">Pending</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Messsy</td>
                        <td>Flash</td>
                        <td className="text-danger">
                          {" "}
                          21.06% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td>
                          <label className="badge badge-warning">
                            In progress
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>John</td>
                        <td>Premier</td>
                        <td className="text-danger">
                          {" "}
                          35.00% <i className="mdi mdi-arrow-down"></i>
                        </td>
                        <td>
                          <label className="badge badge-info">Fixed</label>
                        </td>
                      </tr>
                      <tr>
                        <td>Peter</td>
                        <td>After effects</td>
                        <td className="text-success">
                          {" "}
                          82.00% <i className="mdi mdi-arrow-up"></i>
                        </td>
                        <td>
                          <label className="badge badge-success">
                            Completed
                          </label>
                        </td>
                      </tr>
                      <tr>
                        <td>Dave</td>
                        <td>53275535</td>
                        <td className="text-success">
                          {" "}
                          98.05% <i className="mdi mdi-arrow-up"></i>
                        </td>
                        <td>
                          <label className="badge badge-warning">
                            In progress
                          </label>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Striped Table</h4>
                <p className="card-description">
                  {" "}
                  Add className <code>.table-striped</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-striped">
                    <thead>
                      <tr>
                        <th> User </th>
                        <th> First name </th>
                        <th> Progress </th>
                        <th> Amount </th>
                        <th> Deadline </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face1.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> Herman Beck </td>
                        <td>
                          <ProgressBar variant="success" now={25} />
                        </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face2.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> Messsy Adam </td>
                        <td>
                          <ProgressBar variant="danger" now={75} />
                        </td>
                        <td> $245.30 </td>
                        <td> July 1, 2015 </td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face3.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> John Richards </td>
                        <td>
                          <ProgressBar variant="warning" now={90} />
                        </td>
                        <td> $138.00 </td>
                        <td> Apr 12, 2015 </td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face4.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> Peter Meggik </td>
                        <td>
                          <ProgressBar variant="primary" now={50} />
                        </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face5.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> Edward </td>
                        <td>
                          <ProgressBar variant="danger" now={60} />
                        </td>
                        <td> $ 160.25 </td>
                        <td> May 03, 2015 </td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face6.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> John Doe </td>
                        <td>
                          <ProgressBar variant="info" now={65} />
                        </td>
                        <td> $ 123.21 </td>
                        <td> April 05, 2015 </td>
                      </tr>
                      <tr>
                        <td className="py-1">
                          <img
                            src={require("../../assets/images/faces/face7.jpg")}
                            alt="user icon"
                          />
                        </td>
                        <td> Henry Tom </td>
                        <td>
                          <ProgressBar variant="warning" now={20} />
                        </td>
                        <td> $ 150.00 </td>
                        <td> June 16, 2015 </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Bordered table</h4>
                <p className="card-description">
                  {" "}
                  Add className <code>.table-bordered</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th> # </th>
                        <th> First name </th>
                        <th> Progress </th>
                        <th> Amount </th>
                        <th> Deadline </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> 1 </td>
                        <td> Herman Beck </td>
                        <td>
                          <ProgressBar variant="success" now={25} />
                        </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr>
                        <td> 2 </td>
                        <td> Messsy Adam </td>
                        <td>
                          <ProgressBar variant="danger" now={75} />
                        </td>
                        <td> $245.30 </td>
                        <td> July 1, 2015 </td>
                      </tr>
                      <tr>
                        <td> 3 </td>
                        <td> John Richards </td>
                        <td>
                          <ProgressBar variant="warning" now={90} />
                        </td>
                        <td> $138.00 </td>
                        <td> Apr 12, 2015 </td>
                      </tr>
                      <tr>
                        <td> 4 </td>
                        <td> Peter Meggik </td>
                        <td>
                          <ProgressBar variant="primary" now={50} />
                        </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr>
                        <td> 5 </td>
                        <td> Edward </td>
                        <td>
                          <ProgressBar variant="danger" now={35} />
                        </td>
                        <td> $ 160.25 </td>
                        <td> May 03, 2015 </td>
                      </tr>
                      <tr>
                        <td> 6 </td>
                        <td> John Doe </td>
                        <td>
                          <ProgressBar variant="info" now={65} />
                        </td>
                        <td> $ 123.21 </td>
                        <td> April 05, 2015 </td>
                      </tr>
                      <tr>
                        <td> 7 </td>
                        <td> Henry Tom </td>
                        <td>
                          <ProgressBar variant="warning" now={20} />
                        </td>
                        <td> $ 150.00 </td>
                        <td> June 16, 2015 </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Inverse table</h4>
                <p className="card-description">
                  {" "}
                  Add className <code>.table-dark</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-dark">
                    <thead>
                      <tr>
                        <th> # </th>
                        <th> First name </th>
                        <th> Amount </th>
                        <th> Deadline </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td> 1 </td>
                        <td> Herman Beck </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr>
                        <td> 2 </td>
                        <td> Messsy Adam </td>
                        <td> $245.30 </td>
                        <td> July 1, 2015 </td>
                      </tr>
                      <tr>
                        <td> 3 </td>
                        <td> John Richards </td>
                        <td> $138.00 </td>
                        <td> Apr 12, 2015 </td>
                      </tr>
                      <tr>
                        <td> 4 </td>
                        <td> Peter Meggik </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr>
                        <td> 5 </td>
                        <td> Edward </td>
                        <td> $ 160.25 </td>
                        <td> May 03, 2015 </td>
                      </tr>
                      <tr>
                        <td> 6 </td>
                        <td> John Doe </td>
                        <td> $ 123.21 </td>
                        <td> April 05, 2015 </td>
                      </tr>
                      <tr>
                        <td> 7 </td>
                        <td> Henry Tom </td>
                        <td> $ 150.00 </td>
                        <td> June 16, 2015 </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-12 stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Table with contextual classNames</h4>
                <p className="card-description">
                  {" "}
                  Add className <code>.table-&#123;color&#125;</code>
                </p>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th> # </th>
                        <th> First name </th>
                        <th> Product </th>
                        <th> Amount </th>
                        <th> Deadline </th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="table-info">
                        <td> 1 </td>
                        <td> Herman Beck </td>
                        <td> Photoshop </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr className="table-warning">
                        <td> 2 </td>
                        <td> Messsy Adam </td>
                        <td> Flash </td>
                        <td> $245.30 </td>
                        <td> July 1, 2015 </td>
                      </tr>
                      <tr className="table-danger">
                        <td> 3 </td>
                        <td> John Richards </td>
                        <td> Premeire </td>
                        <td> $138.00 </td>
                        <td> Apr 12, 2015 </td>
                      </tr>
                      <tr className="table-success">
                        <td> 4 </td>
                        <td> Peter Meggik </td>
                        <td> After effects </td>
                        <td> $ 77.99 </td>
                        <td> May 15, 2015 </td>
                      </tr>
                      <tr className="table-primary">
                        <td> 5 </td>
                        <td> Edward </td>
                        <td> Illustrator </td>
                        <td> $ 160.25 </td>
                        <td> May 03, 2015 </td>
                      </tr>
                    </tbody>
                  </table>
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
    </>
  );
};
export default Recap;
