import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field } from "formik";
import { toast } from "react-toastify";

import { makeStyles } from "@material-ui/core/styles";
import { green } from "@material-ui/core/colors";

import {
	Dialog,
	DialogContent,
	DialogTitle,
	Button,
	DialogActions,
	CircularProgress,
	TextField,
	Switch,
	FormControlLabel,
} from "@material-ui/core";

import api from "../../services/api";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import QueueSelect from "../QueueSelect";
import randomToken from 'random-token'
const useStyles = makeStyles(theme => ({
	root: {
		display: "flex",
		flexWrap: "wrap",
	},

	multFieldLine: {
		display: "flex",
		"& > *:not(:last-child)": {
			marginRight: theme.spacing(1),
		},
	},

	btnWrapper: {
		position: "relative",
	},

	buttonProgress: {
		color: green[500],
		position: "absolute",
		top: "50%",
		left: "50%",
		marginTop: -12,
		marginLeft: -12,
	},
}));

const SessionSchema = Yup.object().shape({
	name: Yup.string()
		.min(2, "Too Short!")
		.max(50, "Too Long!")
		.required("Required"),
});

const WhatsAppTokenModal = ({ open, onClose, whatsAppId,wpMain }) => {
	const classes = useStyles();
	const initialState = {
		name: "",
		greetingMessage: "",
		isDefault: false,
	};
	const [whatsApp, setWhatsApp] = useState(initialState);
	const [message, setMessage] = useState("");

	useEffect(() => {
		setMessage(wpMain?.whatsappToken[0]?.message);
	}, [whatsAppId,wpMain]);

	const handleSaveWhatsApp = async () => {
		
		if(message== ""){
			alert("El mensaje no puede estar vacio");
			return false;
		}
		if(message.length < 10){
			alert("El mensaje debe contener al menos 10 caracteres");
			return false;
		}
		
		var token = randomToken(16);
		
		const whatsappData= {
			"wpid":wpMain.id,
			"message":message,
			"token":token
		};

		console.log(whatsappData);
		try {
			
			
			if (wpMain?.whatsappToken[0]?.id) {
				await api.put(`/whatsappTokens/${wpMain?.whatsappToken[0]?.id}`, {"message":message});
			} else {
				await api.post("/whatsappTokens", whatsappData);
			}
			toast.success(i18n.t("Url generada con exito"));
			handleClose();
		} catch (err) {
			toastError(err);
		}
	};

	const handleClose = () => {
		onClose();
		setWhatsApp(initialState);
	};

	return (
		<div className={classes.root}>
			<Dialog
				open={open}
				onClose={handleClose}
				maxWidth="sm"
				fullWidth
				scroll="paper"
			>
				<DialogTitle>
					{whatsAppId
						? i18n.t("whatsappModal.title.edit")
						: i18n.t("whatsappModal.title.add")}
				</DialogTitle>
			
							<DialogContent dividers>
						
								<div>
	
									<TextField
										as={TextField}
										label={i18n.t("queueModal.form.greetingMessage")}
										value={message}
										multiline
										rows={5}
										fullWidth
										name="greetingMessage"
										onChange={(e) => setMessage(e.target.value)}  
										variant="outlined"
										margin="dense"
									/>
								</div>
							
							</DialogContent>
							<DialogActions>
								<Button
									onClick={handleClose}
									color="secondary"
									
									variant="outlined"
								>
									{i18n.t("whatsappModal.buttons.cancel")}
								</Button>
								<Button
									
									color="primary"
								
									variant="contained"
									className={classes.btnWrapper}
									onClick={handleSaveWhatsApp}
								>
									{whatsAppId
										? i18n.t("whatsappModal.buttons.okEdit")
										: i18n.t("whatsappModal.buttons.okAdd")}
									
								</Button>
							</DialogActions>
					
			</Dialog>
		</div>
	);
};

export default React.memo(WhatsAppTokenModal);
