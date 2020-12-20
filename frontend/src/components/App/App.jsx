import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";
import {Profile} from "../Users/Profile";
import {Active} from "../Tasks/Active";
import {Home} from "../Home/Home";
import {Result} from "antd";
import {HeaderBtn} from "../Registration/HeaderBtn";
import {Completed} from "../Tasks/Completed";

function App() {
    return (
        <Router>
            <Switch>
                <RouteWrapper
                    navKey="4"
                    path="/tasks/completed" exact
                    component={Completed}
                    title={"Completed tasks"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="3"
                    path="/tasks" exact
                    component={Active}
                    title={"Active tasks"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="2"
                    path="/profile" exact
                    component={Profile}
                    title={"Profile"}
                    loginRequired
                />
                <RouteWrapper
                    navKey="1"
                    path=""
                    component={Home}
                    title={"Home"}
                />
            </Switch>
        </Router>
    );
}

function RouteWrapper({component: Component, title: title, loginRequired: loginRequired, navKey: navKey}) {
    const username = localStorage.getItem("username")
    const accessToken = localStorage.getItem("accessToken")

    return (
        <Route render={(props) =>
            <PageLayout
                title={username && accessToken ? title : null}
                navKey={navKey ? navKey : null}
            >
                {!loginRequired ?
                    <Component/> : username && accessToken ?
                        <Component /> :
                        <Result
                            title="User not logged in"
                            subTitle="You need to be logged in to view this page."
                            extra={<HeaderBtn noStyle/>}
                        />
                }
            </PageLayout>
        }
        />
    );
}

export default App;