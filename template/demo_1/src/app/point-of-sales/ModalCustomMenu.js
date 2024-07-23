import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap"; // Assuming you're using Bootstrap for styling
import { BACKEND } from "../../constants";
import axios from "axios";

const ModalCustomMenu = ({
  show,
  handleClose,
  handleImageClick
}) => {
  const apiUrl = BACKEND;

  // State to manage form data
  const [loading, setLoading] = useState(false);
  const initialFormData = {
    nama_menu: "",
    jenis_menu: "",
    harga: 0,
    jumlah: 0,
    total_harga: 0,
  };
  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    let newFormData = {
      ...formData,
      [name]: name === "harga" ? parseInt(value) : value,
    };

    if (name === "harga" || name === "jumlah") {
      const harga = parseFloat(newFormData.harga);
      const jumlah = parseFloat(newFormData.jumlah);
      if (!isNaN(harga) && !isNaN(jumlah)) {
        newFormData.total_harga = Math.round(harga * jumlah);
      } else {
        newFormData.total_harga = "";
      }
    }

    setFormData(newFormData);
  };

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    console.log(formData)
    try {
      handleImageClick(formData)
      setLoading(false);
      handleClose();
      setFormData(initialFormData); // Reset form fields to initial state
    } catch (error) {
      console.error("Error creating menu custom:", error);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Buat Custom Menu</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formNamaMenu">
            <Form.Label>Nama Menu</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter nama menu"
              name="nama_menu"
              className="text-white"
              value={formData.nama_menu}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group>
            <label className="mt-2" htmlFor="exampleFormControlSelect2">
              Jenis Menu
            </label>
            <select
              className="form-control text-white form-control-lg"
              name="jenis_menu"
              value={formData.jenis_menu}
              onChange={handleInputChange}
            >
              {!formData.jenis_menu && (
                <option value="">
                  Silahkan klik untuk memilih jenis menu
                </option>
              )}              
              <option value="makanan">Makanan</option>
              <option value="minuman">Minuman</option>
              <option value="cemilan">Cemilan</option>
              <option value="barbershop">Barbershop</option>
            </select>
          </Form.Group>
          <Form.Group controlId="formHargaMenu">
            <Form.Label>Harga</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter harga"
              name="harga"
              className="text-white"
              value={formData.harga}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formJumlahMenu">
            <Form.Label>Jumlah</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter jumlah"
              name="jumlah"
              className="text-white"
              value={formData.jumlah}
              onChange={handleInputChange}
            />
          </Form.Group>
          <Form.Group controlId="formTotalHarga">
            <Form.Label>Total Harga</Form.Label>
            <Form.Control
              type="text"
              placeholder="Total harga akan terhitung otomatis"
              name="total_harga"
              className="text-dark"
              value={
                formData.total_harga === ""
                  ? ""
                  : formData.total_harga.toLocaleString()
              }
              disabled
            />
          </Form.Group>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? "Loading..." : "Submit"}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModalCustomMenu;
