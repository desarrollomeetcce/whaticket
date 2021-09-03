import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";

import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";

import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import Autocomplete, {
	createFilterOptions,
} from "@material-ui/lab/Autocomplete";
import CircularProgress from "@material-ui/core/CircularProgress";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import ButtonWithSpinner from "../ButtonWithSpinner";
import toastError from "../../errors/toastError";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from 'moment';
import { toast } from "react-toastify";
import { green } from "@material-ui/core/colors";
import MessageInputMassive from "../../components/MessageInputMassive";

const filterOptions = createFilterOptions({
	trim: true,
});

const ProgramMsgModal = ({user,ticket, modalOpen, onClose, ticketid }) => {
	const history = useHistory();
	const [options, setOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const [searchParam, setSearchParam] = useState("");
	const [selectedUser, setSelectedUser] = useState(null);
	const [startDate, setStartDate] = useState(new Date());
	const [messageProgram, setMessageProgram] = useState("");

	useEffect(() => {
		//console.log(user);
		//console.log(ticket);

		const delayDebounceFn = setTimeout(() => {
			const fetchUsers = async () => {
				try {
					const { data } = await api.get("/users/", {
						params: { searchParam },
					});
					setOptions(data.users);
					setLoading(false);
				} catch (err) {
					setLoading(false);
					toastError(err);
				}
			};

			fetchUsers();
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [searchParam, modalOpen]);

	const handleClose = () => {
		onClose();

	};
	const sendMessage = (medias) =>{
		handleProgramMsg(medias);
	}
	const handleProgramMsg = async (medias) => {
		
		
		
		let sendAt = moment(startDate).format('YYYY-MM-DD HH:mm:ss'); 
		let msgData;
		
		if(medias.length> 0){
		    msgData = new FormData();
			msgData.append("id", 0);
			msgData.append("phoneNumber", ticket.contact.number);
			msgData.append("message", messageProgram);
			msgData.append("wpid", ticket.whatsappId);
			msgData.append("sendby", user.id);
			msgData.append("status", "pending");
			msgData.append("idchat", ticket.id);
			msgData.append("sendAt", sendAt);
		
			medias.forEach(media => {
				msgData.append("medias", media);
			});
		}else{
			msgData = {
				id: 0,
				phoneNumber: ticket.contact.number,
				message: messageProgram,
				wpid: ticket.whatsappId,
				sendby: user.id,
				status: "pending",
				idchat: ticket.id,
				sendAt: sendAt
			};
		}
		//console.log(sendAt);
		setLoading(true);
		try {
			console.log(msgData);
			console.log(messageProgram);
			await api.patch('/programatedMsg', msgData);
			setLoading(false);
			toast.success(i18n.t("Se programó correctamente el mensaje"));
		} catch (err) {
			setLoading(false);
			toastError(err);
		}
		handleClose();
	};

	return (
		<Dialog open={modalOpen} onClose={handleClose} maxWidth="lg" scroll="paper">
		
				<DialogTitle id="form-dialog-title">
					{i18n.t("Programar mensaje")}
				</DialogTitle>
				<DialogContent dividers>
					<div style={{ width: 500 }}>
						<DatePicker 
							showTimeSelect
							timeFormat="HH:mm"
							timeIntervals={1}
							minDate={new Date()}
							selected={startDate} 
							onChange={(date) => setStartDate(date)}  
							customInput={<TextField
								style={{ width: 500 }}
								label={i18n.t("Fecha")}
							
								variant="outlined"
								fullWidth
							/>} 
							/>
							
					</div>
					<TextField
					
						label={i18n.t("Mensaje")}
						variant="outlined"
						required
						multiline
						rows={5}
						fullWidth
						onChange={(e) => setMessageProgram(e.target.value)}  
						
					/>
					
					
				</DialogContent>
				<MessageInputMassive 
					sendMessage={sendMessage}
					messageBtn={"Programar"}
				/>
				<DialogActions>
					<Button
						onClick={handleClose}
						color="secondary"
						disabled={loading}
						variant="outlined"
					>
						{i18n.t("transferTicketModal.buttons.cancel")}
					</Button>
					
				</DialogActions>
			
		</Dialog>
	);
};

export default ProgramMsgModal;
