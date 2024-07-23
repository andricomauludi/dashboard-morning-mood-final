import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEditPengeluaran = ({ show, handleClose, bill, handleSave, handleChange }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Pengeluaran</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nama Bill</Form.Label>
            <Form.Control 
              type="text" 
              name="nama_pengeluaran" 
              value={bill.nama_pengeluaran} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Jenis Pengleuaran</Form.Label>
            <Form.Control 
              type="text" 
              name="jenis_pengeluaran" 
              value={bill.jenis_pengeluaran} 
              onChange={handleChange} 
            />
          </Form.Group>
                 
          <Form.Group>
            <Form.Label>Harga Pengeluaran</Form.Label>
            <Form.Control 
              type="number" 
              name="harga_pengeluaran" 
              value={bill.harga_pengeluaran} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Jumlah Barang</Form.Label>
            <Form.Control 
              type="number" 
              name="jumlah_barang" 
              value={bill.jumlah_barang} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Satuan</Form.Label>
            <Form.Control 
              type="text" 
              name="satuan" 
              value={bill.satuan} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Pengeluaran</Form.Label>
            <Form.Control 
              type="number" 
              name="total_pengeluaran" 
              value={bill.total_pengeluaran} 
              onChange={handleChange} 
            />
          </Form.Group>          
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalEditPengeluaran;
