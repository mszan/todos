import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Profile} from "../Users/Profile";
import {All} from "../Tasks/All";
import {Home} from "../Home/Home";

function App() {
    return (
        <Router>
            <Switch>
                <RouteWrapper path="/tasks" exact component={All} title={"All tasks"}/>
                <RouteWrapper path="/profile" exact component={Profile} title={"Profile"}/>
                <RouteWrapper path="" component={Home} title={"Home"}/>
            </Switch>
        </Router>
    );
}

function RouteWrapper({component: Component, title: title}) {
    return (
        <Route render={(props) =>
            <PageLayout title={title}>
                <Component/>
            </PageLayout>
        }
        />
    );
}

export default App;