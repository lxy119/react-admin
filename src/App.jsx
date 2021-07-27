import React, {Component} from 'react';
// import { Button } from 'antd';
import {BrowserRouter,Route,Switch} from "react-router-dom";
import Admin from "./pages/Admin";
import Login from "./pages/Login";

class App extends Component {


    render() {
        return (
        <BrowserRouter>
            <Switch>{/*只匹配一个*/}
                <Route path = '/login' component = {Login}></Route>
                <Route path = '/' component = {Admin}></Route>
            </Switch>
        </BrowserRouter>
        );
    }
}

export default App;