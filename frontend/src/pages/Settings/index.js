import React, { useState, useEffect } from "react";
import openSocket from "socket.io-client";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Container from "@material-ui/core/Container";
import Select from "@material-ui/core/Select";
import { toast } from "react-toastify";

import api from "../../services/api";
import { i18n } from "../../translate/i18n.js";
import toastError from "../../errors/toastError";
import { Input } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		alignItems: "center",
		padding: theme.spacing(4),
	},

	paper: {
		padding: theme.spacing(2),
		display: "flex",
		alignItems: "center",
	},

	settingOption: {
		marginLeft: "auto",
	},
	margin: {
		margin: theme.spacing(1),
	},
}));

const Settings = () => {
	const classes = useStyles();

	const [settings, setSettings] = useState([]);
	const [limitChat, setLimitChat] = useState(0);

	useEffect(() => {
		const fetchSession = async () => {
			try {
				const { data } = await api.get("/settings");
				setSettings(data);
				const { value } = data.find(s => s.key === "limitChat");
				setLimitChat(value);
			} catch (err) {
				toastError(err);
			}
		};
		fetchSession();
		
	}, []);

	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

		socket.on("settings", data => {
			if (data.action === "update") {
				setSettings(prevState => {
					const aux = [...prevState];
					const settingIndex = aux.findIndex(s => s.key === data.setting.key);
					aux[settingIndex].value = data.setting.value;
					return aux;
				});
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleChangeSetting = async e => {
		const selectedValue = e.target.value;
		const settingKey = e.target.name;

		try {
			await api.put(`/settings/${settingKey}`, {
				value: selectedValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const handleChangeLimit = async newValue => {
		
		//console.log(newValue);
		try {
			await api.put(`/settings/limitChat`, {
				value: newValue,
			});
			toast.success(i18n.t("settings.success"));
		} catch (err) {
			toastError(err);
		}
	};

	const getSettingValue = key => {
		const { value } = settings.find(s => s.key === key);
		return value;
	};

	const _handleKeyDown =  e=> {
		if (e.key === 'Enter') {
			
			handleChangeLimit(limitChat);
		}
	  }

	return (
		<div className={classes.root}>
			<Container className={classes.container} maxWidth="sm">
				<Typography variant="body2" gutterBottom>
					{i18n.t("settings.title")}
				</Typography>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("settings.settings.userCreation.name")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="userCreation-setting"
						name="userCreation"
						value={
							settings && settings.length > 0 && getSettingValue("userCreation")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>
					
				</Paper>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("Cargar solo chats no vistos")}
					</Typography>
					<Select
						margin="dense"
						variant="outlined"
						native
						id="onlyUnread-setting"
						name="onlyUnread"
						value={
							settings && settings.length > 0 && getSettingValue("onlyUnread")
						}
						className={classes.settingOption}
						onChange={handleChangeSetting}
					>
						<option value="enabled">
							{i18n.t("settings.settings.userCreation.options.enabled")}
						</option>
						<option value="disabled">
							{i18n.t("settings.settings.userCreation.options.disabled")}
						</option>
					</Select>
					
					
				</Paper>
				<Paper className={classes.paper}>
					<Typography variant="body1">
						{i18n.t("Número de mensajes recuperados")}
					</Typography>
					<Input
						margin="dense"
						variant="outlined"
						native
						id="limitChat-setting"
						name="limitChat"
						value={
							limitChat
						}
						className={classes.settingOption}
						onKeyDown={_handleKeyDown}
						onChange={(e) => setLimitChat(e.target.value)}
					>

					</Input>
					
					
					
				</Paper>
			</Container>
			
		</div>
	);
};

export default Settings;
