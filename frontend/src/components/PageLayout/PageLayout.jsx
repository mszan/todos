import React from "react";
import {Card, Layout, Menu, Statistic} from 'antd';
import {
    ArrowUpOutlined,
    CheckCircleOutlined,
    CheckOutlined,
    HomeOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
} from '@ant-design/icons';
import {Footer} from "antd/es/layout/layout";
import './PageLayout.css'
import SubMenu from "antd/es/menu/SubMenu";
import {HeaderBtn} from "../Registration/HeaderBtn";
import {Link, NavLink} from "react-router-dom";
import QueueAnim from "rc-queue-anim";
import Animate from "rc-animate";
import Text from "antd/es/typography/Text";

const { Header, Sider, Content } = Layout;

export class PageLayout extends React.Component {
    isSidebarCollapsed = () => {
        try {
            return JSON.parse(localStorage.getItem("sidebarCollapsed"))
        } catch {
            return false
        }
    }

    state = {
        collapsed: this.isSidebarCollapsed(),
        username: localStorage.getItem("username")
    }

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
        localStorage.setItem("sidebarCollapsed", String(!this.state.collapsed))
    };

    render() {
        const {username} = this.state

        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0, }}>
                    <Animate transitionName="fade" transitionAppear>
                        <div key="siderLogo" className="logo">
                            <Link to="">
                                LOGO
                            </Link>
                        </div>
                        <Menu key="siderNav" theme="dark" mode="inline" defaultSelectedKeys={this.props.navKey ? this.props.navKey : "0"}>
                            <Menu.Item key="1" icon={<HomeOutlined />}>
                                <NavLink to="/">
                                    Home
                                </NavLink>
                            </Menu.Item>
                            {username ? (
                                <React.Fragment>
                                    <SubMenu key="subLists" icon={<CheckOutlined />} title="Tasks">
                                        <Menu.Item key="3" icon={<HomeOutlined />}>
                                            <NavLink to="/tasks">
                                                Active
                                            </NavLink>
                                        </Menu.Item>
                                        {/*<Menu.Item key="3" icon={<FireOutlined />}>Important</Menu.Item>*/}
                                        {/*<Menu.Item key="4" icon={<FieldTimeOutlined />}>Running out</Menu.Item>*/}
                                        <Menu.Item key="4" icon={<CheckCircleOutlined />}>
                                            <NavLink to="/tasks/completed">
                                                Completed
                                            </NavLink>
                                        </Menu.Item>
                                    </SubMenu>
                                    <Menu.Item key="2" icon={<UserOutlined />}>
                                        <NavLink to="/profile">
                                            Profile
                                        </NavLink>
                                    </Menu.Item>
                                </React.Fragment>
                            ) : null}
                        </Menu>
                    </Animate>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}>
                        <Animate transitionName="fade" transitionAppear>
                            {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                key: 'sidebarCollapse',
                                className: 'trigger',
                                onClick: this.toggle,
                            })}
                            <Text key="pageTitle">{this.props.title}</Text>
                            <HeaderBtn key="headerBtn" loginRequired={this.props.loginRequired}/>
                        </Animate>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                        }}
                    >

                        {this.props.children}
                    </Content>
                    <Animate transitionName="fade" transitionAppear>
                        <Footer className="footer">
                            Copyright &copy; 2020. Made with love by <a href="mailto:dmszanowski@icloud.com">mszan</a>.
                        </Footer>
                    </Animate>
                </Layout>
            </Layout>
        );
    }
}