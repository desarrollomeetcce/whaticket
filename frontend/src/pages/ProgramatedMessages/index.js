import React, { useState, useEffect, useReducer, useContext } from "react";
import openSocket from "socket.io-client";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import WhatsAppIcon from "@material-ui/icons/WhatsApp";
import SearchIcon from "@material-ui/icons/Search";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";

import IconButton from "@material-ui/core/IconButton";
import DeleteOutlineIcon from "@material-ui/icons/DeleteOutline";
import EditIcon from "@material-ui/icons/Edit";

import api from "../../services/api";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import ContactModal from "../../components/ContactModal";
import ConfirmationModal from "../../components/ConfirmationModal/";

import { i18n } from "../../translate/i18n";
import MainHeader from "../../components/MainHeader";
import Title from "../../components/Title";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import MainContainer from "../../components/MainContainer";
import toastError from "../../errors/toastError";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../../components/Can";
import moment from 'moment';


const reducer = (state, action) => {
	if (action.type === "LOAD_MESSAGES") {
		const messages = action.payload;
		const newMsg = [];

		messages.forEach(msg => {
			const msgIndex = state.findIndex(m => m.id === msg.id);
			if (msgIndex !== -1) {
				state[msgIndex] = msg;
			} else {
				newMsg.push(msg);
			}
		});

		return [...state, ...newMsg];
	}

	if (action.type === "UPDATE_QUEUES") {
		const message = action.payload;
		const msgIndex = state.findIndex(u => u.id === message.id);

		if (msgIndex !== -1) {
			state[msgIndex] = message;
			return [...state];
		} else {
			return [message, ...state];
		}
	}

	if (action.type === "DELETE_QUEUE") {
		const mesgId = action.payload;
		const msgIndex = state.findIndex(q => q.id === mesgId);
		if (msgIndex !== -1) {
			state.splice(msgIndex, 1);
		}
		return [...state];
	}

	if (action.type === "RESET") {
		return [];
	}
};

const useStyles = makeStyles(theme => ({
	mainPaper: {
		flex: 1,
		padding: theme.spacing(1),
		overflowY: "scroll",
		...theme.scrollbarStyles,
	},
}));

const Contacts = () => {
	const classes = useStyles();
	const history = useHistory();

	const { user } = useContext(AuthContext);

	const [loading, setLoading] = useState(false);
	const [pageNumber, setPageNumber] = useState(1);
	const [searchParam, setSearchParam] = useState("");
	const [contacts, dispatch] = useReducer(reducer, []);
	const [selectedContactId, setSelectedContactId] = useState(null);
	const [contactModalOpen, setContactModalOpen] = useState(false);
	const [deletingContact, setDeletingContact] = useState(null);
	const [confirmOpen, setConfirmOpen] = useState(false);
	const [hasMore, setHasMore] = useState(false);

	useEffect(() => {
		dispatch({ type: "RESET" });
		setPageNumber(1);
	}, [searchParam]);

	useEffect(() => {
		setLoading(true);
		const delayDebounceFn = setTimeout(() => {
			const fetchContacts = async () => {
				try {
					const { data } = await api.get("/programatedMsg/", {
						params: { searchParam, pageNumber },
					});
					//console.log(data);
					dispatch({ type: "LOAD_MESSAGES", payload: data });
					setHasMore(data.hasMore);
					setLoading(false);
				} catch (err) {
					toastError(err);
				}
			};
			fetchContacts();
		}, 500);
		return () => clearTimeout(delayDebounceFn);
	}, [searchParam, pageNumber]);

	useEffect(() => {
		const socket = openSocket(process.env.REACT_APP_BACKEND_URL);

		socket.on("message", data => {
			if (data.action === "update" || data.action === "create") {
				dispatch({ type: "UPDATE_MESSAGES", payload: data });
			}

			if (data.action === "delete") {
				dispatch({ type: "DELETE_MESSAGES", payload: +data.contactId });
			}
		});

		return () => {
			socket.disconnect();
		};
	}, []);

	const handleSearch = event => {
		setSearchParam(event.target.value.toLowerCase());
	};

	const handleCloseContactModal = () => {
		setSelectedContactId(null);
		setContactModalOpen(false);
	};


	const handleDeleteMsg = async msgId => {
		try {
			await api.delete(`/programatedMsg/${msgId}`);
			toast.success(i18n.t("Mensaje eliminado"));
		} catch (err) {
			toastError(err);
		}
		setDeletingContact(null);
		setSearchParam(" ");
		setPageNumber(1);
	};

	

	const loadMore = () => {
		setPageNumber(prevState => prevState + 1);
	};

	const handleScroll = e => {
		if (!hasMore || loading) return;
		const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
		if (scrollHeight - (scrollTop + 100) < clientHeight) {
			loadMore();
		}
	};

	return (
		<MainContainer className={classes.mainContainer}>
			<ContactModal
				open={contactModalOpen}
				onClose={handleCloseContactModal}
				aria-labelledby="form-dialog-title"
				contactId={selectedContactId}
			></ContactModal>
		
			<MainHeader>
				<Title>{i18n.t("msgPage.title")}</Title>
				<MainHeaderButtonsWrapper>
					<TextField
						placeholder={i18n.t("msgPage.searchPlaceholder")}
						type="search"
						value={searchParam}
						onChange={handleSearch}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<SearchIcon style={{ color: "gray" }} />
								</InputAdornment>
							),
						}}
					/>
				
				</MainHeaderButtonsWrapper>
			</MainHeader>
			<Paper
				className={classes.mainPaper}
				variant="outlined"
				onScroll={handleScroll}
			>
				<Table size="small">
					<TableHead>
						<TableRow>
							
						
							<TableCell align="center">
								{i18n.t("msgPage.table.whatsapp")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("msgPage.table.msg")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("msgPage.table.status")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("msgPage.table.date")}
							</TableCell>
							<TableCell align="center">
								{i18n.t("msgPage.table.actions")}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<>
							{contacts.map(contact => (
								<TableRow key={contact.id}>
								
									<TableCell align="center">{contact.phoneNumber}</TableCell>
									<TableCell align="center">{contact.message}</TableCell>
									<TableCell align="center">{contact.status}</TableCell>
									<TableCell align="center">{moment(contact.sendAt).format('YYYY-MM-DD h:mm a')}</TableCell>
									<TableCell align="center">
										{/*<IconButton
											size="small"
											onClick={() => handleSaveTicket(contact.id)}
										>
											<WhatsAppIcon />
										</IconButton>
										<IconButton
											size="small"
											onClick={() => hadleEditContact(contact.id)}
										>
											<EditIcon />
										</IconButton>*/}
										
										<IconButton
											size="small"
											onClick={() => handleDeleteMsg(contact.id)}
										>
											<DeleteOutlineIcon />
										</IconButton>
										
									
									</TableCell>
								</TableRow>
							))}
							{loading && <TableRowSkeleton avatar columns={3} />}
						</>
					</TableBody>
				</Table>
			</Paper>
		</MainContainer>
	);
};

export default Contacts;
