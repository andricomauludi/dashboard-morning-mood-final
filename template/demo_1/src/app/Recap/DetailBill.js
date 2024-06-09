import React, { useEffect, useState } from "react";
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import { BACKEND } from "../../constants";

const AccordionDetailBill = ({ billDetails }) => {  
  return (
    <Accordion>
      <Card>
        <Accordion.Toggle as={Card.Header} eventKey="0">
          Bill Details
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
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center">
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
  );
};

export default AccordionDetailBill;
