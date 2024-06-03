import React, { Component, useEffect, useState } from "react";
import { Form, Image, Modal, ProgressBar, Row } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "react-loading-wrapper/dist/index.css";
import Slider from "react-slick";
import TimeSpent from "./timestamphelper";

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
  const [loadingModal, setLoadingModal] = useState(false);
  const [saveBillModal, setSaveBillModal] = useState(false);
  const [doneModal, setDoneModal] = useState(false);

  const handleClose = () => setShow(false);
  const handleClose2 = () => setDoneModal(false);
  const handleCloseSaveBill = () => setSaveBillModal(false);
  const handleShowSaveBill = () => setSaveBillModal(true);
  const handleShow = (e) => {
    setShow(true);
    setRowid(e.currentTarget.value);
  };
  const [dataMakanan, setDataMakanan] = useState(null);
  const [dataMinuman, setDataMinuman] = useState(null);
  const [dataCemilan, setDataCemilan] = useState(null);
  const [dataSavedBill, setSavedBill] = useState(null);
  const [dataReceiptBill, setDataReceiptBill] = useState(null);
  const [dataReceiptDetailBill, setDataReceiptDetailBill] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [cashPaid, setCashPaid] = useState("");
  const [cashPaidDisplay, setCashPaidDisplay] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");

  const handlePaymentChange = (event) => {
    const paymentType = event.target.value;
    setSelectedPayment(paymentType);

    if (paymentType === "Cash") {
      setCashPaid("");
      setCashPaidDisplay("");
    } else {
      const totalAmount = getTotalPrice();
      setCashPaid(totalAmount.toString());
      setCashPaidDisplay(formatCash(totalAmount.toString()));
    }
  };

  const handleImageClick = (image) => {
    setSelectedImages((prevState) => {
      const existingImage = prevState.find((img) => img.id === image.id);
      if (existingImage) {
        return prevState.map((img) =>
          img.id === image.id
            ? {
                ...img,
                jumlah: img.jumlah + 1,
                total_harga: (img.jumlah + 1) * img.harga, // Calculate total_harga
              }
            : img
        );
      }
      return [
        ...prevState,
        {
          ...image,
          jumlah: 1,
          total_harga: image.harga, // Initialize total_harga with harga for new image
        },
      ];
    });
  };

  const handleCountChange = (id, newCount) => {
    setSelectedImages((prevState) =>
      prevState.map((img) =>
        img.id === id ? { ...img, jumlah: parseInt(newCount) || 0 } : img
      )
    );
  };
  const handleDelete2 = (id) => {
    setSelectedImages((prevState) => prevState.filter((img) => img.id !== id));
  };

  const getTotalCount = () => {
    return selectedImages.reduce((total, image) => total + image.jumlah, 0);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta", // Set timezone to Indonesia
    };
    return date.toLocaleString("id-ID", options); // Convert timestamp to Indonesian date time string
  };

  // PERUANGAN DUNIAWI
  const formatCash = (value) => {
    const num = value.replace(/\D/g, ""); // Remove non-numeric characters
    return num.replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Add dots for every three digits
  };

  const handleCashChange = (event) => {
    const value = event.target.value;
    // Remove non-numeric characters
    const numericValue = value.replace(/\D/g, "");

    setCashPaid(numericValue); // Set cashPaid as a number without dots

    // Format the numeric value for display
    const formattedValue = formatCash(numericValue);
    setCashPaidDisplay(formattedValue);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    setLoadingModal(true); // Show loading modal

    formData.append("nama_bill", "#Order#109");
    formData.append("id_klien", 1);
    formData.append("nama_klien", "guest");
    formData.append("total", getTotalPrice());
    formData.append("jenis_pembayaran", selectedPayment);
    formData.append("cash_in", cashPaid);
    formData.append("cash_out", calculateChange());
    formData.append("paid", 1);

    const modifiedSelectedImages = selectedImages.map(
      ({ id, ...rest }) => rest
    );

    try {
      // API call for bill
      const billResponse = await axios.post(
        "http://127.0.0.1:8090/api/transaction/create_bill",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const billId = billResponse.data.data.id;
      setDataReceiptBill(billResponse.data.data);
      console.log(billId);
      // Include other necessary data for detail_bill here
      const modifiedSelectedImages2 = modifiedSelectedImages.map((image) => ({
        ...image,
        id_bill: billId,
      }));

      // API call for detail_bill
      const detailBillResponse = await axios.post(
        "http://127.0.0.1:8090/api/transaction/create_detail_bill_json",
        modifiedSelectedImages2
      );

      console.log("Detail bill response:", detailBillResponse.data.data);
      setDataReceiptDetailBill(detailBillResponse.data.data);
      // const detailBillResponse = await axios.post("http://127.0.0.1:8090/api/transaction/create_detail_bill_json", {
      //  modifiedSelectedImages
      // });

      // Clear selectedImages and selectedPayment after sending data
      setSelectedImages([]);
      setSelectedPayment("");

      // Close the modal after successful submission s
      handleClose();
      setDoneModal(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoadingModal(false); // Hide loading modal
    }
  };
  const handleSaveBill = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    setLoadingModal(true); // Show loading modal

    formData.append("nama_bill", "OrderSaveBill");
    formData.append("id_klien", 1);
    formData.append("nama_klien", "guest");
    formData.append("total", getTotalPrice());
    formData.append("jenis_pembayaran", "null");
    formData.append("cash_in", 0);
    formData.append("cash_out", 0);
    formData.append("paid", 0);

    const modifiedSelectedImages = selectedImages.map(
      ({ id, ...rest }) => rest
    );

    try {
      // API call for bill
      const billResponse = await axios.post(
        "http://127.0.0.1:8090/api/transaction/create_bill",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const billId = billResponse.data.data.id;
      setDataReceiptBill(billResponse.data.data);
      console.log(billId);
      // Include other necessary data for detail_bill here
      const modifiedSelectedImages2 = modifiedSelectedImages.map((image) => ({
        ...image,
        id_bill: billId,
      }));

      // API call for detail_bill
      const detailBillResponse = await axios.post(
        "http://127.0.0.1:8090/api/transaction/create_detail_bill_json",
        modifiedSelectedImages2
      );

      console.log("Detail bill response:", detailBillResponse.data.data);
      setDataReceiptDetailBill(detailBillResponse.data.data);
      // const detailBillResponse = await axios.post("http://127.0.0.1:8090/api/transaction/create_detail_bill_json", {
      //  modifiedSelectedImages
      // });

      // Clear selectedImages and selectedPayment after sending data
      setSelectedImages([]);
      setSelectedPayment("");

      // Close the modal after successful submission s
      handleClose();
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoadingModal(false); // Hide loading modal
    }
  };

  const getTotalPrice = () => {
    return selectedImages.reduce(
      (total, image) => total + image.jumlah * image.harga,
      0
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };
  const totalAmount = getTotalPrice();

  const parseCash = (value) => {
    return parseFloat(value.replace(/\./g, ""));
  };

  const calculateChange = () => {
    const cash = parseCash(cashPaid);
    return cash && cash > totalAmount ? cash - totalAmount : 0;
  };

  const isCashEnough = () => {
    const cash = parseCash(cashPaid);
    return cash && cash >= totalAmount;
  };

  const changeTextClass = () => {
    const cash = parseCash(cashPaid);
    return cash && cash >= totalAmount ? "text-success" : "text-danger";
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/makanan"
        ); //ngambil api dari auth me
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
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/minuman"
        ); //ngambil api dari auth me
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
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/cemilan"
        ); //ngambil api dari auth me
        setDataCemilan(data);
        setLoading(false);
      } catch (e) {
        setLoading(false);
        return <div>Error {e} </div>;
      }

      setLoading(false);
    };
    const fetchData4 = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/transaction/show_saved_bill"
        ); //ngambil api dari transaction
        setSavedBill(data.data);
        // console.log(data.data)
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
    fetchData4();
    return;
    // dispatch(getSandwichLists());
  }, []);

  const printReceipt = () => {
    const printContent = generateReceiptContent();
    const printWindow = window.open("", "_blank");
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
  };

  // <ReceiptHelperContent dataReceiptBill={dataReceiptBill}/>

  const generateReceiptContent = () => {
    const receiptContent = `
    <style>
        body * {
            visibility: hidden;
        }

        #receipt-modal,
        #receipt-modal * {
            visibility: visible;
        }

        #receipt-modal {
            font-family: Arial, sans-serif;
            background-color: #fff;
            padding: 20px;
            border: 1px solid #ccc;
            width: 58mm;
            /* Adjust the width as needed */
            margin: 0 auto;
        }

        #receipt-modal h2 {
            font-size: 20px;
            margin-bottom: 10px;
        }

        #receipt-modal hr {
            border: none;
            border-top: 1px solid #ccc;
            margin: 10px 0;
        }

        #receipt-modal .row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0px;
            margin:0px;
        }

        #receipt-modal .col-6 {
            flex: 0 0 50%;
        }

        #receipt-modal p {
            margin: 5px 0;
            font-size: 10px;
        }

        #receipt-modal .text-center {
            text-align: center;
        }

        #receipt-modal .text-left {
            text-align: left;
            
        }

        #receipt-modal .text-right {
            text-align: right;
            
        }

        #receipt-modal .text-dark {
            color: #000 !important;
        }

        #receipt-modal .bg-white {
            background-color: #fff !important;
        }

        #receipt-modal .text-success {
            color: #28a745 !important;
        }

        #receipt-modal .text-danger {
            color: #dc3545 !important;
        }
    </style>
  
      <div id="receipt-modal">
        <h2 class="text-center">Kedai Ceu Monny</h2>
        <h5 class="text-center">Villa Bogor Indah 6, Blok B6 No.10. Sukaraja, Kabupaten Bogor</h5>
        <h5 class="text-center">+62 821-1249-2060</h5>
        <p>Order#${dataReceiptBill.id}</p>
        <hr style="margin-bottom:20px;" />
        ${
          dataReceiptDetailBill
            ? dataReceiptDetailBill
                .map(
                  (item) => `
                    <div class="row" style="padding:0px; margin-top:-30px; margin-bottom:-20px">
                      <div class="col-6">
                        <div class="row">
                          <h6 class="text-left ml-4">${item.jumlah}</h6>
                          <h6 class="text-left ml-4">${item.nama_menu}</h6>
                        </div>
                      </div>
                      <div class="col-6">
                        <h6 class="text-right mr-4">${formatPrice(
                          item.total_harga
                        )}</h6>
                      </div>
                    </div>
                  `
                )
                .join("")
            : "<p>Loading detail items...</p>"
        }
        <hr />
        <div class="row">
          <div class="col-6">
            <h6 class="text-right mr-4">Total Amount:</h6>
          </div>
          <div class="col-6">
            <h6 class="text-right mr-4">${formatPrice(
              dataReceiptBill.total
            )}</h6>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <p class="text-right mr-4">Jenis Pembayaran:</p>
          </div>
          <div class="col-6">
            <p class="text-right mr-4">${dataReceiptBill.jenis_pembayaran}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <p class="text-right mr-4">Uang Masuk :</p>
          </div>
          <div class="col-6">
            <p class="text-right mr-4">${formatPrice(
              dataReceiptBill.cash_in
            )}</p>
          </div>
        </div>
        <div class="row">
          <div class="col-6">
            <p class="text-right mr-4">Uang Kembali :</p>
          </div>
          <div class="col-6">
            <p class="text-right mr-4">${formatPrice(
              dataReceiptBill.cash_out
            )}</p>
          </div>
        </div>
        <h6 class="text-center">Waktu Pembayaran : ${formatDate(
          dataReceiptBill.Timestamp
        )}</h6>
        <h5 class="text-center">Terimakasih</h5>
      </div>
    `;
    return receiptContent;
  };

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
  if (!dataSavedBill) {
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

  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Point of Sales </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Point of Sales
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
                <div className="row">
                  <div className="col-6">
                    <h4 className="card-title">Transaksi</h4>
                  </div>
                  <div className="col-6">
                    <button
                      className="btn btn-inverse-primary"
                      onClick={handleShowSaveBill}
                    >
                      Transaksi yang tersimpan
                    </button>
                  </div>
                </div>
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
                                    value={image.jumlah}
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
                                {formatPrice(image.harga * image.jumlah)}{" "}
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
                    disabled={selectedImages.length === 0}
                  >
                    Lanjut Proses
                  </button>
                  <button
                    className="mt-3 btn btn-inverse-warning btn-lg btn-block"
                    onClick={handleSaveBill}
                    disabled={selectedImages.length === 0}
                  >
                    Save Bill
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
              <p>Order No : Order#109</p>
              <p>Klien : Guest</p>
              {/* <p className="card-description"> Total Pembayaran {formatPrice(getTotalPrice())} </p> */}
              <h3 className="text-warning">
                {" "}
                Total Pembayaran {formatPrice(getTotalPrice())}{" "}
              </h3>
              <form onSubmit={handleSubmit} className="forms-sample">
                <Form.Group>
                  <label className="mt-2" htmlFor="exampleFormControlSelect2">
                    Jenis Pembayaran
                  </label>
                  <select
                    className="form-control text-white"
                    id="exampleFormControlSelect2"
                    value={selectedPayment}
                    onChange={handlePaymentChange}
                  >
                    {!selectedPayment && (
                      <option value="">
                        Silahkan klik untuk memilih jenis pembayaran
                      </option>
                    )}
                    <option value="Cash">Cash</option>
                    <option value="Transfer Mandiri">Transfer Mandiri</option>
                    <option value="Transfer BCA">Transfer BCA</option>
                    <option value="QRIS">QRIS</option>
                  </select>
                </Form.Group>

                {selectedPayment && (
                  <>
                    {selectedPayment === "Cash" && (
                      <Form.Group>
                        <label htmlFor="cashInfo">Uang yang Dibayar</label>
                        <Form.Control
                          type="text"
                          id="cashInfo"
                          className="text-white"
                          placeholder="Berapa uang cash yang diterima"
                          value={cashPaidDisplay}
                          onChange={handleCashChange}
                        />
                        {cashPaid && (
                          <h3 className={changeTextClass()}>
                            {isCashEnough()
                              ? `Kembalian: ${formatPrice(calculateChange())}`
                              : "Uang yang diberikan tidak cukup"}
                          </h3>
                        )}
                      </Form.Group>
                    )}
                    {selectedPayment === "Transfer Mandiri" && (
                      <Form.Group>
                        <p>Silahkan transfer ke nomor rekening di bawah ini</p>
                        <label>Nomor Rekening Mandiri</label>
                        <h3 className="text-success">1330-0109-5082-2</h3>
                        {/* ini masih rekening mandiri */}
                      </Form.Group>
                    )}
                    {selectedPayment === "Transfer BCA" && (
                      <Form.Group>
                        <p>Silahkan transfer ke nomor rekening di bawah ini</p>
                        <label>Nomor Rekening BCA</label>
                        <h3 className="text-success">8410-0875-89</h3>
                      </Form.Group>
                    )}
                  </>
                )}

                <button
                  type="submit"
                  className="btn btn-inverse-info btn-lg btn-block mr-5"
                  disabled={
                    !selectedPayment ||
                    (selectedPayment === "Cash" && !isCashEnough())
                  }
                >
                  Bayar
                </button>
                <button
                  type="button"
                  onClick={handleClose}
                  className="btn btn-inverse-danger btn-lg btn-block mr-5"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={loadingModal}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="text-center">
            <p>Saving...</p>
            <ProgressBar animated now={100} />
          </div>
        </Modal.Body>
      </Modal>
      <Modal
        show={saveBillModal}
        onHide={handleCloseSaveBill}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Transaksi yang tersimpan</h4>
              <p className="card-description">
                {" "}
                list transaksi yang belum dibayar
              </p>
              <div className="table-responsive">
                <table className="table table-hover text-white table-striped">
                  <thead>
                    <tr>
                      <th>Nama Transaksi</th>
                      <th>Waktu Transaksi</th>
                      <th>Lama Transaksi Tersimpan</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSavedBill.map((row, index) => (
                      <>
                        <tr>
                          <td>{row.Bill.nama_bill}</td>
                          <td>{formatDate(row.Bill.Timestamp)}</td>
                          <td>
                            <label className="badge badge-info">
                            <TimeSpent timestamp={row.Bill.Timestamp} />
                            </label>
                          </td>
                        </tr>
                      </>
                    ))}                  
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="btn btn-inverse-danger btn-lg"
            onClick={handleCloseSaveBill}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={doneModal}
        onHide={handleClose2}
        dialogClassName="modal-90w"
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Receipt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="bg-white text-dark p-4">
            {dataReceiptBill ? (
              <>
                <h2 className="text-center">Kedai Ceu Monny</h2>
                <h5 className="text-center">
                  Villa Bogor Indah 6, Blok B6 No.10. Sukaraja, Kabupaten Bogor
                </h5>
                <h5 className="text-center">+62 821-1249-2060</h5>
                {/* <p>Bill ID: {dataReceiptBill.id}</p> */}
                <p>Order#{dataReceiptBill.id}</p>
                {console.log(dataReceiptBill)}
                <h5 className="text-center">
                  ===========================================
                </h5>
                {dataReceiptDetailBill ? (
                  <>
                    {dataReceiptDetailBill.map((item) => (
                      <div key={item.id} className="row">
                        <div className="col-6">
                          <div className="row">
                            <h6 className="text-left ml-4">{item.jumlah}</h6>
                            <h6 className="text-left ml-4">{item.nama_menu}</h6>
                          </div>
                        </div>
                        <div className="col-6">
                          <h6 className="text-right mr-4">
                            {formatPrice(item.total_harga)}
                          </h6>
                        </div>
                      </div>
                    ))}
                  </>
                ) : (
                  <p>Loading detail items...</p>
                )}
                <h5 className="text-center">
                  ===========================================
                </h5>
                <h6 className="text-right mr-4">
                  Total Amount: {formatPrice(dataReceiptBill.total)}
                </h6>
                <p className="text-right mr-4">
                  Jenis Pembayaran: {dataReceiptBill.jenis_pembayaran}
                </p>
                <p className="text-right mr-4">
                  Uang Masuk : {formatPrice(dataReceiptBill.cash_in)}
                </p>
                <p className="text-right mr-4">
                  Uang Kembali : {formatPrice(dataReceiptBill.cash_out)}
                </p>
                <h5 className="text-center">
                  ===========================================
                </h5>
                <h6 className="text-center">
                  Waktu Pembayaran : {formatDate(dataReceiptBill.Timestamp)}
                </h6>
                <h5 className="text-center">Terimakasih</h5>
              </>
            ) : (
              <p>Loading items...</p>
            )}
          </div>
          <div>
            <button
              className="mt-3 btn btn-inverse-info btn-lg btn-block"
              onClick={printReceipt}
            >
              Print Resi
            </button>
            {/* <button
              className="mt-3 btn btn-inverse-info btn-lg btn-block"
              onClick={handleShow}
            >
              Kirim Email
            </button> */}
          </div>

          {/* <h4>Modal Content Goes Here</h4>
          <p>
            This modal will take up the entire screen. You can add any content
            here.
          </p> */}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="btn btn-inverse-danger btn-lg"
            onClick={handleClose2}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default PointOfSales;
