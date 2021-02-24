import React from 'react';
import renderer from 'react-test-renderer';
import TasksSummaryChart from "./TasksSummaryChart";

test('renders Profile - TaskSummaryChart', () => {
    const component = renderer.create(<TasksSummaryChart tasksData={null} />)
    let tree = component.toJSON()
    expect(tree).toMatchSnapshot()
})