import React, { useContext, useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Divider from "@material-ui/core/Divider";
import { Badge } from "@material-ui/core";
import DashboardOutlinedIcon from "@material-ui/icons/DashboardOutlined";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SyncAltIcon from "@material-ui/icons/SyncAlt";
import SettingsOutlinedIcon from "@material-ui/icons/SettingsOutlined";
import PeopleAltOutlinedIcon from "@material-ui/icons/PeopleAltOutlined";
import ContactPhoneOutlinedIcon from "@material-ui/icons/ContactPhoneOutlined";
import AccountTreeOutlinedIcon from "@material-ui/icons/AccountTreeOutlined";
import SendIcon from '@material-ui/icons/Send';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import BusinessIcon from '@material-ui/icons/Business';
import BlurLinearIcon from '@material-ui/icons/BlurLinear';
import { i18n } from "../translate/i18n";
import { WhatsAppsContext } from "../context/WhatsApp/WhatsAppsContext";
import { AuthContext } from "../context/Auth/AuthContext";
import { Can } from "../components/Can";

function ListItemLink(props) {
	const { icon, primary, to, className } = props;

	const renderLink = React.useMemo(
		() =>
			React.forwardRef((itemProps, ref) => (
				<RouterLink to={to} ref={ref} {...itemProps} />
			)),
		[to]
	);

	return (
		<li>
			<ListItem button component={renderLink} className={className}>
				{icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
				<ListItemText primary={primary} />
			</ListItem>
		</li>
	);
}

const MainListItems = () => {
	const { whatsApps } = useContext(WhatsAppsContext);
	const { user } = useContext(AuthContext);
	const [connectionWarning, setConnectionWarning] = useState(false);

	useEffect(() => {
		const delayDebounceFn = setTimeout(() => {
			if (whatsApps.length > 0) {
				const offlineWhats = whatsApps.filter(whats => {
					return (
						whats.status === "qrcode" ||
						whats.status === "PAIRING" ||
						whats.status === "DISCONNECTED" ||
						whats.status === "TIMEOUT" ||
						whats.status === "OPENING"
					);
				});
				if (offlineWhats.length > 0) {
					setConnectionWarning(true);
				} else {
					setConnectionWarning(false);
				}
			}
		}, 2000);
		return () => clearTimeout(delayDebounceFn);
	}, [whatsApps]);

	return (
		<div>
			<ListItemLink
				to="/"
				primary="Dashboard"
				icon={<DashboardOutlinedIcon />}
			/>
			<ListItemLink
				to="/connections"
				primary={i18n.t("mainDrawer.listItems.connections")}
				icon={
					<Badge badgeContent={connectionWarning ? "!" : 0} color="error">
						<SyncAltIcon />
					</Badge>
				}
			/>
			<ListItemLink
				to="/tickets"
				primary={i18n.t("mainDrawer.listItems.tickets")}
				icon={<WhatsAppIcon />}
			/>

			<ListItemLink
				to="/contacts"
				primary={i18n.t("mainDrawer.listItems.contacts")}
				icon={<ContactPhoneOutlinedIcon />}
			/>
			<Can
				role={user.profile}
				perform="drawer-admin-items:view"
				yes={() => (
					<>
						<Divider />
						<ListSubheader inset>
							{i18n.t("mainDrawer.listItems.administration")}
						</ListSubheader>
						<ListItemLink
							to="/users"
							primary={i18n.t("mainDrawer.listItems.users")}
							icon={<PeopleAltOutlinedIcon />}
						/>
						<ListItemLink
							to="/queues"
							primary={i18n.t("mainDrawer.listItems.queues")}
							icon={<BusinessIcon />}
						/>
						<ListItemLink
							to="/tags"
							primary={i18n.t("mainDrawer.listItems.tags")}
							icon={<AccountTreeOutlinedIcon />}
						/>
						<ListItemLink
							to="/Msg"
							primary={i18n.t("mainDrawer.listItems.msg")}
							icon={<AccessTimeIcon />}
						/>
						<ListItemLink
							to="/sending"
							primary={i18n.t("mainDrawer.listItems.envio")}
							icon={<SendIcon />}
						/>
						<ListItemLink
							to="/api"
							primary={i18n.t("mainDrawer.listItems.whaticketApi")}
							icon={<BlurLinearIcon />}
						/>
						<ListItemLink
							to="/settings"
							primary={i18n.t("mainDrawer.listItems.settings")}
							icon={<SettingsOutlinedIcon />}
						/>
					</>
				)}
			/>
		</div>
	);
};

export default MainListItems;
