import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
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
                <RouteWrapper path="/tasks/completed" exact
                              component={Completed}
                              title={"Completed tasks"}
                              loginRequired
                />
                <RouteWrapper path="/tasks" exact
                              component={Active}
                              title={"Active tasks"}
                              loginRequired
                />
                <RouteWrapper path="/profile" exact
                              component={Profile}
                              title={"Profile"}
                              loginRequired
                />
                <RouteWrapper path=""
                              component={Home}
                              title={"Home"}
                />
            </Switch>
        </Router>
    );
}

function RouteWrapper({component: Component, title: title, loginRequired: loginRequired}) {
    const username = localStorage.getItem("username")
    const accessToken = localStorage.getItem("accessToken")

    return (
        <Route render={(props) =>
            <PageLayout
                title={username && accessToken ? title : null}
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