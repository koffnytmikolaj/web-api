import '../App.css';
import { Home } from './Home/Home';
import { User } from './Users/User';
import { Login } from './Authorization/Login';
import { Register } from './Authorization/Register';
import { TopNavigation } from './Navbar/TopNavigation';
import { BottomNavigation } from './Navbar/BottomNavigation';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { Component } from 'react';
import { ErrorView } from './AdditionalElements/ErrorView';
import  Spinner  from './AdditionalElements/LoadingSchemas/Spinner/Spinner';
import { Industry } from './Industries/Industry';


export class Content extends Component {

    constructor() {

        super();
        this.state = {
            userAuthorized: -1,
            connected: true
        }
        
    }
    
    getUserPath = process.env.REACT_APP_API + 'login';

    async getUser() {

        await fetch(this.getUserPath, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
        .then(response => 
            response.json(),
                (error) => {
                    if(error)
                        this.setState({connected: false});
                    else
                        this.setState({connected: true});
                }
        )
        .then(result => {
            if(result !== -1 && result !== 0 && result !== undefined)
                result = result[0];
            this.setState({userAuthorized: result});
        })
        .catch(err => {
            alert(err)
        });
    }


    componentDidMount() {

        this.getUser();
    }

    componentWillUnmount() {

        this.setState({checkedAuthorization: false});
    }

    

    render() {

        if(this.state.userAuthorized !== -1 && this.state.userAuthorized !== undefined)
            return(
                <BrowserRouter>
                    <div className="container">
                        <TopNavigation logged_user={this.state.userAuthorized} />
                        <BottomNavigation logged_user={this.state.userAuthorized} />
                        <Switch>
                            <Route path='/' render={(props) => <Home {...props} logged_user={this.state.userAuthorized} />} exact />
                            <Route path='/user' render={(props) => <User {...props} logged_user={this.state.userAuthorized} />} />
                            <Route path='/login' render={(props) => <Login {...props} logged_user={this.state.userAuthorized} />} />
                            <Route path='/register' render={(props) => <Register {...props} logged_user={this.state.userAuthorized} />} />
                            <Route path='/industries' render={(props) => <Industry {...props} logged_user={this.state.userAuthorized} />} />
                        </Switch>
                    </div>
                </BrowserRouter>
            );
        else {
            if(this.state.connected)
                return(<Spinner/>);
            else
                return(<ErrorView />);
        }   
    }
}
