import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { BACKEND } from '../../constants'; // Adjust the import according to your project structure
import Cookies from "js-cookie";

export class Login extends Component {
  state = {
    username: '',
    password: '',
    isAuthenticated: false,
    errorMessage: '',
  };

  componentDidMount() {
    // Check if Authorization cookie exists on component mount
    const authToken = Cookies.get('Authorization');
    if (authToken) {
      this.setState({ isAuthenticated: true });
    }
  }

  handleInputChange = (e) => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  };

  handleSubmit = async (e) => {
    e.preventDefault();
    const { username, password } = this.state;
    const apiUrl = BACKEND; // Your backend URL

    try {
      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { username, password },
        { withCredentials: true }
      );
      if (response.status === 200) {
        const authToken = response.data.data.token;
        Cookies.set('Authorization', authToken, { expires: 1, path: '' });
        this.setState({ isAuthenticated: true });        
      }
    } catch (error) {
      console.error('Error logging in:', error);
      this.setState({ errorMessage: 'Invalid username or password' });
    }
  };

  // Function to check authentication status with backend
  checkAuthentication = async (authToken) => {
    console.log('check auth login')
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
      if (response.data.status==1) {
        this.setState({ isAuthenticated: true });
      } else {
        this.setState({ isAuthenticated: false });
        // Clear the Authorization cookie and reset state for login retry
        Cookies.remove('Authorization');
        console.log("remove cookis login.js")

      }
    } catch (error) {
      console.error('Error checking authentication:', error);
      this.setState({ isAuthenticated: false });
      // Clear the Authorization cookie and reset state for login retry
      Cookies.remove('Authorization');
      console.log("remove cookis login.js errir")

    }
  };

  render() {
    const { username, password, isAuthenticated, errorMessage } = this.state;

    // Redirect to dashboard if authenticated
    if (isAuthenticated) {
      return <Redirect to="/dashboard" />;
    }

    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-center py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <img src={require("../../assets/images/logo-morning-mood.png")} alt="logo" />
                </div>
                <h4>Hello! Let's get started</h4>
                <h6 className="font-weight-light">Sign in to continue.</h6>
                <Form className="pt-3" onSubmit={this.handleSubmit}>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="text"
                      placeholder="Username"
                      size="lg"
                      className="h-auto"
                      name="username"
                      value={username}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      size="lg"
                      className="h-auto"
                      name="password"
                      value={password}
                      onChange={this.handleInputChange}
                    />
                  </Form.Group>
                  {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                  <div className="mt-3">
                    <Button
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      type="submit"
                    >
                      SIGN IN
                    </Button>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;
