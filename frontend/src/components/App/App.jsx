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
                    navKey="3"
                    exact path="/tasks"
                    component={Active}
                    title={"Active tasks"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="4"
                    exact path="/tasks/completed"
                    component={Completed}
                    title={"Completed tasks"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="2"
                    exact path="/profile"
                    component={Profile}
                    title={"Profile"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="1"
                    exact path=""
                    component={Home}
                    title={"Home"}
                />
            </Switch>
        </Router>
    );
}

// Wrapper for route components
function RouteWrapper({component: Component, title: title, loginRequired: loginRequired, navKey: navKey}){
    const username = localStorage.getItem("username")
    const accessToken = localStorage.getItem("accessToken")

    // Get layout's inner component depending on logged user
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
        <Route render={() =>
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