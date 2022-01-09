import React, {Component} from "react";
import { BrowserRouter, Link, Switch, Route } from "react-router-dom";

export class Industry extends Component {

    render() {

        return (
            <BrowserRouter>
              <React.Fragment>
                <h2>Accounts</h2>
                <ul>
                  <li>
                    <Link to="/industries/qazwsx">Foo User</Link>
                  </li>
                  <li>
                    <Link to="/industries/edcrfv/rfvtgb">Bar User</Link>
                  </li>
                  <li>
                    <Link to="/industries/zxcvbnm">Baz User</Link>
                  </li>
                </ul>
                <Switch>
                  <Route path="/industries/:name?/:surname?" />
                </Switch>
              </React.Fragment>
            </BrowserRouter>
          );
    }
}
