import '../App.css';
import Home from './Home/Home';
import User from './Users/User';
import Login from './Authorization/Login';
import Register from './Authorization/Register';
import TopNavigation from './Navbar/TopNavigation';
import BottomNavigation from './Navbar/BottomNavigation';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ErrorView } from './AdditionalElements/ErrorView';
import Spinner  from './AdditionalElements/LoadingSchemas/Spinner/Spinner';
import Industry from './Industries/Industry';
import Company from './Companies/Company';
import TradeNotes from './TradeNotes/TradeNotes';
import ContactPeople from './ContactPeople/ContactPeople';


function Content() {

    const [userAuthorized, setUserAuthorized] = useState(-1);
    const [connected, setConnected] = useState(true);
    
    const getUserPath = process.env.REACT_APP_API + 'login';

    useEffect(() => {
        (
            async () => {
                await fetch(getUserPath, {
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
                                setConnected(false);
                            else
                                setConnected(true);
                        }
                )
                .then(result => {
                    if(result !== -1 && result !== 0 && result !== undefined)
                        result = result[0];
                    setUserAuthorized(result);
                })
                .catch(err => {
                    alert(err)
                });
            }
        )();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    
    function renderNavigationBar() {

        return(
            <>
                <TopNavigation logged_user={userAuthorized} />
                <BottomNavigation logged_user={userAuthorized} />
            </>
        );
    }

    function renderSwitch() {

        return(
            <Switch>
                <Route path='/' exact>
                    <Home logged_user={userAuthorized} />
                </Route>
                <Route path='/user'>
                    <User logged_user={userAuthorized} />
                </Route>
                <Route path='/login'>
                    <Login logged_user={userAuthorized} />
                </Route>
                <Route path='/register'>
                    <Register logged_user={userAuthorized} />
                </Route>
                <Route path='/company'>
                    <Company logged_user={userAuthorized} />
                </Route>
                <Route path='/trade_notes'>
                    <TradeNotes logged_user={userAuthorized} />
                </Route>
                <Route path='/contact_people'>
                    <ContactPeople logged_user={userAuthorized} />
                </Route>
                <Route path='/industry'>
                    <Industry logged_user={userAuthorized} />
                </Route>
            </Switch>
        );
    }

    function main() {

        if(userAuthorized !== -1 && userAuthorized !== undefined) {
            return (
                <BrowserRouter>
                    <div className="container">
                        {renderNavigationBar()}
                        {renderSwitch()}
                    </div>
                </BrowserRouter>
            );
        } 
        else {
            if(connected)
                return <Spinner/>;
            else
                return <ErrorView />;
        }
    }


    return main();
}

export default Content;
