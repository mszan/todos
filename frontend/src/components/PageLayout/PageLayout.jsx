import React from "react";
import {Col, Layout, Menu, Row} from 'antd';
import {
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
import {LoginBtn} from "../Registration/LoginBtn";
import {RegisterBtn} from "../Registration/RegisterBtn";
import {Link, NavLink} from "react-router-dom";
import Animate from "rc-animate";
import Text from "antd/es/typography/Text";

const { Header, Sider, Content } = Layout;

// Main page layout
export class PageLayout extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            collapsed: this.isSidebarCollapsed(), // Sidebar collapsed
            loginModalVisible: false, // Login modal with form visibility
            registerModalVisible: false, // Register modal with form visibility
        }
    }

    // Check if sidebar is collapsed
    isSidebarCollapsed = () => {
        try {
            if (window.innerWidth < 400) return true // If user uses small display, collapse sidebar
            return JSON.parse(localStorage.getItem("sidebarCollapsed")) // Get data from localStorage
        } catch {
            return false // If error (e.g. data not set), set false
        }
    }

    // Toggle sidebar collapse
    sidebarToggle = () => {
        this.setState({collapsed: !this.state.collapsed});
        localStorage.setItem("sidebarCollapsed", String(!this.state.collapsed)) // Update data in localStorage
    };

    // Login and register modal visibility handler
    handleLoginRegisterModalSwitch = () => {
        this.setState({
            loginModalVisible: !this.state.loginModalVisible,
            registerModalVisible: !this.state.registerModalVisible,
        })
    }

    render() {
        const username = localStorage.getItem("username")

        return (
            <Layout>
                <Sider
                    trigger={null}
                    collapsible
                    collapsed={this.state.collapsed}
                    // breakpoint="lg"
                    collapsedWidth={window.innerWidth < 400 ? 0 : 80}
                    style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0 }}
                >
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
                            <Row key="pageHeader" justify="space-between" style={{minWidth: 295}}>
                                <Col>
                                    {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                                        className: 'trigger',
                                        onClick: this.sidebarToggle,
                                    })}
                                    <Text>{this.props.title}</Text>
                                </Col>
                                <Col style={{marginRight: "1rem"}}>
                                    <RegisterBtn
                                        visible={this.state.registerModalVisible}
                                        handleLoginRegisterModalSwitch={this.handleLoginRegisterModalSwitch}
                                        handleVisible={() => this.setState({registerModalVisible: !this.state.registerModalVisible})}
                                    />
                                    <LoginBtn
                                        visible={this.state.loginModalVisible}
                                        handleLoginRegisterModalSwitch={this.handleLoginRegisterModalSwitch}
                                        handleVisible={() => this.setState({loginModalVisible: !this.state.loginModalVisible})}
                                    />
                                </Col>
                            </Row>
                        </Animate>
                    </Header>
                    <Content
                        className="site-layout-background"
                        style={{
                            margin: '24px 16px',
                            padding: 24,
                            minWidth: window.innerWidth < 400 ? '100vw' : null,
                        }}
                    >

                        {this.props.children}
                    </Content>
                    <Animate transitionName="fade" transitionAppear>
                        <Footer className="footer">
                            Made with love by <a href="mailto:dmszanowski@icloud.com">mszan</a>.
                        </Footer>
                    </Animate>
                </Layout>
            </Layout>
        );
    }
}