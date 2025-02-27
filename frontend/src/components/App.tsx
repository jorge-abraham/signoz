import React, { Suspense, useState } from "react";
import { Layout, Menu, Switch as ToggleButton, Spin, Row, Col } from "antd";
import { useThemeSwitcher } from "react-css-theme-switcher";

import {
	NavLink,
	BrowserRouter as Router,
	Route,
	Switch,
} from "react-router-dom";
import {
	LineChartOutlined,
	BarChartOutlined,
	DeploymentUnitOutlined,
	AlignLeftOutlined,
	AppstoreOutlined,
	SettingOutlined,
	ApiOutlined
} from "@ant-design/icons";

import DateTimeSelector from "Src/components/DateTimeSelector";
import ShowBreadcrumbs from "Src/components/ShowBreadcrumbs";
import styled from "styled-components";

const { Content, Footer, Sider } = Layout;

const ServiceMetrics = React.lazy(
	() => import("Src/components/metrics/ServiceMetricsDef"),
);
const ServiceMap = React.lazy(
	() => import("Src/components/servicemap/ServiceMap"),
);
const TraceDetail = React.lazy(
	() => import("Src/components/traces/TraceDetail"),
);
const TraceGraph = React.lazy(
	() => import("Src/components/traces/TraceGraphDef"),
);
const UsageExplorer = React.lazy(
	() => import("Src/components/usage/UsageExplorerDef"),
);
const ServicesTable = React.lazy(
	() => import("Src/components/metrics/ServicesTableDef"),
);
const Signup = React.lazy(() => import("Src/components/Signup"));
const SettingsPage = React.lazy(
	() => import("Src/components/settings/settingsPage"),
);

const IntstrumentationPage = React.lazy(
	() => import("Src/components/add-instrumentation/instrumentationPage"),
);
//PNOTE
//React. lazy currently only supports default exports. If the module you want to import uses named exports, you can create an intermediate module that reexports it as the default. This ensures that tree shaking keeps working and that you don't pull in unused components.

const ThemeSwitcherWrapper = styled.div`
	display: flex;
	justify-content: center;
	margin-top: 20px;
`;
const App = () => {
	// state = { collapsed: false, isDarkMode: true };
	const { switcher, currentTheme, status, themes } = useThemeSwitcher();
	const [isDarkMode, setIsDarkMode] = useState(true);
	const [collapsed, setCollapsed] = useState(false);

	const toggleTheme = (isChecked: boolean) => {
		setIsDarkMode(isChecked);
		switcher({ theme: isChecked ? themes.dark : themes.light });
	};

	const onCollapse = (): void => {
		setCollapsed(!collapsed);
	};

	if (status === "loading") {
		return null;
	}

	return (
		<Router basename="/">
			<Layout style={{ minHeight: "100vh" }}>
				<Sider
					collapsible
					collapsed={collapsed}
					onCollapse={onCollapse}
					width={160}
				>
					<div className="logo">
						<ThemeSwitcherWrapper>
							<ToggleButton checked={isDarkMode} onChange={toggleTheme} />
						</ThemeSwitcherWrapper>
						<NavLink to="/">
							<img
								src={"/signoz.svg"}
								alt={"SigNoz"}
								style={{
									margin: "5%",
									width: 100,
									display: !collapsed ? "block" : "none",
								}}
							/>
						</NavLink>
					</div>

					<Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
						<Menu.Item key="1" icon={<BarChartOutlined />}>
							<NavLink
								to="/application"
								style={{ fontSize: 12, textDecoration: "none" }}
							>
								Metrics
							</NavLink>
						</Menu.Item>
						<Menu.Item key="2" icon={<AlignLeftOutlined />}>
							<NavLink to="/traces" style={{ fontSize: 12, textDecoration: "none" }}>
								Traces
							</NavLink>
						</Menu.Item>
						<Menu.Item key="3" icon={<DeploymentUnitOutlined />}>
							<NavLink
								to="/service-map"
								style={{ fontSize: 12, textDecoration: "none" }}
							>
								Service Map
							</NavLink>
						</Menu.Item>
						<Menu.Item key="4" icon={<LineChartOutlined />}>
							<NavLink
								to="/usage-explorer"
								style={{ fontSize: 12, textDecoration: "none" }}
							>
								Usage Explorer
							</NavLink>
						</Menu.Item>
						<Menu.Item key="5" icon={<SettingOutlined />}>
							<NavLink to="/settings" style={{ fontSize: 12, textDecoration: "none" }}>
								Settings
							</NavLink>
						</Menu.Item>
						<Menu.Item key="6" icon={<ApiOutlined />}>
							<NavLink to="/add-instrumentation" style={{ fontSize: 12, textDecoration: "none" }}>
								Add instrumentation
							</NavLink>
						</Menu.Item>
					</Menu>
				</Sider>
				<Layout className="site-layout">
					<Content style={{ margin: "0 16px" }}>
						<Row>
							<Col span={16}>
								<ShowBreadcrumbs />
							</Col>

							<Col span={8}>
								<DateTimeSelector />
							</Col>
						</Row>

						{/* <Divider /> */}

						<Suspense fallback={<Spin size="large" />}>
							<Switch>
								<Route path="/application/:servicename" component={ServiceMetrics} />
								<Route path="/service-map" component={ServiceMap} />
								<Route path="/traces" exact component={TraceDetail} />
								<Route path="/traces/:id" component={TraceGraph} />
								<Route path="/settings" exact component={SettingsPage} />
								<Route path="/add-instrumentation" exact component={IntstrumentationPage} />
								<Route path="/usage-explorer" component={UsageExplorer} />
								<Route path="/" component={ServicesTable} />
								<Route path="/application" exact component={ServicesTable} />
							</Switch>
						</Suspense>
					</Content>
					<Footer style={{ textAlign: "center", fontSize: 10 }}>
						SigNoz Inc. ©2020{" "}
					</Footer>
				</Layout>
			</Layout>
		</Router>
	);
};

export default App;
