import React, { useEffect, useState } from "react";
import Accordion from "react-bootstrap/Accordion";
import Card from "react-bootstrap/Card";
import { BACKEND } from "../../constants";
import ModalEditDetailBill from "./ModalEditDetailbill";
import ModalDeleteDetailBill from "./ModalDeleteDetailBill";
import axios from "axios";

const AccordionDetailBill = ({ billDetails, fetchData, fetchAllKeuntungan }) => {
  const apiUrl = BACKEND;

  const [editDetailModal, setEditDetailModal] = useState(false);
  const [deleteDetailModal, setDeleteDetailModal] = useState(false);
  const [detailBillToEdit, setDetailBillToEdit] = useState({
    id_bill: "",
    nama_menu: "",
    jumlah: 0,
    total_harga: 0,
  });
  const [detailBillToDelete, setDetailBillToDelete] = useState(null);
  

  const handleCloseEditDetailModal = () => {
    setEditDetailModal(false);
  };

  const handleShowEditDetailModal = (detailBill) => {
    setDetailBillToEdit(detailBill);
    setEditDetailModal(true);
  };

  const handleCloseDeleteDetailModal = () => {
    setDeleteDetailModal(false);
  };

  const handleShowDeleteDetailModal = (detailBill) => {
    setDetailBillToDelete(detailBill);
    setDeleteDetailModal(true);
  };

  const handleEditDetailChange = (e) => {
    const { name, value } = e.target;
    setDetailBillToEdit((prevState) => ({
      ...prevState,
      [name]: name === "jumlah" || name === "total_harga" ? parseInt(value, 10) : value,
    }));
  };

  const handleEditDetailSave = async () => {
    try {
      const response = await axios.put(apiUrl+`/api/transaction/edit_detail_bill/${detailBillToEdit.id}`, detailBillToEdit, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Save Edited Detail Bill Response:", response.data);
      setEditDetailModal(false);
      fetchData(); // Reload the data after save
      fetchAllKeuntungan(); // Reload the data after save
    } catch (error) {
      console.error("Error saving edited detail bill:", error);
    }
  }; 

  return (
    <>
      <Accordion>
        <Card>
          <Accordion.Toggle as={Card.Header} eventKey="0">
            Menu yang dipesan
          </Accordion.Toggle>
          <Accordion.Collapse eventKey="0">
            <Card.Body>
              <table className="table text-white table-striped">
                <thead>
                  <tr>
                    <th>Id Bill</th>
                    <th>Nama Menu</th>
                    <th>Jumlah</th>
                    <th>Total Harga</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {billDetails && billDetails.length > 0 ? (
                    billDetails.map((row, index) => (
                      <tr key={index}>
                        <td>{"Order#" + row.id_bill}</td>
                        <td>{row.nama_menu}</td>
                        <td>{row.jumlah}</td>
                        <td>{row.total_harga}</td>
                        <td>
                          <button
                            className="btn btn-outline-primary"
                            onClick={() =>
                              handleShowEditDetailModal({
                                id: row.id,
                                id_bill: row.id_bill,
                                nama_menu: row.nama_menu,
                                jumlah: row.jumlah,
                                total_harga: row.total_harga,
                              })
                            }
                          >
                            <i className="mdi mdi-table-edit"></i>
                          </button>
                          <button
                            className="btn btn-outline-danger"
                            onClick={() =>
                              handleShowDeleteDetailModal({
                                id: row.id,
                                id_bill: row.id_bill,
                                nama_menu: row.nama_menu,
                                jumlah: row.jumlah,
                                total_harga: row.total_harga,
                              })
                            }
                          >
                            <i className="mdi mdi-delete"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        Tidak ada transaksi yang tersimpan.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </Card.Body>
          </Accordion.Collapse>
        </Card>
      </Accordion>
      <ModalEditDetailBill
        show={editDetailModal}
        handleClose={handleCloseEditDetailModal}
        detailBill={detailBillToEdit}
        handleSave={handleEditDetailSave}
        handleChange={handleEditDetailChange}
        fetchData={fetchData}
        fetchAllKeuntungan={fetchAllKeuntungan}
      />
      <ModalDeleteDetailBill
        show={deleteDetailModal}
        handleClose={handleCloseDeleteDetailModal}
        detailBill={detailBillToDelete}        
        fetchData={fetchData}
        fetchAllKeuntungan={fetchAllKeuntungan}
      />
    </>
  );
};

export default AccordionDetailBill;
