import React from 'react'
import renderer from 'react-test-renderer';
import {RouteWrapper} from "../App/App";
import {Active} from "../Tasks/Active";

test ('renders activetasks', () => {
    const tree = renderer
        .create(<RouteWrapper
            navKey="3"
            exact path="/tasks"
            component={Active}
            title={"Active tasks"}
            loginRequired
        />)
        .toJSON()
    expect(tree).toMatchSnapshot()
})