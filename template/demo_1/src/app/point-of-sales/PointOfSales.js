import React, { Component, useEffect, useState } from "react";
import { Form, Image, Modal, ProgressBar, Row } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "react-loading-wrapper/dist/index.css";
import Slider from "react-slick";

export const PointOfSales = () => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
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
  const [dataMakanan, setDataMakanan] = useState(null);
  const [dataMinuman, setDataMinuman] = useState(null);
  const [dataCemilan, setDataCemilan] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);

  const handleImageClick = (image) => {
    setSelectedImages((prevState) => {
      const existingImage = prevState.find((img) => img.id === image.id);
      if (existingImage) {
        return prevState.map((img) =>
          img.id === image.id ? { ...img, count: img.count + 1 } : img
        );
      }
      return [...prevState, { ...image, count: 1 }];
    });
  };

  const handleCountChange = (id, newCount) => {
    setSelectedImages((prevState) =>
      prevState.map((img) =>
        img.id === id ? { ...img, count: parseInt(newCount) || 0 } : img
      )
    );
  };
  const handleDelete2 = (id) => {
    setSelectedImages((prevState) => prevState.filter((img) => img.id !== id));
  };

  const getTotalCount = () => {
    return selectedImages.reduce((total, image) => total + image.count, 0);
  };

  const getTotalPrice = () => {
    return selectedImages.reduce(
      (total, image) => total + image.count * image.harga,
      0
    );
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        console.log("masuk");
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/makanan"
        ); //ngambil api dari auth me
        console.log(data);
        setDataMakanan(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        return <div>Error {e} </div>;
      }

      setLoading(false);
    };
    const fetchData2 = async () => {
      setLoading(true);
      try {
        console.log("masuk");
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/minuman"
        ); //ngambil api dari auth me
        console.log(data);
        setDataMinuman(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        return <div>Error {e} </div>;
      }

      setLoading(false);
    };
    const fetchData3 = async () => {
      setLoading(true);
      try {
        console.log("masuk");
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/cemilan"
        ); //ngambil api dari auth me
        console.log(data);
        setDataCemilan(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        return <div>Error {e} </div>;
      }

      setLoading(false);
    };
    fetchData();
    fetchData2();
    fetchData3();
    return;
    // dispatch(getSandwichLists());
  }, []);

  if (loading) return <p>Loading...</p>;

  if (!dataMakanan) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }
  if (!dataMinuman) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }
  if (!dataCemilan) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }

  const datas = dataMakanan.data;
  const datas2 = dataMinuman.data;
  const datas3 = dataCemilan.data;
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
          <div className="col-md-8 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <div className="card">
                  <div className="card-body">
                    <Slider className="portfolio-slider" {...sliderSettings}>
                      <div className="item">
                        <h4 className="card-title">Makanan</h4>
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
                                    onClick={() => handleImageClick(row)}
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
                      <div className="item">
                        <h4 className="card-title">Minuman</h4>
                        <div className="row">
                          {datas2.map((row, index) => (
                            <>
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
                                      onClick={() => handleImageClick(row)}
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
                            </>
                          ))}
                        </div>
                      </div>
                      <div className="item">
                        <h4 className="card-title">Cemilan</h4>
                        <div className="row">
                          {datas3.map((row, index) => (
                            <>
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
                                      onClick={() => handleImageClick(row)}
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
                            </>
                          ))}
                        </div>
                      </div>
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-4 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Bill</h4>
                <div className="aligner-wrapper">
                  {/* <h2>Selected Images:</h2> */}
                  {selectedImages.length > 0 ? (
                    <>
                      {selectedImages.map((image, index) => (
                        <>
                          <div
                            key={index}
                            className="bg-gray-dark d-flex d-md-block d-xl-flex flex-row py-3 px-4 px-md-3 px-xl-4 rounded mt-3"
                          >
                            <div className="text-md-center text-xl-left">
                              <h6 className="mb-1">{image.nama_menu}</h6>
                              <div className="form-inline">
                                <p className="text-muted mb-0">
                                  {formatPrice(image.harga)} x{" "}
                                  <input
                                    type="number"
                                    value={image.count}
                                    min="0"
                                    className="form-control"
                                    onChange={(e) =>
                                      handleCountChange(
                                        image.id,
                                        e.target.value
                                      )
                                    }
                                    style={{ width: "60px" }}
                                  />
                                </p>
                              </div>
                            </div>
                            <div className="align-self-center flex-grow text-right text-md-center text-xl-right py-md-2 py-xl-0">
                              <h6 className="font-weight-bold mb-2">
                                {formatPrice(image.harga * image.count)}{" "}
                              </h6>
                              <button
                                className="btn btn-rounded btn-inverse-danger"
                                onClick={() => handleDelete2(image.id)}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      ))}
                    </>
                  ) : (
                    <></>
                    // <p>No images selected yet.</p>
                  )}
                  {/* <h3>Total Count: {getTotalCount()}</h3> */}
                  <div className="row mt-3">
                    <div className="col-lg-6 text-xl-left">
                      <h6>Total Pembayaran:</h6>
                    </div>
                    <div className="col-lg-6 text-xl-right">
                      <h6>{formatPrice(getTotalPrice())}</h6>
                    </div>
                  </div>
                  <button
                    className="mt-3 btn btn-inverse-info btn-lg btn-block"
                    onClick={handleShow}
                  >
                    Bayar
                  </button>
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
        <div className="card">
              <div className="card-body">
                <h4 className="card-title">Pembayaran</h4>
                <p className="card-description"> Total Pembayaran {formatPrice(getTotalPrice())} </p>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="exampleInputUsername1">Username</label>
                    <Form.Control type="text" id="exampleInputUsername1" placeholder="Username" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputEmail1">Email address</label>
                    <Form.Control type="email" className="form-control" id="exampleInputEmail1" placeholder="Email" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputPassword1">Password</label>
                    <Form.Control type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="exampleInputConfirmPassword1">Confirm Password</label>
                    <Form.Control type="password" className="form-control" id="exampleInputConfirmPassword1" placeholder="Password" />
                  </Form.Group>
                  <div className="form-check">
                    <label className="form-check-label text-muted">
                      <input type="checkbox" className="form-check-input"/>
                      <i className="input-helper"></i>
                      Remember me
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary mr-2">Submit</button>
                  <button className="btn btn-dark">Cancel</button>
                </form>
              </div>
            </div>          
        </Modal.Body>       
      </Modal>
    </>
  );
};
export default PointOfSales;
