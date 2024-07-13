import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const ModalEditDetailBill = ({ show, handleClose, detailBill, handleSave, handleChange }) => {
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Detail Bill</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* <Form.Group>
            <Form.Label>Order ID</Form.Label>
            <Form.Control 
              type="text" 
              name="id_bill" 
              value={detailBill.id_bill} 
              onChange={handleChange} 
              disabled
            />
          </Form.Group> */}
          <Form.Group>
            <Form.Label>Nama Menu</Form.Label>
            <Form.Control 
              type="text" 
              name="nama_menu" 
              value={detailBill.nama_menu} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Jumlah</Form.Label>
            <Form.Control 
              type="number" 
              name="jumlah" 
              value={detailBill.jumlah} 
              onChange={handleChange} 
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Total Harga</Form.Label>
            <Form.Control 
              type="number" 
              name="total_harga" 
              value={detailBill.total_harga} 
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

export default ModalEditDetailBill;
