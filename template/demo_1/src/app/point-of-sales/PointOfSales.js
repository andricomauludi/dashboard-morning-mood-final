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
  const [deleteModal, setDeleteModal] = useState(false);
  const [saveBillModal, setSaveBillModal] = useState(false);
  const [doneModal, setDoneModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null); // State to keep track of the bill to delete

  const handleClose = () => setShow(false);
  const handleClose2 = () => setDoneModal(false);
  const handleCloseSaveBill = () => setSaveBillModal(false);
  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
    setSaveBillModal(true);
  };
  const handleShowDeleteModal = (billId) => {
    setSaveBillModal(false);
    setBillToDelete(billId);
    console.log(billId);
    setDeleteModal(true);
  };
  const handleShowSaveBill = () => {
    const fetchData4 = async () => {
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
    };
    fetchData4();
    setSaveBillModal(true);
  };
  const handleShow = (e) => {
    setShow(true);
    setRowid(e.currentTarget.value);
  };
  const [dataMakanan, setDataMakanan] = useState(null);
  const [dataMinuman, setDataMinuman] = useState(null);
  const [dataCemilan, setDataCemilan] = useState(null);
  const [dataBarbershop, setDataBarbershop] = useState(null);
  const [dataSavedBill, setSavedBill] = useState(null);
  const [currentBillId, setCurrentBillId] = useState(0); // State variable to keep track of current bill id
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

  const handleRowClick = async (billId) => {
    setCurrentBillId(billId);
    try {
      const response = await fetch(
        `http://localhost:8090/api/transaction/show_detail_bill/${billId}`
      );
      const data = await response.json();
      console.log(data.data);
      setSelectedImages(data.data); // assuming data is an array of images
      setSaveBillModal(false);
    } catch (error) {
      console.error("Error fetching bill details:", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    setLoadingModal(true); // Show loading modal

    formData.append("id", currentBillId);
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
      setCurrentBillId(0);

      // Close the modal after successful submission s
      handleClose();
      setDoneModal(true);
    } catch (error) {
      console.error("Error submitting data:", error);
    } finally {
      setLoadingModal(false); // Hide loading modal
    }
  };
  const handleDeleteBill = async (event) => {
    event.preventDefault();
    setLoadingModal(true); // Show loading modal
    setDeleteModal(false);

    const formData = new FormData();
    formData.append("id", billToDelete);

    try {
      const response = await axios.post(
        `http://localhost:8090/api/transaction/delete_bill`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message);
      setLoadingModal(false);
      setDeleteModal(false);
      setSelectedImages([]);
      setSelectedPayment("");
      setCurrentBillId(0);

      // Optionally, refresh the dataSavedBill list or remove the deleted item from the state
    } catch (error) {
      console.error("There was an error deleting the bill!", error);
      setDeleteModal(true);

      setLoadingModal(false); // Show loading modal
    }
  };

  const handleSaveBill = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    setLoadingModal(true); // Show loading modal

    formData.append("id", currentBillId);
    formData.append("nama_bill", "OrderSaveBill");
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
      setCurrentBillId(0);

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
    const fetchData5 = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://127.0.0.1:8090/api/product/barbershop"
        ); //ngambil api dari auth me
        setDataBarbershop(data);
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
    fetchData5();
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

        .col-1 {
            width: 8.33%;
        }

        .col-2 {
            width: 16.66%;
        }

        .col-3 {
            width: 25%;
        }

        .col-4 {
            width: 33.33%;
        }

        .col-5 {
            width: 41.66%;
        }

        .col-6 {
            width: 50%;
        }

        .col-7 {
            width: 58.33%;
        }

        .col-8 {
            width: 66.66%;
        }

        .col-9 {
            width: 75%;
        }

        .col-10 {
            width: 83.33%;
        }

        .col-11 {
            width: 91.66%;
        }

        .col-12 {
            width: 100%;
        }

        #receipt-modal p {
            margin: 5px 0;
            font-size: 10px;
        }

        #receipt-modal .text-center {
            text-align: center;
        }

        #receipt-modal .text-menu {
            font-size:8px;
            
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
                          <div class="col-2">
                              <h6 class="text-menu text-left ml-4">${item.jumlah}</h6>
                          </div>
                          <div class="col-10">
                            <h6 class="text-menu text-left">${item.nama_menu}</h6>
                          </div>
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
  if (!dataBarbershop) {
    return (
      <>
        <div>
          <h1>Loading ...</h1>
        </div>
      </>
    );
  }
  if (!dataSavedBill) {
  }

  const datas = dataMakanan.data;
  const datas2 = dataMinuman.data;
  const datas3 = dataCemilan.data;
  const datas4 = dataBarbershop.data;

  return (
    <>
      <div>
        <div className="page-header">
          <h3 className="page-title"> Kasir </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="!#" onClick={(event) => event.preventDefault()}>
                  Kasir
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
                            <div className="col-sm-6 col-md-3 col-lg-3">
                              <div className="row justify-content-center">
                                <div
                                  style={{
                                    height: 150,
                                    width: 150,
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
                              <div className="row justify-content-center text-center m-3">
                                <h6>{row.nama_menu}</h6>
                              </div>
                              <div className="row justify-content-center text-center m-3">
                                <h6>{formatPrice(row.harga)}</h6>
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
                              <div className="col-sm-6 col-md-3 col-lg-3">
                                <div className="row justify-content-center">
                                  <div
                                    style={{
                                      height: 150,
                                      width: 150,
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
                                <div className="row justify-content-center text-center m-3">
                                  <h6>{row.nama_menu}</h6>
                                </div>
                                <div className="row justify-content-center text-center m-3">
                                  <h6>{formatPrice(row.harga)}</h6>
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
                              <div className="col-sm-6 col-md-3 col-lg-3">
                                <div className="row justify-content-center">
                                  <div
                                    style={{
                                      height: 150,
                                      width: 150,
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
                                <div className="row justify-content-center text-center m-3">
                                  <h6>{row.nama_menu}</h6>
                                </div>
                                <div className="row justify-content-center text-center m-3">
                                  <h6>{formatPrice(row.harga)}</h6>
                                </div>
                              </div>
                            </>
                          ))}
                        </div>
                      </div>
                      <div className="item">
                        <h4 className="card-title">Barbershop</h4>
                        <div className="row">
                          {datas4.map((row, index) => (
                            <>
                              <div className="col-sm-6 col-md-3 col-lg-3">
                                <div className="row justify-content-center">
                                  <div
                                    style={{
                                      height: 150,
                                      width: 150,
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
                                <div className="row justify-content-center text-center m-3">
                                  <h6>{row.nama_menu}</h6>
                                </div>
                                <div className="row justify-content-center text-center m-3">
                                  <h6>{formatPrice(row.harga)}</h6>
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
                      className="btn btn-primary"
                      onClick={handleShowSaveBill}
                    >
                      Transaksi yang tersimpan
                    </button>
                  </div>
                </div>
                <h6>
                  Order: {currentBillId === 0 ? "New" : `#${currentBillId}`}
                </h6>
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
                    className="mt-3 btn btn-info btn-lg btn-block"
                    onClick={handleShow}
                    disabled={selectedImages.length === 0}
                  >
                    Lanjut Proses
                  </button>
                  <button
                    className="mt-3 btn btn-warning btn-lg btn-block"
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
                    className="form-control text-white form-control-lg"
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
                  className="btn btn-info btn-lg btn-block mr-5"
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
      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteModal}
        onHide={handleCloseDeleteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h5>Apakah Transaksi ini ingin didelete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteBill}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={saveBillModal}
        onHide={handleCloseSaveBill}
        backdrop="static"
        keyboard={false}
        dialogClassName="modal-90w"
        aria-labelledby="example-custom-modal-styling-title"
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
                <table className="table text-white table-striped">
                  <thead>
                    <tr>
                      <th>Nama Transaksi</th>
                      <th>Waktu Transaksi</th>
                      <th>Lama Transaksi Tersimpan</th>
                      <th>Delete</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dataSavedBill && dataSavedBill.length > 0 ? (
                      dataSavedBill.map((row, index) => (
                        <tr
                          key={index}
                          onClick={() => handleRowClick(row.Bill.id)}
                        >
                          <td>{"Order#" + row.Bill.id}</td>
                          <td>{formatDate(row.Bill.Timestamp)}</td>
                          <td>
                            <label className="badge badge-info">
                              <TimeSpent timestamp={row.Bill.Timestamp} />
                            </label>
                          </td>
                          <td>
                            <Button
                              variant="btn btn-danger"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleShowDeleteModal(row.Bill.id);
                              }}
                            >
                              Delete
                            </Button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center">
                          Tidak ada transaksi yang tersimpan.
                        </td>
                      </tr>
                    )}
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
                        <div className="col-8">
                          <div className="row">
                            <div className="col-2">
                              <h6
                                style={{ fontSize: "10px" }}
                                className="text-left ml-4"
                              >
                                {item.jumlah}
                              </h6>
                            </div>
                            <div className="col-10">
                              <h6
                                style={{ fontSize: "10px" }}
                                className="text-left"
                              >
                                {item.nama_menu}
                              </h6>
                            </div>
                          </div>
                        </div>
                        <div className="col-4">
                          <h6
                            className="text-right mr-4"
                            style={{ fontSize: "10px" }}
                          >
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
                <h6  className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Total Amount: {formatPrice(dataReceiptBill.total)}
                </h6>
                <p  className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Jenis Pembayaran: {dataReceiptBill.jenis_pembayaran}
                </p>
                <p  className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Uang Masuk : {formatPrice(dataReceiptBill.cash_in)}
                </p>
                <p  className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Uang Kembali : {formatPrice(dataReceiptBill.cash_out)}
                </p>
                <h5 className="text-center">
                  ===========================================
                </h5>
                <h6  className="text-center" style={{ fontSize: "10px" }}>
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
              className="mt-3 btn btn-success btn-lg btn-block"
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
