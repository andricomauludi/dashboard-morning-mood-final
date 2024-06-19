import React, { useState, useMemo, useEffect } from "react";
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

  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(
    today.getFullYear().toString()
  );
  const [selectedMonth, setSelectedMonth] = useState(
    (today.getMonth() + 1).toString().padStart(2, "0")
  );
  const [selectedDay, setSelectedDay] = useState(
    today.getDate().toString().padStart(2, "0")
  );
  const [days, setDays] = useState([]);

  useEffect(() => {
    updateDaysInMonth(selectedYear, selectedMonth);
  }, [selectedYear, selectedMonth]);

  const handleCloseDeleteModal = () => {
    setDeleteModal(false);
  };

  const handleShowDeleteModal = (billId) => {
    setDeleteModal(true);
    setBillToDelete(billId);
  };

  const handleYearChange = (e) => {
    setSelectedYear(e.target.value);
  };

  const handleMonthChange = (e) => {
    setSelectedMonth(e.target.value);
  };

  const handleDayChange = (e) => {
    setSelectedDay(e.target.value);
  };

  const updateDaysInMonth = (year, month) => {
    const date = new Date(year, month, 0);
    const daysInMonth = date.getDate();
    const daysArray = [
      "Semua Hari",
      ...Array.from({ length: daysInMonth }, (_, i) =>
        (i + 1).toString().padStart(2, "0")
      ),
    ];
    setDays(daysArray);
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
      timeZone: "Asia/Jakarta",
    };
    return date.toLocaleString("id-ID", options);
  };

  const filteredData = useMemo(() => {
    if (!selectedYear && !selectedMonth && !selectedDay) return data;

    return data.filter((row) => {
      const date = new Date(row.Bill.Timestamp);
      const year = date.getFullYear().toString();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      const yearMatches = selectedYear ? year === selectedYear : true;
      const monthMatches = selectedMonth ? month === selectedMonth : true;
      const dayMatches =
        selectedDay === "Semua Hari" ? true : day === selectedDay;

      return yearMatches && monthMatches && dayMatches;
    });
  }, [data, selectedYear, selectedMonth, selectedDay]);

  const transformedData = useMemo(
    () =>
      filteredData.map((row) => ({
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
    [filteredData]
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
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
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
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

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 2 }, (_, i) =>
    (currentYear - i).toString()
  );
  const months = Array.from({ length: 12 }, (_, i) =>
    (i + 1).toString().padStart(2, "0")
  );

  return (
    <>
      <div className="row justify-content-center">
        <div className="col-md-4">
          <select
            className="form-control text-white"
            value={selectedDay}
            onChange={handleDayChange}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          >
            {days.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control text-white"
            value={selectedMonth}
            onChange={handleMonthChange}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          >
            {months.map((month) => (
              <option key={month} value={month}>
                {new Date(0, month - 1).toLocaleString("id-ID", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-4">
          <select
            className="form-control text-white"
            value={selectedYear}
            onChange={handleYearChange}
            style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div>
        <div className="row mt-3 d-flex justify-content-center">
          <div className="col-md-4">
            <input
              className="form-control text-white"
              value={searchInput}
              onChange={handleSearchChange}
              placeholder={"Search..."}
              style={{ marginBottom: "10px", padding: "8px", width: "100%" }}
            />
          </div>
          <div className="col-md-4">
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
              <div className="col-md-4">
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
                <th
                  text="sm"
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                >
                  {column.render("Header")}
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
                          <span
                            className={`badge ${
                              cell.value === "sudah bayar"
                                ? "badge-success"
                                : "badge-danger"
                            }`}
                          >
                            {cell.render("Cell")}
                          </span>
                        </td>
                      );
                    }
                    if (cell.column.id === "cash_in") {
                      return (
                        <td {...cell.getCellProps()}>
                          <span className={`badge badge-warning`}>
                            {cell.render("Cell")}
                          </span>
                        </td>
                      );
                    }
                    if (cell.column.id === "cash_out") {
                      return (
                        <td {...cell.getCellProps()}>
                          <span className={`badge badge-info`}>
                            {cell.render("Cell")}
                          </span>
                        </td>
                      );
                    }
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    );
                  })}
                </tr>
                <tr>
                  <td colSpan="9">
                    <AccordionDetailBill
                      billDetails={row.original.Detail_bill}
                    />
                  </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
      <ModalDeleteBillPemasukan
        deleteModal={deleteModal}
        handleCloseDeleteModal={handleCloseDeleteModal}
        billToDelete={billToDelete}
      />
    </>
  );
};

export default Table;
