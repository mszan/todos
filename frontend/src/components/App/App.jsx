import {PageLayout} from "../PageLayout/PageLayout";
import {BrowserRouter as Router, Link, Switch, Route} from "react-router-dom";
import {UsersProfile} from "../Users/UsersProfile";
import {TasksAll} from "../Tasks/TasksAll";
import {Home} from "../Home/Home";

function App() {
    return (
        <Router>
            <Switch>
                <RouteWrapper path="/tasks/all" component={TasksAll} />
                <RouteWrapper path="/users/all" component={UsersProfile} />
                <RouteWrapper path="" exact component={Home} />
            </Switch>
        </Router>
    );
}

function RouteWrapper({component: Component}) {
    return (
        <Route render={(props) =>
            <PageLayout>
                <Component />
            </PageLayout>
        }
        />
    );
}

export default App;