import './App.css';
import { Home } from './Home';
import { User } from './User';
import { Navigation } from './Navigation';

import { BrowserRouter, Switch, Route } from 'react-router-dom';

function App() {
  return (

    <BrowserRouter>
      <div className="container">
        <Navigation />
        <Switch>
          <Route path='/' component={Home} exact />
          <Route path='/user' component={User} />
        </Switch>
      </div>

    </BrowserRouter>
  );
}

export default App;
