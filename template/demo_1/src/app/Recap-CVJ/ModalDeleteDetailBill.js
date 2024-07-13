import React, { useState } from "react";
import { Modal, Button, ProgressBar } from "react-bootstrap";
import axios from "axios";
import { BACKEND } from "../../constants";

const ModalDeleteDetailBill = ({
  show,
  handleClose,
  detailBill,
  fetchData,
  fetchAllKeuntungan
}) => {
  const [loading, setLoading] = useState(false);
  const apiUrl = BACKEND;

  const handleConfirmDelete = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("id", detailBill.id);
    try {
      const response = await axios.post(
        `${apiUrl}/api/transaction/delete_detail_bill`,
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
    } catch (error) {
      console.error("Error deleting detail bill:", error);
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Body>
        <h5>Apakah detail bill ini ingin dihapus?</h5>
        {loading && <ProgressBar animated now={100} />}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="danger"
          onClick={handleConfirmDelete}
          disabled={loading}
        >
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDeleteDetailBill;
