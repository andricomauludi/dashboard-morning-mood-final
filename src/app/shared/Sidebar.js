import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Collapse, Dropdown } from "react-bootstrap";
import { Trans } from "react-i18next";
import { BACKEND } from "../../constants";
import axios from "axios";
import Cookies from "js-cookie";

import Spinner from "../shared/Spinner";
import ImageModal from "./ImageModal"; // Import the modal component
import ModalConfirmation from "./ModalConfirmation";
import LogoutModal from "./LogoutModal";

class Sidebar extends Component {
  state = {
    showModal: false,
    showModalLogout: false,
    currentImageSrc: "",
  };

  handleImageClick = (imgSrc) => {
    this.setState({ currentImageSrc: imgSrc, showModal: true });
  };
  toggleModal = () => {
    this.setState((prevState) => ({
      showModalLogout: !prevState.showModalLogout,
    }));
  };
  handleLogout = async (event) => {
    event.preventDefault();

    try {
      // Get the Authorization token from cookies
      const token = Cookies.get("Authorization");
      if (!token) {
        console.error("Authorization cookie not found");
        return;
      }

      const apiUrl = BACKEND; // Your backend URL

      // Send a POST request to logout endpoint with Authorization header
      const response = await axios.post(
        `${apiUrl}/api/auth/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );

      // Check if the logout request was successful
      if (response.status === 200) {
        // Remove the Authorization cookie
        Cookies.remove("Authorization", { path: "/" });

        // Redirect to the login page
        this.props.history.push("/user-pages/login-1"); // Ensure this.props.history is available
      } else {
        console.error("Failed to log out:", response.status);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  handleCloseModal = () => {
    this.setState({ showModal: false });
  };

  toggleMenuState(menuState) {
    if (this.state[menuState]) {
      this.setState({ [menuState]: false });
    } else if (Object.keys(this.state).length === 0) {
      this.setState({ [menuState]: true });
    } else {
      Object.keys(this.state).forEach((i) => {
        this.setState({ [i]: false });
      });
      this.setState({ [menuState]: true });
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

  onRouteChanged() {
    document.querySelector("#sidebar").classList.remove("active");
    Object.keys(this.state).forEach((i) => {
      this.setState({ [i]: false });
    });

    const dropdownPaths = [
      { path: "/apps", state: "appsMenuOpen" },
      { path: "/basic-ui", state: "basicUiMenuOpen" },
      { path: "/form-elements", state: "formElementsMenuOpen" },
      { path: "/tables", state: "tablesMenuOpen" },
      { path: "/icons", state: "iconsMenuOpen" },
      { path: "/charts", state: "chartsMenuOpen" },
      { path: "/user-pages", state: "userPagesMenuOpen" },
      { path: "/error-pages", state: "errorPagesMenuOpen" },
    ];

    dropdownPaths.forEach((obj) => {
      if (this.isPathActive(obj.path)) {
        this.setState({ [obj.state]: true });
      }
    });
  }

  render() {
    if (this.props.loading) {
      return <Spinner />;
    }
    const { userUsername, userRole } = this.props; // Get userRole from props
    {
      console.log(userUsername);
    }

    const { showModal, currentImageSrc } = this.state;

    const imageSrc =
      this.props.userUsername === "Anrizqa Dewi Rachmani"
        ? require("../../assets/images/faces/profile-anrizqa.jpeg")
        : this.props.userUsername === "Superadmin"
        ? require("../../assets/images/faces/profile-teams.jpg")
        : this.props.userUsername === "kasir"
        ? require("../../assets/images/faces/profile-default.jpg")
        : require("../../assets/images/faces/profile-default.jpg");

    return (
      <nav className="sidebar" id="sidebar">
        <div className="sidebar-brand-wrapper d-none d-lg-flex align-items-center justify-content-center fixed-top">
          <a
            className="sidebar-brand brand-logo"
            href="index.html"
            style={{ color: "gold" }}
          >
            Point Of Sales
          </a>
          <a className="sidebar-brand brand-logo-mini" href="index.html">
            <img src={require("../../assets/logo-ceu-monny.png")} alt="logo" />
          </a>
        </div>
        <ul className="nav">
          <li className="nav-item profile">
            <div className="profile-desc">
              <div className="profile-pic">
                <div className="count-indicator">
                  <div
                    className="profile-pic"
                    onClick={() => this.handleImageClick(imageSrc)}
                  >
                    <img
                      className="img-xs rounded-circle"
                      src={imageSrc}
                      alt="profile"
                    />
                  </div>
                  {/* <span className="count bg-success"></span> */}
                </div>
                <div className="profile-name">
                  <h6 className="mb-0 font-weight-normal">
                    <Trans>{userUsername}</Trans>
                  </h6>
                  <span>
                    {userRole === 1 && <Trans>Superadmin</Trans>}
                    {userRole === 2 && <Trans>Admin</Trans>}
                    {userRole === 3 && <Trans>Kasir</Trans>}
                  </span>
                </div>
              </div>
              {/* <Dropdown alignRight>
                <Dropdown.Toggle as="a" className="cursor-pointer no-caret">
                  <i className="mdi mdi-dots-vertical"></i>
                </Dropdown.Toggle>
                <Dropdown.Menu className="sidebar-dropdown preview-list">
                  <a
                    href="!#"
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-settings text-primary"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small">
                        <Trans>Account settings</Trans>
                      </p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a
                    href="!#"
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-onepassword text-info"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small">
                        <Trans>Change Password</Trans>
                      </p>
                    </div>
                  </a>
                  <div className="dropdown-divider"></div>
                  <a
                    href="!#"
                    className="dropdown-item preview-item"
                    onClick={(evt) => evt.preventDefault()}
                  >
                    <div className="preview-thumbnail">
                      <div className="preview-icon bg-dark rounded-circle">
                        <i className="mdi mdi-calendar-today text-success"></i>
                      </div>
                    </div>
                    <div className="preview-item-content">
                      <p className="preview-subject ellipsis mb-1 text-small">
                        <Trans>To-do list</Trans>
                      </p>
                    </div>
                  </a>
                </Dropdown.Menu>
              </Dropdown> */}
            </div>
          </li>
          <li className="nav-item nav-category">
            <span className="nav-link">
              <Trans>Navigation</Trans>
            </span>
          </li>
          <li
            className={
              this.isPathActive("/dashboard")
                ? "nav-item menu-items active"
                : "nav-item menu-items"
            }
          >
            <Link className="nav-link" to="/dashboard">
              <span className="menu-icon">
                <i className="mdi mdi-speedometer"></i>
              </span>
              <span className="menu-title">
                <Trans>Dashboard</Trans>
              </span>
            </Link>
          </li>

          {(userRole === 1 || userRole === 2) && (
            <>
              <li
                className={
                  this.isPathActive("/Recap/")
                    ? "nav-item menu-items active"
                    : "nav-item menu-items"
                }
              >
                <Link className="nav-link" to="/Recap/show">
                  <span className="menu-icon">
                    <i className="mdi mdi-library-books"></i>
                  </span>
                  <span className="menu-title">
                    <Trans>Rekap Ceu Monny</Trans>
                  </span>
                </Link>
              </li>
              <li
                className={
                  this.isPathActive("/Recap-CVJ/")
                    ? "nav-item menu-items active"
                    : "nav-item menu-items"
                }
              >
                <Link className="nav-link" to="/Recap-CVJ/show">
                  <span className="menu-icon">
                    <i className="mdi mdi-content-cut"></i>
                  </span>
                  <span className="menu-title">
                    <Trans>Rekap CVJ</Trans>
                  </span>
                </Link>
              </li>
            </>
          )}

          <li
            className={
              this.isPathActive("/pos")
                ? "nav-item menu-items active"
                : "nav-item menu-items"
            }
          >
            <Link className="nav-link" to="/pos">
              <span className="menu-icon">
                <i className="mdi mdi-cash-multiple"></i>
              </span>
              <span className="menu-title">
                <Trans>Kasir</Trans>
              </span>
            </Link>
          </li>
          <li className="nav-item menu-items">
            <Link className="nav-link" onClick={this.toggleModal}>
                <span className="menu-icon">
                  <i className="mdi mdi-logout danger"></i>
                </span>
                <span className="menu-title danger" >
                  <Trans>Logout</Trans>
                </span>
            </Link>
          </li>
        </ul>
        {showModal && (
          <ImageModal
            imageSrc={currentImageSrc} // Kirim src gambar ke modal
            onClose={this.handleCloseModal} // Kirim fungsi untuk menutup modal
          />
        )}
        {/* Confirmation Modal */}
        <LogoutModal
          show={this.state.showModalLogout}
          handleClose={this.toggleModal}
          handleConfirm={this.handleLogout} // Call handleLogout on confirm
        />
      </nav>
    );
  }

  isPathActive(path) {
    return this.props.location.pathname.startsWith(path);
  }

  componentDidMount() {
    this.onRouteChanged();
    // add class 'hover-open' to sidebar navitem while hover in sidebar-icon-only menu
    const body = document.querySelector("body");
    document.querySelectorAll(".sidebar .nav-item").forEach((el) => {
      el.addEventListener("mouseover", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.add("hover-open");
        }
      });
      el.addEventListener("mouseout", function () {
        if (body.classList.contains("sidebar-icon-only")) {
          el.classList.remove("hover-open");
        }
      });
    });
  }
}

export default withRouter(Sidebar);
