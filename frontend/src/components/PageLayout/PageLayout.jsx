import React from "react";
import { Layout, Menu } from 'antd';
import {
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    UserOutlined,
    VideoCameraOutlined,
    UploadOutlined, FireOutlined, BellOutlined, FieldTimeOutlined, CheckCircleOutlined, HomeOutlined,
} from '@ant-design/icons';
import {Footer} from "antd/es/layout/layout";
import './PageLayout.css'
import SubMenu from "antd/es/menu/SubMenu";
import {HeaderSignBtns} from "./HeaderSignBtns";
import {Link, NavLink} from "react-router-dom";

const { Header, Sider, Content } = Layout;

export class PageLayout extends React.Component {
    state = {
        collapsed: true,
    };

    toggle = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    render() {
        return (
            <Layout>
                <Sider trigger={null} collapsible collapsed={this.state.collapsed}>
                    <div className="logo">
                        <Link to="">
                            LOGO
                        </Link>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
                        <SubMenu key="subLists" icon={<BellOutlined />} title="Tasks">
                            <Menu.Item key="1" icon={<HomeOutlined />}>All</Menu.Item>
                            <Menu.Item key="2" icon={<FireOutlined />}>Important</Menu.Item>
                            <Menu.Item key="3" icon={<FieldTimeOutlined />}>Running out</Menu.Item>
                            <Menu.Item key="4" icon={<CheckCircleOutlined />}>Completed</Menu.Item>
                        </SubMenu>
                        <Menu.Item key="5" icon={<UserOutlined />}>
                            <NavLink to="/users/all">
                                Profile
                            </NavLink>
                        </Menu.Item>
                    </Menu>
                </Sider>
                <Layout className="site-layout">
                    <Header className="site-layout-background" style={{ padding: 0 }}>
                        {React.createElement(this.state.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
                            className: 'trigger',
                            onClick: this.toggle,
                        })}
                        {/*{this.props.title ? this.props.title : ""}*/}
                        <HeaderSignBtns/>
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