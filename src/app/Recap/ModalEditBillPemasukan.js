import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEditBillPemasukan = ({ show, handleClose, bill, handleSave, handleChange }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Bill</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group>
            <Form.Label>Nama Bill</Form.Label>
            <Form.Control 
              type="text" 
              name="nama_bill" 
              value={bill.nama_bill} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group controlId="formPaid">
            <Form.Label>Paid</Form.Label>
            <Form.Control
              as="select"
              style={{"color":"#ffffff"}}
              name="paid"
              value={bill.paid} 
              onChange={handleChange} 
            >
              <option value="1">Sudah Bayar</option>
              <option value="0">Belum Bayar</option>
            </Form.Control>
          </Form.Group>                
          <Form.Group controlId="formJenisPembayaran">
            <Form.Label>Jenis Pembayaran</Form.Label>
            <Form.Control
              as="select"
              style={{"color":"#ffffff"}}
              name="jenis_pembayaran"
              value={bill.jenis_pembayaran} 
              onChange={handleChange} 
            >
              <option value="Cash">Cash</option>
              <option value="Transfer Mandiri">Transfer Mandiri</option>
              <option value="Transfer BCA">Transfer BCA</option>
              <option value="QRIS">QRIS</option>
            </Form.Control>
          </Form.Group>         
          <Form.Group>
            <Form.Label>Total</Form.Label>
            <Form.Control 
              type="number" 
              name="total" 
              value={bill.total} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cash In</Form.Label>
            <Form.Control 
              type="number" 
              name="cash_in" 
              value={bill.cash_in} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Cash Out</Form.Label>
            <Form.Control 
              type="number" 
              name="cash_out" 
              value={bill.cash_out} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>ID Klien</Form.Label>
            <Form.Control 
              type="number" 
              name="id_klien" 
              value={bill.id_klien} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Nama Klien</Form.Label>
            <Form.Control 
              type="text" 
              name="nama_klien" 
              value={bill.nama_klien} 
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

export default ModalEditBillPemasukan;
