import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Profile} from "../Users/Profile";
import {All} from "../Tasks/All";
import {Home} from "../Home/Home";
import {Result} from "antd";
import {HeaderBtn} from "../Registration/HeaderBtn";

function App() {
    return (
        <Router>
            <Switch>
                <RouteWrapper path="/tasks" exact
                              component={All}
                              title={"All tasks"}
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