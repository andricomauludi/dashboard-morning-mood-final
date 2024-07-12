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
  };
  componentDidMount() {
    this.checkAuthentication();
    this.onRouteChanged();
  }
  render() {
    // const { isAuthenticated } = this.state;

    // if (!isAuthenticated) {
    //   this.props.history.push("/user-pages/login-1"); // Adjust the login route as per your application

    // }
    let navbarComponent = !this.state.isFullPageLayout ? <Navbar /> : "";
    let sidebarComponent = !this.state.isFullPageLayout ? <Sidebar /> : "";
    let footerComponent = !this.state.isFullPageLayout ? <Footer /> : "";
    return (
      <div className="container-scroller">
        {sidebarComponent}
        <div className="container-fluid page-body-wrapper">
          {navbarComponent}
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes />
            </div>
            {footerComponent}
          </div>
        </div>
      </div>
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.location !== prevProps.location) {
      this.onRouteChanged();
    }
  }
  checkAuthentication = async () => {
    console.log("check auth app");
    const authToken = Cookies.get("Authorization"); // Replace with your actual cookie name
    if (authToken) {
      const apiUrl = BACKEND; // Your backend URL

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
        if (response.data.status == 1) {
          this.setState({ isAuthenticated: true });
        } else {
          this.setState({ isAuthenticated: false });
          // Clear the Authorization cookie and reset state for login retry                    
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
        this.setState({ isAuthenticated: false });
        // Clear the Authorization cookie and reset state for login retry                    

      }
    } else {
      this.setState({ isAuthenticated: false });
      // Redirect to login page or handle unauthorized access
      this.props.history.push("/user-pages/login-1"); // Adjust the login route as per your application
    }
  };

  onRouteChanged() {
    const { i18n } = this.props;
    const body = document.querySelector("body");
    if (this.props.location.pathname === "/layout/RtlLayout") {
      body.classList.add("rtl");
      i18n.changeLanguage("ar");
    } else {
      body.classList.remove("rtl");
      i18n.changeLanguage("en");
    }
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
    for (let i = 0; i < fullPageLayoutRoutes.length; i++) {
      if (this.props.location.pathname === fullPageLayoutRoutes[i]) {
        this.setState({
          isFullPageLayout: true,
        });
        document
          .querySelector(".page-body-wrapper")
          .classList.add("full-page-wrapper");
        break;
      } else {
        this.setState({
          isFullPageLayout: false,
        });
        document
          .querySelector(".page-body-wrapper")
          .classList.remove("full-page-wrapper");
      }
    }
  }
}

export default withTranslation()(withRouter(App));
