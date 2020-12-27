import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Profile} from "../Users/Profile";
import {Active} from "../Tasks/Active";
import {Home} from "../Home/Home";
import {Result} from "antd";
import {LoginBtn} from "../Registration/LoginBtn";
import {Completed} from "../Tasks/Completed";
import React from "react";

function App() {
    return (
        <Router>
            <Switch>
                <RouteWrapper
                    navKey="4"
                    path="/tasks/completed"
                    component={Completed}
                    title={"Completed tasks"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="3"
                    path="/tasks"
                    component={Active}
                    title={"Active tasks"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="2"
                    path="/profile"
                    component={Profile}
                    title={"Profile"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="1"
                    path="" exact
                    component={Home}
                    title={"Home"}
                />
            </Switch>
        </Router>
    );
}


function RouteWrapper({component: Component, title: title, loginRequired: loginRequired, navKey: navKey}){
    const username = localStorage.getItem("username")
    const accessToken = localStorage.getItem("accessToken")

    const getComponent = () => {
        if (loginRequired) {
            if (username && accessToken) {
                return <Component />
            } else {
                return (
                    <Result
                        title=""
                        subTitle="You need to be logged in to view this page."
                        extra={<LoginBtn />}
                    />
                )
            }
        } else {
            return <Component />
        }
    }

    return (
        <Route render={(props) =>
            <PageLayout
                title={username && accessToken ? title : null}
                navKey={navKey ? navKey : null}
            >
                {getComponent()}
            </PageLayout>
        }
        />
    );
}

export default App;