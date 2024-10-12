import React, { Component, Suspense, lazy } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Spinner from "../app/shared/Spinner";
import Inventory from "./Inventory/Inventory";
import CreateInventory from "./Inventory/CreateInventory";
import PointOfSales from "./point-of-sales/PointOfSales";
import Recap from "./Recap/Recap";
import CreateRecap from "./Recap/CreateRecap";
import RecapCvj from "./Recap-CVJ/RecapCvj";
import { BACKEND } from "../constants";
import axios from "axios";

const Dashboard = lazy(() => import("./dashboard/Dashboard"));
const Buttons = lazy(() => import("./basic-ui/Buttons"));
const Dropdowns = lazy(() => import("./basic-ui/Dropdowns"));
const Typography = lazy(() => import("./basic-ui/Typography"));
const BasicElements = lazy(() => import("./form-elements/BasicElements"));
const BasicTable = lazy(() => import("./tables/BasicTable"));
const Mdi = lazy(() => import("./icons/Mdi"));
const ChartJs = lazy(() => import("./charts/ChartJs"));
const Error404 = lazy(() => import("./error-pages/Error404"));
const Error500 = lazy(() => import("./error-pages/Error500"));
const Login = lazy(() => import("./user-pages/Login"));
const Register1 = lazy(() => import("./user-pages/Register"));

class AppRoutes extends Component {
  render() {
    const { isAuthenticated, userRole } = this.props; // Get auth status and role from props

    // Show spinner if loading (could be a state if added in App)
    if (this.props.loading) {
      return <Spinner />;
    }

    return (
      
      <Suspense fallback={<Spinner />}>
        {console.log(userRole)}
        <Switch>
          <Route exact path="/dashboard" component={Dashboard} />
          <Route path="/pos" component={PointOfSales} />
          <Route path="/basic-ui/buttons" component={Buttons} />
          <Route path="/basic-ui/dropdowns" component={Dropdowns} />
          <Route path="/basic-ui/typography" component={Typography} />
          <Route path="/form-Elements/basic-elements" component={BasicElements} />
          <Route path="/tables/basic-table" component={BasicTable} />
          <Route path="/icons/mdi" component={Mdi} />
          <Route path="/charts/chart-js" component={ChartJs} />
          <Route
            path="/user-pages/login-1"
            render={() => <Login onLoginSuccess={this.props.onLoginSuccess} />}
          />
          <Route path="/user-pages/register-1" component={Register1} />
          <Route path="/error-pages/error-404" component={Error404} />
          <Route path="/error-pages/error-500" component={Error500} />

          {/* Only allow access to these routes if authenticated and role is valid */}
          {isAuthenticated && (userRole === 1 || userRole === 2) && (
            <>
              <Route path="/inventory/show" component={Inventory} />
              <Route path="/inventory/create" component={CreateInventory} />
              <Route path="/recap/show" component={Recap} />
              <Route path="/recap/create" component={CreateRecap} />
              <Route path="/recap-CVJ/show" component={RecapCvj} />
              <Route path="/recap-CVJ/create" component={CreateRecap} />
            </>
          )}
          {/* Redirect to dashboard if no valid route is matched */}
          <Redirect to="/dashboard" />
        </Switch>
      </Suspense>
    );
  }
}

export default AppRoutes;
