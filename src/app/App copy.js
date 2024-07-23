import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './App.scss';
import AppRoutes from './AppRoutes';
import Navbar from './shared/Navbar';
import Sidebar from './shared/Sidebar';
import Footer from './shared/Footer';
import { withTranslation } from "react-i18next";
import Cookies from 'js-cookie'; // Import js-cookie

class App extends Component {
  state = {
    isFullPageLayout: false,
    isAuthenticated: true // Initially assuming authenticated
  };

  componentDidMount() {
    // Check authorization cookie
    if (!this.checkAuthorization()) {
      // Redirect to login page if not authenticated
      this.props.history.push('/user-pages/login-1'); // Adjust the login route as needed
      return;
    }

    // Initialize layout based on initial route
    this.updateLayout();

    // Listen to route changes
    this.unlisten = this.props.history.listen(() => {
      this.updateLayout();
    });
  }

  componentWillUnmount() {
    // Clean up listener
    this.unlisten();
  }

  checkAuthorization() {
    // Replace with your actual logic to check for the authorization cookie
    // Example: Check if the cookie exists
    const authorizationCookie = Cookies.get('authorization'); // Replace 'authorization' with your actual cookie name
    return !!authorizationCookie; // Convert to boolean
  }

  updateLayout() {
    console.log("ROUTE CHANGED");
    const { i18n, location } = this.props;
    const body = document.querySelector('body');

    // Check if the current path matches any full page layout routes
    const isFullPageLayout = this.isFullPageLayout(location.pathname);
    this.setState({ isFullPageLayout });

    // Update language and layout classes based on route
    if (location.pathname === '/layout/RtlLayout') {
      body.classList.add('rtl');
      i18n.changeLanguage('ar');
    } else {
      body.classList.remove('rtl');
      i18n.changeLanguage('en');
    }

    window.scrollTo(0, 0);
    // Add/remove full-page-wrapper class based on isFullPageLayout state
    const pageBodyWrapper = document.querySelector('.page-body-wrapper');
    if (pageBodyWrapper) {
      if (isFullPageLayout) {
        pageBodyWrapper.classList.add('full-page-wrapper');
      } else {
        pageBodyWrapper.classList.remove('full-page-wrapper');
      }
    }
  }

  isFullPageLayout(pathname) {
    // Define full page layout routes
    const fullPageLayoutRoutes = ['/user-pages/login-1', '/user-pages/login-2', '/user-pages/register-1', '/user-pages/register-2', '/user-pages/lockscreen', '/error-pages/error-404', '/error-pages/error-500', '/general-pages/landing-page'];
    // Check if the current pathname matches any of the full page layout routes
    return fullPageLayoutRoutes.includes(pathname);
  }

  render() {
    const { isFullPageLayout, isAuthenticated } = this.state;

    // If not authenticated, redirect to login page
    if (!isAuthenticated) {
      this.props.history.push('/user-pages/login-1'); // Adjust the login route as needed
      return null; // Render nothing if redirecting
    }

    // Determine whether to render Navbar and Sidebar based on isFullPageLayout
    const navbarComponent = !isFullPageLayout ? <Navbar/> : null;
    const sidebarComponent = !isFullPageLayout ? <Sidebar/> : null;
    const footerComponent = !isFullPageLayout ? <Footer/> : null;

    return (
      <div className="container-scroller">
        { sidebarComponent }
        <div className="container-fluid page-body-wrapper">
          { navbarComponent }
          <div className="main-panel">
            <div className="content-wrapper">
              <AppRoutes/>
            </div>
            { footerComponent }
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation()(withRouter(App));
