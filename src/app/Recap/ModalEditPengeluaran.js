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
          <Form.Group controlId="formJenisPengeluaran">
            <Form.Label>Jenis Pengeluaran</Form.Label>
            <select
              name="jenis_pengeluaran"
              className="form-control text-white form-control-lg"
              value={bill.jenis_pengeluaran} 
              onChange={handleChange} 
            >
              <option value="">Pilih jenis pengeluaran</option>
              <option value="Cash">Cash</option>
              <option value="Transfer Mandiri">Transfer Mandiri</option>
              <option value="Transfer BCA">Transfer BCA</option>
              <option value="QRIS">QRIS</option>
              <option value="OVO">OVO</option>
            </select>
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
