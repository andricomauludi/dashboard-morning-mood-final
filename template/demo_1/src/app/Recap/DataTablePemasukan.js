import React, { useState } from "react";
import {
  useTable,
  usePagination,
  useGlobalFilter,
  useSortBy,
} from "react-table";
import AccordionDetailBill from "./DetailBill";
import ModalDeleteBillPemasukan from "./ModalDeleteBillPemasukan";

const Table = ({ columns, data }) => {  
  const [searchInput, setSearchInput] = useState("");
  const [deleteModal, setDeleteModal] = useState(false);
  const [billToDelete, setBillToDelete] = useState("");

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);    
  };

  const handleShowDeleteModal = (billId) => {
    setDeleteModal(true);
    setBillToDelete(billId)
  };
  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta", // Set timezone to Indonesia
    };
    return date.toLocaleString("id-ID", options); // Convert timestamp to Indonesian date time string
  };

  const transformedData = React.useMemo(
    () =>
      data.map((row) => ({
        ...row,
        order: `Order#${row.Bill.id}`,
        timestamp: `${formatDate(row.Bill.Timestamp)}`,
        total: `${formatPrice(row.Bill.total)}`,
        cash_in: `${formatPrice(row.Bill.cash_in)}`,
        cash_out: `${formatPrice(row.Bill.cash_out)}`,
        paymentStatus: row.Bill.paid === "1" ? "sudah bayar" : "belum bayar",
        actions: (
          <div className="row">
            <div className="col-md-6">
              <a>
                <button
                  className="btn btn-outline-danger"
                  value={row.id}
                  onClick={() => handleShowDeleteModal(row.Bill.id)}
                >
                  <i className="mdi mdi-delete-forever"></i>
                </button>
              </a>
            </div>
            <div className="col-md-6">
              <a>
                <button
                  className="btn btn-outline-info"
                  onClick={() => handleEdit(row.Bill.id)}
                >
                  <i className="mdi mdi-table-edit"></i>
                </button>
              </a>
            </div>
          </div>
        ),
      })),
    [data]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page, // Instead of using 'rows', use page
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data: transformedData,
      initialState: { pageIndex: 0 }, // Pass initial state
    },
    useGlobalFilter, // Use the useGlobalFilter plugin hook
    useSortBy,
    usePagination // Use the usePagination plugin hook
  );

  const handleSearchChange = (e) => {
    const value = e.target.value || "";
    setSearchInput(value);
    setGlobalFilter(value);
  };

  const handleDelete = (id) => {
    console.log("Delete ID:", id);
  };

  const handleEdit = (id) => {
    console.log("Edit ID:", id);
  };

  if (!data)
    return (
      <>
        <p>Loading</p>
      </>
    );
  return (
    <>
      <div className="row">
        <div className="col-md-3">
          <input
            className="form-control"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder={"Search..."}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          />
        </div>
      </div>
      <div>
        <div className="row mt-3 d-flex justify-content-center">
          <div className="col-md-6">
            <div className="row">
              <div className="col-md-6">
                <div className="row form-inline">
                  <span>
                    Go to page:{" "}
                    <input
                      className="form-control"
                      type="number"
                      defaultValue={pageIndex + 1}
                      onChange={(e) => {
                        const page = e.target.value
                          ? Number(e.target.value) - 1
                          : 0;
                        gotoPage(page);
                      }}
                      style={{ width: "100px" }}
                    />
                  </span>{" "}
                </div>
              </div>
              <div className="col-md-6">
                <select
                  className="form-control text-white"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                  }}
                >
                  {[10, 20, 30, 40, 50].map((pageSize) => (
                    <option key={pageSize} value={pageSize}>
                      Show {pageSize}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="row mt-3 d-flex justify-content-center">
          <button
            className="btn btn-inverse-warning btn-lg"
            onClick={() => gotoPage(0)}
            disabled={!canPreviousPage}
          >
            {"<<"}
          </button>
          <button
            className="btn btn-inverse-warning btn-lg"
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
          >
            {"<"}
          </button>
          <button
            className="btn btn-inverse-warning btn-lg"
            onClick={() => nextPage()}
            disabled={!canNextPage}
          >
            {">"}
          </button>
          <button
            className="btn btn-inverse-warning btn-lg"
            onClick={() => gotoPage(pageCount - 1)}
            disabled={!canNextPage}
          >
            {">>"}
          </button>
        </div>
        <div className="row mt-3 mb-3 d-flex justify-content-center">
          <span>
            Page
            <strong style={{ marginLeft: "5px" }}>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
        </div>
      </div>
      <table className="table table-dark table-hover" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {/* Add a sort direction indicator */}
                  <span>
                    {column.isSorted ? (
                      column.isSortedDesc ? (
                        <i
                          style={{ color: "green" }}
                          className="mdi mdi-sort-descending"
                        ></i>
                      ) : (
                        <i
                          style={{ color: "red" }}
                          className="mdi mdi-sort-ascending"
                        ></i>
                      )
                    ) : (
                      <i
                        style={{ color: "orange" }}
                        className="mdi mdi-sort"
                      ></i>
                    )}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
        {page.map((row) => {
            prepareRow(row);
            return (
              <React.Fragment key={row.id}>
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    if (cell.column.id === "paymentStatus") {
                      return (
                        <td {...cell.getCellProps()}>
                          <span className={`badge ${cell.value === "sudah bayar" ? "badge-success" : "badge-danger"}`}>
                            {cell.render("Cell")}
                          </span>
                        </td>
                      );
                    }
                    if (cell.column.id === "cash_in") {
                      return (
                        <td {...cell.getCellProps()}>
                          <span className={`badge badge-warning`}>{cell.render("Cell")}</span>
                        </td>
                      );
                    }
                    if (cell.column.id === "cash_out") {
                      return (
                        <td {...cell.getCellProps()}>
                          <span className={`badge badge-info`}>{cell.render("Cell")}</span>
                        </td>
                      );
                    }
                    return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
                  })}
                </tr>
                <tr>
                  <td colSpan="9">                    
                    <AccordionDetailBill billDetails={row.original.Detail_bill} />
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <ModalDeleteBillPemasukan deleteModal={deleteModal} handleCloseDeleteModal={handleCloseDeleteModal} billToDelete={billToDelete} />
    </>
  );
};

export default Table;
