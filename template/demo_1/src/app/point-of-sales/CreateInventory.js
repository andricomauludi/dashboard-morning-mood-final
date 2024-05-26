import React, { Component, useState } from "react";
import { Form } from "react-bootstrap";
import DatePicker from "react-datepicker";
import bsCustomFileInput from "bs-custom-file-input";
import ModalConfirmation from "../shared/ModalConfirmation";

export class CreatePointOfSales extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: {
        product_name: "",
        price: "",
        description: "",
        menu_type: "",
        photo: "",
      },
      selectedOption: "",
      response: null,
      selectedImage: null,
    };
  }

  handleImageUpload = (event) => {
    const file = event.target.files[0];
    console.log(file)
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        photo:file.name
        
      },
    }));
    this.setState({ selectedImage: file });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://127.0.0.1:8090/api/product", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.state.formData),
      });

      const jsonData = await response.json();
      this.setState({ response: jsonData });
    } catch (error) {
      console.log("Error submitting form:", error);
    }
  };

  handleOptionChange = (e) => {
    this.setState({ selectedOption: e.target.value });
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        menu_type:this.state.selectedOption
        
      },
    }));
  };

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState((prevState) => ({
      formData: {
        ...prevState.formData,
        [name]: value,
        price: parseInt(value),
        menu_type: this.state.selectedOption,
        
      },
    }));
  };

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
    const { formData, response } = this.state;

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
                <h4 className="card-title">Adding product</h4>
              
                {/* Render the API response */}
                
                <p className="card-description"> adding product to database </p>
                <form onSubmit={this.handleSubmit} className="forms-sample">
                  <Form.Group>
                    <label htmlFor="product_name">Product Name</label>
                    <Form.Control
                      type="text"
                      className="form-control"
                      id="product_name"
                      name="product_name"
                      value={formData.product_name}
                      onChange={this.handleInputChange}
                      placeholder="Insert Product Name"
                    />
                  </Form.Group>
                  <Form.Group>
                    <label htmlFor="description">Description</label>
                    <textarea
                      className="form-control"
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={this.handleInputChange}
                      rows="4"
                      placeholder="Insert Description"
                    ></textarea>
                  </Form.Group>

                  <Form.Group className="row">
                    <label className="col-sm-2 col-form-label">Menu Type</label>
                    <div className="col-sm-3">
                      <div className="form-check form-check-warning">
                        <label className="form-check-label">
                          <input
                            type="radio"
                            className="form-check-input"
                            name="menu_type"
                            id="Coffee"
                            value="Coffee"
                            checked={this.state.selectedOption === "Coffee"}
                            onChange={this.handleOptionChange}
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
                            name="menu_type"
                            id="Rice"
                            value="Rice"
                            checked={this.state.selectedOption === "Rice"}
                            onChange={this.handleOptionChange}
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
                            name="menu_type"
                            id="Sandwich"
                            value="sandwich"
                            checked={this.state.selectedOption === "sandwich"}
                            onChange={this.handleOptionChange}
                          />{" "}
                          sandwich
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
                        onChange={this.handleImageUpload}
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
                        type="number"
                        pattern="[0-9]*"
                        className="form-control"
                        aria-label="Amount (to the nearest dollar)"
                        id="price"
                        name="price"
                        value={parseInt(formData.price)}
                        placeholder="Insert Price"
                        onChange={this.handleInputChange}
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

export default CreatePointOfSales;
