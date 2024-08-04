import React, { Component, useEffect, useState } from "react";
import { Form, Image, Modal, ProgressBar, Row } from "react-bootstrap";
import axios from "axios";
import Button from "react-bootstrap/Button";
import "react-loading-wrapper/dist/index.css";
import Slider from "react-slick";
import TimeSpent from "./timestamphelper";
import logo from "../../assets/logo-ceu-monny.png";
import { BACKEND } from "../../constants";
import ModalCustomMenu from "./ModalCustomMenu";

export const PointOfSales = () => {
  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };
  const apiUrl = BACKEND;
  const [show, setShow] = useState(false);
  const [rowid, setRowid] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingModal, setLoadingModal] = useState(false);
  const [showModalCustom, setModalCustom] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [saveBillModal, setSaveBillModal] = useState(false);
  const [doneModal, setDoneModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState(null); // State to keep track of the bill to delete
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const handleCloseModalCustom = () => {
    setModalCustom(false); // Close modal
  };
  const handleShowCustomModal = (e) => {
    setModalCustom(true);
  };

  const handleButtonClick = (value) => {
    setSelectedTipe(value);
    setShowPaymentForm(true); // Show payment form when a button is clicked
  };

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
          apiUrl + "/api/transaction/show_saved_bill"
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
    console.log(selectedImages);
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
  const [selectedTipe, setSelectedTipe] = useState("");

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
    console.log(image);
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
        img.id === id
          ? {
              ...img,
              jumlah: parseInt(newCount) || 0,
              total_harga: parseInt(newCount) * img.harga,
            }
          : img
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
        apiUrl + `/api/transaction/show_detail_bill/${billId}`
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
    formData.append("tipe", selectedTipe);

    const modifiedSelectedImages = selectedImages.map(
      ({ id, ...rest }) => rest
    );

    try {
      // API call for bill
      const billResponse = await axios.post(
        apiUrl + "/api/transaction/create_bill",
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
        apiUrl + "/api/transaction/create_detail_bill_json",
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
      setSelectedTipe("");
      setCurrentBillId(0);
      setShowPaymentForm(false); // Show payment form when a button is clicked

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
        apiUrl + `/api/transaction/delete_bill`,
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
        apiUrl + "/api/transaction/create_bill",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const billId = billResponse.data.data.id;
      setDataReceiptBill(billResponse.data.data);
      // Include other necessary data for detail_bill here
      const modifiedSelectedImages2 = modifiedSelectedImages.map((image) => ({
        ...image,
        id_bill: billId,
      }));

      // API call for detail_bill
      const detailBillResponse = await axios.post(
        apiUrl + "/api/transaction/create_detail_bill_json",
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
        const { data } = await axios.get(apiUrl + "/api/product/makanan"); //ngambil api dari auth me
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
        const { data } = await axios.get(apiUrl + "/api/product/minuman"); //ngambil api dari auth me
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
        const { data } = await axios.get(apiUrl + "/api/product/cemilan"); //ngambil api dari auth me
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
        const { data } = await axios.get(apiUrl + "/api/product/barbershop"); //ngambil api dari auth me
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
          apiUrl + "/api/transaction/show_saved_bill"
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
        * {
            font-size: 12px;
            font-family: 'Times New Roman';
            width: 155px;

        }

        td,
        th,
        tr,
        table {
            /* border-top: 1px solid black; */
            border-collapse: collapse;
        }


        td.description,
        th.description {
            width: 90px;
            max-width: 90px;
        }

        td.quantity,
        th.quantity {
            width: 15px;
            max-width: 15px;
            word-break: break-all;
        }

        td.price,
        th.price {
            width: 50px;
            max-width: 50px;
            word-break: break-all;
        }

        .centered {
            text-align: center;
            align-content: center;
        }

        .ticket {
            width: 155px;
            max-width: 155px;
        }

        img {
            max-width: inherit;
            width: inherit;
        }

        hr {
            border: none;
            border-top: 1px solid black;
            margin: 10px 0;
        }
        .text-right {
            text-align: right;
            margin-left: auto;
            margin-right : 10px;
        }

        @media print {
            @page {
            width: 155px;
                margin: 0;
            }
            .hidden-print,
            .hidden-print * {
                display: none !important;
            }
        }
    </style>

    <div class="ticket">
        <img src=${logo} alt="Logo">
        <p class="centered" style="font-weight: bold;">Kedai Ceu Monny
            <br>Villa Bogor Indah 6, Blok B6 No.10. Sukaraja, Kabupaten Bogor
            <br>+62 821-1249-2060
        </p>
        <p>Order#${dataReceiptBill.id}</p>
        <hr />
        <table style="width: 100%;">
            <!-- <thead>
                <tr>
                    <th class="quantity">Jml.</th>
                    <th class="description">Menu</th>
                    <th class="price">Rp.</th>
                </tr>
            </thead> -->
            <tbody>
             ${
               dataReceiptDetailBill
                 ? dataReceiptDetailBill
                     .map(
                       (item) => `
                  <tr style="width: 10%;">
                    <td class="quantity">${item.jumlah}</td>
                    <td class="description">${item.nama_menu}</td>
                    <td class="price">${item.total_harga}</td>
                </tr>                   
                  `
                     )
                     .join("")
                 : "<p>Loading detail items...</p>"
             }
            </tbody>
        </table>
        <hr />

         <p class="text-right" style="font-weight:bold;">Total : ${formatPrice(
           dataReceiptBill.total
         )}
        </p>
        <p class="text-right">Jenis Pembayaran :
            <br>${dataReceiptBill.jenis_pembayaran}
        </p>
        <p class="text-right">Uang Masuk :
            <br>${formatPrice(dataReceiptBill.cash_in)}
        </p>
        <p class="text-right">Uang Keluar :
            <br>${formatPrice(dataReceiptBill.cash_out)}
        </p>
        <p class="centered">Waktu Pembayaran :
            <br>${formatDate(dataReceiptBill.Timestamp)}
            <br>Terimakasih
        </p>
    </div>   
    <script src="script.js"></script>
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
                        <h4 key="makanan" className="card-title">
                          Makanan
                        </h4>
                        <div className="row">
                          {datas.map((row, index) => (
                            <div className="col-sm-6 col-md-4 col-lg-3">
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
                        <h4 key="minuman" className="card-title">
                          Minuman
                        </h4>
                        <div className="row">
                          {datas2.map((row, index) => (
                            <>
                              <div className="col-sm-6 col-md-4 col-lg-3">
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
                        <h4 key="cemilan" className="card-title">
                          Cemilan
                        </h4>
                        <div className="row">
                          {datas3.map((row, index) => (
                            <>
                              <div className="col-sm-6 col-md-4 col-lg-3">
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
                        <h4 key="barbershop" className="card-title">
                          Barbershop
                        </h4>
                        <div className="row">
                          {datas4.map((row, index) => (
                            <>
                              <div className="col-sm-6 col-md-4 col-lg-3">
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
                        <h4 className="card-title">Custom</h4>
                        <div className="row">
                          <>
                            <div className="col-sm-6 col-md-4 col-lg-3">
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
                                    src={require("../../assets/images/custom-photo.png")}
                                    alt={`custom`}
                                    style={{
                                      display: "block",
                                      width: "100%",
                                      height: "100%",
                                      objectFit: "cover",
                                    }}
                                    onClick={() => handleShowCustomModal()}
                                    layout="fill"
                                  />
                                </div>
                              </div>
                              <div className="row justify-content-center text-center m-3">
                                <h6>Klik di sini untuk kustom menu</h6>
                              </div>
                              {/* <div className="row justify-content-center text-center m-3">
                                  <h6>{formatPrice(row.harga)}</h6>
                                </div> */}
                            </div>
                          </>
                        </div>
                      </div>
                    </Slider>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-8 grid-margin stretch-card floating-card-container">
            <div className="card floating-card">
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
                  {selectedImages.length > 0 ? (
                    <>
                      {selectedImages.map((image, index) => (
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
                                    handleCountChange(image.id, e.target.value)
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
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
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
        <Modal.Body>
          <div className="card">
            <div className="card-body">
              <h4 className="card-title">Pembayaran</h4>
              {/* <p>Order No : Order#109</p>
              <p>Klien : Guest</p> */}
              <h3 className="text-warning">
                Total Pembayaran {formatPrice(getTotalPrice())}
              </h3>
              <h6 className="text-danger">
                TRANSAKSI KEDAI CEU MONNY DAN CVJ HARAP DIPISAH
              </h6>
              <form onSubmit={handleSubmit} className="forms-sample">
                <div className="mb-3">
                  <button
                    type="button"
                    className={`btn ${
                      selectedTipe === "0"
                        ? "btn btn-warning btn-lg mr-5"
                        : "btn btn-outline-secondary btn-lg mr-5"
                    }`}
                    onClick={() => handleButtonClick("0")}
                  >
                    Kedai Ceu Monny
                  </button>
                  <button
                    type="button"
                    className={`btn ${
                      selectedTipe === "1"
                        ? "btn btn-warning btn-lg"
                        : "btn btn-outline-secondary btn-lg"
                    }`}
                    onClick={() => handleButtonClick("1")}
                  >
                    CVJ
                  </button>
                </div>

                {showPaymentForm && (
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
                      <option value="OVO">OVO</option>
                      <option value="Gopay">Gopay</option>
                    </select>
                  </Form.Group>
                )}

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
                      </Form.Group>
                    )}
                    {selectedPayment === "Transfer BCA" && (
                      <Form.Group>
                        <p>Silahkan transfer ke nomor rekening di bawah ini</p>
                        <label>Nomor Rekening BCA</label>
                        <h3 className="text-success">8410-0875-89</h3>
                      </Form.Group>
                    )}
                    {selectedPayment === "QRIS" && (
                      <Form.Group>
                        <p>Silahkan scan QRIS di bawah ini</p>
                        <label>QRIS Kedai Ceu Monny</label>
                        <div
                          style={{
                            height: 400,
                            width: 300,
                            position: "relative",
                            left:"auto",
                            overflow: "hidden",
                          }}
                        >
                          <Image
                            src={require("../../assets/images/qris-scan.jpeg")}
                            alt={`gambar-QRIS`}
                            style={{
                              display: "block",
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                            layout="fill"
                          />
                        </div>
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
                <h6 className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Total Amount: {formatPrice(dataReceiptBill.total)}
                </h6>
                <p className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Jenis Pembayaran: {dataReceiptBill.jenis_pembayaran}
                </p>
                <p className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Uang Masuk : {formatPrice(dataReceiptBill.cash_in)}
                </p>
                <p className="text-right mr-4" style={{ fontSize: "10px" }}>
                  Uang Kembali : {formatPrice(dataReceiptBill.cash_out)}
                </p>
                <h5 className="text-center">
                  ===========================================
                </h5>
                <h6 className="text-center" style={{ fontSize: "10px" }}>
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
      <ModalCustomMenu
        show={showModalCustom}
        handleClose={handleCloseModalCustom}
        handleImageClick={handleImageClick}
      />
    </>
  );
};
export default PointOfSales;
