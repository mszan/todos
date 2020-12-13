import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";
import {Profile} from "../Users/Profile";
import {All} from "../Tasks/All";
import {Home} from "../Home/Home";

function App() {
    return (
        <Router>
            <Switch>
                <RouteWrapper path="/tasks" exact component={All}/>
                <RouteWrapper path="/profile" exact component={Profile} />
                <RouteWrapper path="" component={Home} />
            </Switch>
        </Router>
    );
}

function RouteWrapper({component: Component}) {
    return (
        <Route render={(props) =>
            <PageLayout>
                <Component/>
            </PageLayout>
        }
        />
    );
}

export default App;