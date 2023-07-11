import React, { Component } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";

export class CreateInventory extends Component {
  state = {
    startDate: new Date(),
  };

  handleChange = (date) => {
    this.setState({
      startDate: date,
    });
  };

  componentDidMount() {
    bsCustomFileInput.init();
  }

  render() {
    return (
      <div>
        <div className="page-header">
          <h3 className="page-title"> Create Inventory </h3>
          <nav aria-label="breadcrumb">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="/inventory/show">Inventory</a>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                Create Inventory
              </li>
            </ol>
          </nav>
        </div>
        <div className="row">
          <div className="col-12 grid-margin stretch-card">
            <div className="card">
              <div className="card-body">
                <h4 className="card-title">Basic form elements</h4>
                <p className="card-description"> Basic form elements </p>
                <form className="forms-sample">
                  <Form.Group>
                    <label htmlFor="product_name">Product Name</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="product_name"
                      placeholder="Product_name"
                    />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      rows="4"
                    ></textarea>
                  </Form.Group>
                 
                  <Form.Group className="row">
                        <label className="col-sm-2 col-form-label">
                          Menu Type
                        </label>
                        <div className="col-sm-3">
                          <div className="form-check form-check-warning">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="ExampleRadio4"
                                id="membershipRadios1"
                                defaultChecked
                              />{" "}
                              Coffee
                              <i className="input-helper"></i>
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-check form-check-warning">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="ExampleRadio4"
                                id="membershipRadios2"
                              />{" "}
                              Rice
                              <i className="input-helper"></i>
                            </label>
                          </div>
                        </div>
                        <div className="col-sm-3">
                          <div className="form-check form-check-warning">
                            <label className="form-check-label">
                              <input
                                type="radio"
                                className="form-check-input"
                                name="ExampleRadio4"
                                id="membershipRadios2"
                              />{" "}
                              Sandwich
                              <i className="input-helper"></i>
                            </label>
                          </div>
                        </div>
                      </Form.Group>
                  <Form.Group>
                    <label>Photo</label>
                    <div className="custom-file">
                      <Form.Control
                        type="file"
                        className="form-control visibility-hidden"
                        id="photo"
                        lang="es"
                      />
                      <label className="custom-file-label" htmlFor="photo">
                        Upload image
                      </label>
                    </div>
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="price">Price</label>
                    <div className="input-group">
                      <div className="input-group-prepend">
                        <span className="input-group-text bg-warning text-white">
                          Rp.
                        </span>
                      </div>
                      <Form.Control
                        type="text"
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                        id="price"
                      />
                    </div>
                  </Form.Group>
                  <button type="submit" className="btn btn-primary mr-2">
                    Submit
                  </button>
                  <button className="btn btn-dark">Cancel</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateInventory;
