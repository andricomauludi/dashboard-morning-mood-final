import React from 'react';

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

const formatDate = (timestamp) => {
  const date = new Date(timestamp);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit", //
    second: "2-digit",
    timeZone: "Asia/Jakarta", // Set timezone to Indonesia
  };
  return date.toLocaleString("id-ID", options); // Convert timestamp to Indonesian date time string
};
const ReceiptHelperContent = ({ dataReceiptBill, dataReceiptDetailBill }) => {
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

export default ReceiptHelperContent;
