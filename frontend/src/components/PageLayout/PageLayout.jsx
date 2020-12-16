import React from "react";
import {Layout, Menu} from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    FireOutlined,
    FieldTimeOutlined,
    CheckCircleOutlined,
    HomeOutlined,
    CheckOutlined,
} from '@ant-design/icons';
import {Footer} from "antd/es/layout/layout";
import './PageLayout.css'
import SubMenu from "antd/es/menu/SubMenu";
import {HeaderBtn} from "../Registration/HeaderBtn";
import {Link, NavLink} from "react-router-dom";

const { Header, Sider, Content } = Layout;

export class PageLayout extends React.Component {
    state = {
        collapsed: false,
        username: localStorage.getItem("username")
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        const {username} = this.state

        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed} style={{ overflow: 'auto', height: '100vh', position: 'sticky', top: 0, left: 0, }}>
                    <div className="logo">
                        <Link to="">
                            LOGO
                        </Link>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <Menu.Item key="1" icon={<HomeOutlined />}>
                            <NavLink to="/">
                                Home
                            </NavLink>
                        </Menu.Item>
                        {username ? (
                            <React.Fragment>
                                <SubMenu key="subLists" icon={<CheckOutlined />} title="Tasks">
                                    <Menu.Item key="2" icon={<HomeOutlined />}>
                                        <NavLink to="/tasks">
                                            All
                                        </NavLink>
                                    </Menu.Item>
                                    <Menu.Item key="3" icon={<FireOutlined />}>Important</Menu.Item>
                                    <Menu.Item key="4" icon={<FieldTimeOutlined />}>Running out</Menu.Item>
                                    <Menu.Item key="5" icon={<CheckCircleOutlined />}>Completed</Menu.Item>
                                </SubMenu>
                                <Menu.Item key="6" icon={<UserOutlined />}>
                                    <NavLink to="/profile">
                                        Profile
                                    </NavLink>
                                </Menu.Item>
                            </React.Fragment>
                        ) : null}
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{padding: 0}}>
                        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle,
                        })}
                        {this.props.title}
                        <HeaderBtn/>
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
                    <Footer className="footer">
                        Copyright &copy; 2020. Made with love by <a href="mailto:dmszanowski@icloud.com">mszan</a>.
                    </Footer>
                </Layout>
            </Layout>
        );
    }
}