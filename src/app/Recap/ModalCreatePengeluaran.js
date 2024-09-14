import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Assuming you're using Bootstrap for styling
import { BACKEND } from "../../constants";
import axios from "axios";

const ModalCreatePengeluaran = ({
  show,
  handleClose,
  fetchData,
  fetchAllKeuntungan,
}) => {
  const apiUrl = BACKEND;

  // State to manage form data
  const [loading, setLoading] = useState(false);
  const initialFormData = {
    nama_pengeluaran: "",
    jenis_pengeluaran: "",
    waktu_pengeluaran: new Date().toJSON(), // Set to today's timestamp in JSON format
    harga_pengeluaran: 0,
    jumlah_barang: 0,
    satuan: "",
    total_pengeluaran: 0,
    tipe: 0,
  };
  const [formData, setFormData] = useState(initialFormData);

  // Handle form input changes
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newFormData = {
      ...formData,
      [name]: value,
    };

    // Calculate total_pengeluaran only if both harga_pengeluaran and jumlah_barang are filled
    if (name === "harga_pengeluaran" || name === "jumlah_barang") {
      const harga_pengeluaran = parseFloat(newFormData.harga_pengeluaran);
      const jumlah_barang = parseFloat(newFormData.jumlah_barang);
      if (!isNaN(harga_pengeluaran) && !isNaN(jumlah_barang)) {
        newFormData.total_pengeluaran = Math.round(
          harga_pengeluaran * jumlah_barang
        );
      } else {
        newFormData.total_pengeluaran = "";
      }
    }

    setFormData(newFormData);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${apiUrl}/api/transaction/create_pengeluaran`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );      
      setLoading(false);
      handleClose();
      fetchData();
      fetchAllKeuntungan();
      setFormData(initialFormData); // Reset form fields to initial state
    } catch (error) {
      console.error("Error creating pengeluaran:", error);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Create Pengeluaran</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNamaPengeluaran">
            <Form.Label>Nama Pengeluaran</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter nama pengeluaran"
              name="nama_pengeluaran"
              className="text-white"
              value={formData.nama_pengeluaran}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formJenisPengeluaran">
            <Form.Label>Jenis Pengeluaran</Form.Label>
            <select
              name="jenis_pengeluaran"
              className="form-control text-white form-control-lg"
              value={formData.jenis_pengeluaran}
              onChange={handleInputChange}
            >
              <option value="">Pilih jenis pengeluaran</option>
              <option value="Cash">Cash</option>
              <option value="Transfer Mandiri">Transfer Mandiri</option>
              <option value="Transfer BCA">Transfer BCA</option>
              <option value="QRIS">QRIS</option>
              <option value="OVO">OVO</option>
            </select>
          </Form.Group>
          <Form.Group controlId="formHargaPengeluaran">
            <Form.Label>Harga Pengeluaran</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter harga pengeluaran"
              name="harga_pengeluaran"
              className="text-white"
              value={formData.harga_pengeluaran}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formJumlahBarang">
            <Form.Label>Jumlah Barang</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Jumlah Barang"
              name="jumlah_barang"
              className="text-white"
              value={formData.jumlah_barang}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formSatuan">
            <Form.Label>Satuan</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter Satuan"
              name="satuan"
              className="text-white"
              value={formData.satuan}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formTotalPengeluaran">
            <Form.Label>Total Pengeluaran</Form.Label>
            <Form.Control
              type="text" // Changed to text type to prevent .00 from showing
              placeholder="Total Pengeluaran akan terhitung otomatis"
              name="total_pengeluaran"
              className="text-dark"
              value={
                formData.total_pengeluaran === ""
                  ? ""
                  : formData.total_pengeluaran.toLocaleString()
              }
              disabled
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreatePengeluaran;
