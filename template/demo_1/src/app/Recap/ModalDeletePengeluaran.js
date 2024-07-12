import axios from "axios";
import React, { useEffect, useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import { BACKEND } from "../../constants";

const ModalDeletePengeluaran = ({
  deleteModal,
  handleCloseDeleteModal,
  pengeluaranToDelete,
  handleShowDeleteModal,
  fetchData,
  fetchAllKeuntungan
}) => {
  const apiUrl = BACKEND;
  const [loadingModal, setLoadingModal] = useState(false);

  const handleDeleteBill = async (event) => {
    console.log(pengeluaranToDelete);
    setLoadingModal(true); // Show loading modal

    const formData = new FormData();
    formData.append("id", pengeluaranToDelete);

    try {
      const response = await axios.post(
        `${apiUrl}/api/transaction/delete_pengeluaran`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data.message);
      fetchData(); // Reload the data after save
      fetchAllKeuntungan(); // Reload the data after save
      setLoadingModal(false);
      handleCloseDeleteModal();

      // Optionally, refresh the dataSavedBill list or remove the deleted item from the state
    } catch (error) {
      console.error("There was an error deleting the pengeluaran!", error);
      handleShowDeleteModal(pengeluaranToDelete);

      setLoadingModal(false); // Hide loading modal
    }
  };

  return (
    <>
      <Modal
        show={deleteModal}
        onHide={handleCloseDeleteModal}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <h5>Apakah Pengeluaran ini ingin didelete?</h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteBill}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={loadingModal}
        onHide={() => {}}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Body>
          <div className="text-center">
            <p>Saving...</p>
            <ProgressBar animated now={100} />
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default ModalDeletePengeluaran;
