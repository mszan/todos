import React from 'react';
import axios from "axios";
import {List, message, Spin} from "antd";
import InfiniteScroll from 'react-infinite-scroller';
import authHeader from "../../services/auth-header";


export class All extends React.Component {
    state = {
        tasks: [],
        loading: false,
        hasMore: true,
    };

    componentDidMount() {
        this.getTasks(res => {
            this.setState({
                tasks: res.results,
            });
        });
    }

    getTasks = () => {
        axios.get('http://localhost:5000/api/tasks/', { headers: authHeader() })
            .then(response => {
                this.setState({tasks: response.data})
            })
            .catch(err => {console.log(err)})
    };

    handleInfiniteOnLoad = () => {
        let { tasks } = this.state;
        this.setState({
            loading: true,
        });
        if (tasks.length > 14) {
            message.warning('Infinite List loaded all');
            this.setState({
                hasMore: false,
                loading: false,
            });
            return;
        }
        this.getTasks(res => {
            tasks = tasks.concat(res.results);
            this.setState({
                tasks,
                loading: false,
            });
        });
    };

    render() {
        return (
            <div className="demo-infinite-container">
                <InfiniteScroll
                    initialLoad={false}
                    pageStart={0}
                    loadMore={this.handleInfiniteOnLoad}
                    hasMore={!this.state.loading && this.state.hasMore}
                    useWindow={false}
                >
                    <List
                        dataSource={this.state.tasks}
                        renderItem={item => (
                            <List.Item key={item.id}>
                                <List.Item.Meta
                                    title={item.title}
                                    description={item.description}
                                />
                                <div>Content</div>
                            </List.Item>
                        )}
                    >
                        {this.state.loading && this.state.hasMore && (
                            <div className="demo-loading-container">
                                <Spin />
                            </div>
                        )}
                    </List>
                </InfiniteScroll>
            </div>
        );
    }
}