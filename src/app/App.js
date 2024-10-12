import React, { Component } from "react";
import { withRouter } from "react-router-dom";
import "./App.scss";
import AppRoutes from "./AppRoutes";
import Navbar from "./shared/Navbar";
import Sidebar from "./shared/Sidebar";
import Footer from "./shared/Footer";
import { withTranslation } from "react-i18next";
import Cookies from "js-cookie";
import { BACKEND } from "../constants";
import axios from "axios";

class App extends Component {
  state = {
    isAuthenticated: false,
    userRole: null,  // Store user role
    userUsername : null,
    isFullPageLayout: false,
    isSidebarOpen: true,  // Track sidebar visibility
  };
  toggleSidebar = () => {
    this.setState((prevState) => ({
      isSidebarOpen: !prevState.isSidebarOpen,
    }));
  };

  componentDidMount() {
    this.checkAuthentication();
    this.checkRole();
    this.onRouteChanged();
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }

   // Triggered after successful login
   handleLoginSuccess = () => {
    console.log("Login successful, checking authentication and roles again...");
    this.checkAuthentication();  // Re-check authentication and role
    this.checkRole();
  };

  checkAuthentication = async () => {
    const authToken = Cookies.get("Authorization");
    console.log("check auth app dari app js " + authToken);

    if (authToken) {
      const apiUrl = BACKEND;

      try {
        const response = await axios.post(
          `${apiUrl}/api/auth/check-auth`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          }
        );
        if (response.data.status === 1) {
          this.setState({ isAuthenticated: true });          
        } else {
          this.setState({ isAuthenticated: false });
          Cookies.remove("Authorization"); // Hapus hanya jika token tidak valid
          console.log("remove cookies karena token tidak valid");
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        this.setState({ isAuthenticated: false });
        Cookies.remove("Authorization"); // Hapus cookie hanya jika ada error serius
      }
    } else {
      this.setState({ isAuthenticated: false });
      this.props.history.push("/user-pages/login-1");
    }
  };
  checkRole = async () => {
    const authToken = Cookies.get("Authorization");
    console.log("Checking role...");
    if (authToken) {
      const apiUrl = BACKEND;
      try {
        const response = await axios.post(
          `${apiUrl}/api/auth/check-role`,
          {},
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
            withCredentials: true,
          }
        );
        if (response.data.status === 1) {
          console.log("role ="+response.data);
          this.setState({
            isAuthenticated: true,
            userRole: response.data.role,
            userUsername: response.data.fullname,
            loading: false,
          });
        } else {
          // Reset state saat status bukan 1
          this.setState({ isAuthenticated: false, role: null, loading: false });
          Cookies.remove("Authorization");
        }
      } catch (error) {
        console.error("Error checking role:", error);
        // Reset state saat terjadi error
        this.setState({ isAuthenticated: false, role: null, loading: false });
        Cookies.remove("Authorization");
      }
    } else {
      // Reset state jika tidak ada token
      this.setState({ isAuthenticated: false, role: null, loading: false });
    }
  };

  handleAuthError = () => {
    this.setState({ isAuthenticated: false, userRole: null });
    Cookies.remove("Authorization"); // Clear the cookie if authentication fails
    this.props.history.push("/user-pages/login-1");
  };

  onRouteChanged = () => {
    const body = document.querySelector("body");

    window.scrollTo(0, 0);

    const fullPageLayoutRoutes = [
      "/user-pages/login-1",
      "/user-pages/login-2",
      "/user-pages/register-1",
      "/user-pages/register-2",
      "/user-pages/lockscreen",
      "/error-pages/error-404",
      "/error-pages/error-500",
      "/general-pages/landing-page",
    ];
    let isFullPageLayout = false;
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        isFullPageLayout = true;
        break;
      }
    }
    this.setState({ isFullPageLayout }, () => {
      if (isFullPageLayout) {
        document
          .querySelector(".page-body-wrapper")
          .classList.add("full-page-wrapper");
      } else {
        document
          .querySelector(".page-body-wrapper")
          .classList.remove("full-page-wrapper");
      }
    });
  };
  

  render() {
    const { isAuthenticated, userRole, isFullPageLayout } = this.state;
    {console.log("userRole dari app js = "+this.state.userRole)}

    let navbarComponent = !this.state.isFullPageLayout ? <Navbar userRole={this.state.userRole}  userUsername={this.state.userUsername}/> : "";
    let sidebarComponent = !this.state.isFullPageLayout ? (
      <Sidebar toggleSidebar={this.toggleSidebar} userRole={this.state.userRole} userUsername={this.state.userUsername} />
    ) : (
      ""
    );
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : "";
    let mainContentClass = this.state.isSidebarClosed
      ? "main-content-expanded"
      : "main-content";
    return (
      <div className="container-scroller">
        {sidebarComponent}
        <div
          className={`container-fluid page-body-wrapper ${mainContentClass}`}
        >
          {navbarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes
                isAuthenticated={isAuthenticated}
                userRole={userRole}
                onLoginSuccess={this.handleLoginSuccess}
              />
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(withRouter(App));
