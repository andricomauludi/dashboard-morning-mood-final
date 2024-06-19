import React, { useEffect, useState } from "react";
import { Modal, ProgressBar } from "react-bootstrap";
import Button from "react-bootstrap/Button";

const ModalDeleteBillPemasukan = ({
  deleteModal,
  handleCloseDeleteModal,
  billToDelete,
}) => {
  const [loadingModal, setLoadingModal] = useState(false);

  const handleDeleteBill = async (event) => {
    console.log(billToDelete);
    // setLoadingModal(true); // Show loading modal
    // handleCloseDeleteModal;

    // const formData = new FormData();
    // formData.append("id", billToDelete);

    // try {
    //   const response = await axios.post(
    //     apiUrl+`/api/transaction/delete_bill`,
    //     formData,
    //     {
    //       headers: {
    //         "Content-Type": "multipart/form-data",
    //       },
    //     }
    //   );
    //   console.log(response.data.message);
    //   setLoadingModal(false);
    //   handleCloseDeleteModal
    //   setSelectedImages([]);
    //   setSelectedPayment("");
    //   setCurrentBillId(0);

    //   // Optionally, refresh the dataSavedBill list or remove the deleted item from the state
    // } catch (error) {
    //   console.error("There was an error deleting the bill!", error);
    //   setDeleteModal(true);

    //   setLoadingModal(false); // Show loading modal
    // }
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
          <h5>Apakah Bill ini ingin didelete?</h5>
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

export default ModalDeleteBillPemasukan;
