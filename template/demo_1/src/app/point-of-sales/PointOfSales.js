import React, { Component, useEffect, useState } from "react";
import { Image, Modal, ProgressBar, Row } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import { Loading } from "react-loading-wrapper";
import "react-loading-wrapper/dist/index.css";
import { Doughnut } from "react-chartjs-2";
import Slider from "react-slick";

export const PointOfSales = () => {
  const [show, setShow] = useState(false);
  const [rowid, setRowid] = useState(false);
  const [loading, setLoading] = useState(true);

  const handleDelete = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8090/api/product", {
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
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("masuk");
        const { data } = await axios.get("http://127.0.0.1:8090/api/product"); //ngambil api dari auth me
        console.log(data);
        setData(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        return <div>Error {e} </div>;
      }

      setLoading(false);
    };
    fetchData();
    return;
    // dispatch(getSandwichLists());
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!datsa) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }

  const datas = datsa.data;
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
          <h3 className="page-title"> Inventory </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Inventory
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
                    <h4 className="card-title">Products</h4>
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
                        <th>Product Name</th>
                        <th>Price</th>
                        <th>Description</th>
                        <th>Menu type</th>
                        <th>Photo</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {datas.map((row, index) => (
                        <tr key={index}>
                          <td>{row.id}</td>
                          <td>{row.product_name}</td>
                          <td>Rp. {row.price} ,-</td>
                          <td>{row.description}</td>
                          <td>
                            <div className={getButtonColor(row.menu_type)}>
                              {row.menu_type}
                            </div>
                          </td>
                          <td>
                            <Image
                              src={`data:image/jpeg;base64,${row.photo}`}
                              layout="fill"
                              objectFit="cover"
                              style={{ margin: "auto", borderRadius: "50%" }}
                              alt="profile"
                            />
                          </td>
                          <td>
                            <div className="row">
                              <div className="col-md-6">
                                <a>
                                  <button
                                    className="btn btn-outline-danger"
                                    value={row.id}
                                    onClick={handleShow}
                                  >
                                    <i className="mdi mdi-delete-forever"></i>
                                  </button>
                                </a>
                              </div>
                              <div className="col-md-6">
                                <a>
                                  <button className="btn btn-outline-info">
                                    <i className="mdi mdi-table-edit"></i>
                                  </button>
                                </a>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-md-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="card">
                  <div className="card-body">
                    <div className="row">
                      {datas.map((row, index) => (
                        <div className="col-sm-6 col-md-4 col-lg-4">
                          <div className="row justify-content-center">
                            <div
                              style={{
                                height: 200,
                                width: 200,
                                position: "relative",
                                overflow: "hidden",
                              }}
                            >
                              <Image
                                src={`data:image/jpeg;base64,${row.photo}`}
                                alt={`${row.nama_menu}`}
                                style={{
                                  display: "block",
                                  width: "100%",
                                  height: "100%",
                                  objectFit: "cover",
                                }}
                                layout="fill"
                              />
                            </div>
                          </div>
                          <div className="row justify-content-center">
                            <h4>{row.nama_menu}</h4>                            
                          </div>
                          <div className="row justify-content-center">                            
                            <h4>{row.harga}</h4>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Transaction History</h4>
                <div className="aligner-wrapper">
                  <Doughnut
                  // data={this.transactionHistoryData}
                  // options={this.transactionHistoryOptions}
                  />
                  <div className="absolute center-content">
                    <h5 className="font-weight-normal text-whiite text-center mb-2 text-white">
                      1200
                    </h5>
                    <p className="text-small text-muted text-center mb-0">
                      Total
                    </p>
                  </div>
                </div>
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Transfer to Paypal</h6>
                    <p className="text-muted mb-0">07 Jan 2019, 09:12AM</p>
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">$236</h6>
                  </div>
                </div>
                <div className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3">
                  <div className="text-md-center text-xl-left">
                    <h6 className="mb-1">Tranfer to Stripe</h6>
                    <p className="text-muted mb-0">07 Jan 2019, 09:12AM</p>
                  </div>
                  <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                    <h6 className="font-weight-bold mb-0">$593</h6>
                  </div>
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
export default PointOfSales;
