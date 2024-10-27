import React, { useState } from "react";
import axios from "axios";
import { Button, Form, Modal } from "react-bootstrap";
import { BACKEND } from "../../constants";

const ExcelExportForm = ({ jenisLayanan, jenisRekap }) => {
  const apiUrl = BACKEND;

  const [showModal, setShowModal] = useState(false);
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");

  const handleShow = () => setShowModal(true);
  const handleClose = () => {
    setShowModal(false);
    setDownloadUrl(""); // Reset download URL when closing modal
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData = new FormData();
    console.log(jenisLayanan);
    formData.append("jenis_layanan", jenisLayanan); //kalau 0 ceu monny, kalau 1 cvj
    formData.append("day", day);
    formData.append("month", month);
    formData.append("year", year);

    if (jenisRekap == "pemasukan") {
      try {
        const response = await axios.post(
          `${apiUrl}/api/transaction/excel_export`,
          formData,
          { responseType: "blob" }
        );

        // Create a URL for the file
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadUrl(fileURL);
      } catch (error) {
        console.error("Error exporting Excel file:", error);
      }
    } else {
      console.log("masuk ke pengeluaran");

      try {
        const response = await axios.post(
          `${apiUrl}/api/transaction/excel_export_pengeluaran`,
          formData,
          { responseType: "blob" }
        );

        // Create a URL for the file
        const fileURL = window.URL.createObjectURL(new Blob([response.data]));
        setDownloadUrl(fileURL);
      } catch (error) {
        console.error("Error exporting Excel file:", error);
      }
    }
  };

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Export to Excel
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Export Excel</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formDay">
              <Form.Label>Tanggal Hari</Form.Label>
              <Form.Control
                style={{ color: "white" }}
                type="text"
                placeholder="Masukkan tanggal, Biarkan kosong bila memilih semua tanggal"
                name="day"
                value={day}
                onChange={(e) => setDay(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMonth">
              <Form.Label>Bulan</Form.Label>
              <Form.Control
                className="text-white"
                as="select"
                name="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              >
                <option value="">
                  Pilih bulan, Biarkan kosong apabila memilih semua bulan
                </option>
                <option value="01">Januari</option>
                <option value="02">Februari</option>
                <option value="03">Maret</option>
                <option value="04">April</option>
                <option value="05">Mei</option>
                <option value="06">Juni</option>
                <option value="07">Juli</option>
                <option value="08">Agustus</option>
                <option value="09">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formYear">
              <Form.Label>Tahun</Form.Label>
              <Form.Control
                type="text"
                style={{ color: "white" }}
                name="year"
                placeholder="Masukkan tahun, Biarkan kosong bila memilih semua tahun"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>
            <Button variant="warning" type="submit">
              Export Excel
            </Button>
          </Form>
          {downloadUrl && (
            <div className="mt-3">
              <a
                href={downloadUrl}
                download={
                  jenisLayanan === 0 && jenisRekap === "pemasukan"
                    ? "rekap-pemasukan-ceu-monny.xlsx"
                    : jenisLayanan === 0 && jenisRekap === "pengeluaran"
                    ? "rekap-pengeluaran-ceu-monny.xlsx"
                    : jenisLayanan === 1 && jenisRekap === "pemasukan"
                    ? "rekap-pemasukan-cvj.xlsx"
                    : jenisLayanan === 1 && jenisRekap === "pengeluaran"
                    ? "rekap-pengeluaran-cvj.xlsx"
                    : "rekap.xlsx"
                }
              >
                <Button variant="primary" type="button">
                  Klik di sini untuk download excel
                </Button>
              </a>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ExcelExportForm;
