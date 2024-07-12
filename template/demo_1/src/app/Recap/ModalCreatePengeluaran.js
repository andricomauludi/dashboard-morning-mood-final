import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Assuming you're using Bootstrap for styling
import { BACKEND } from "../../constants";
import axios from "axios";

const ModalCreatePengeluaran = ({ show, handleClose, fetchData, fetchAllKeuntungan }) => {
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
  };
  const [formData, setFormData] = useState(initialFormData);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
      console.log(response.data.message);
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
              value={formData.nama_pengeluaran}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formJenisPengeluaran">
            <Form.Label>Jenis Pengeluaran</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter jenis pengeluaran"
              name="jenis_pengeluaran"
              value={formData.jenis_pengeluaran}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formHargaPengeluaran">
            <Form.Label>Harga Pengeluaran</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter harga pengeluaran"
              name="harga_pengeluaran"
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
              value={formData.satuan}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formTotalPengeluaran">
            <Form.Label>Total Pengeluaran</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter Total Pengeluaran"
              name="total_pengeluaran"
              value={formData.total_pengeluaran}
              onChange={handleInputChange}
            />
          </Form.Group>
          {/* Add other form fields as needed */}
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCreatePengeluaran;
