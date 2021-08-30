import React, { useContext, useEffect, useRef, useState } from "react";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import SearchIcon from "@material-ui/icons/Search";
import InputBase from "@material-ui/core/InputBase";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import MoveToInboxIcon from "@material-ui/icons/MoveToInbox";
import CheckBoxIcon from "@material-ui/icons/CheckBox";

import FormControlLabel from "@material-ui/core/FormControlLabel";
import Switch from "@material-ui/core/Switch";
import { useHistory } from "react-router-dom";

import NewTicketModal from "../NewTicketModal";
import TicketsList from "../TicketsList";
import TabPanel from "../TabPanel";

import { i18n } from "../../translate/i18n";
import { AuthContext } from "../../context/Auth/AuthContext";
import { Can } from "../Can";
import TicketsQueueSelect from "../TicketsQueueSelect";
import TicketsTagSelect from "../TicketsTagSelect";
import { Button } from "@material-ui/core";
import api from "../../services/api";
import ConfirmationModal from "../ConfirmationModal";
import toastError from "../../errors/toastError";

const useStyles = makeStyles(theme => ({
	ticketsWrapper: {
		position: "relative",
		display: "flex",
		height: "100%",
		flexDirection: "column",
		overflow: "hidden",
		borderTopRightRadius: 0,
		borderBottomRightRadius: 0,
	},

	tabsHeader: {
		flex: "none",
		backgroundColor: "#eee",
	},

	settingsIcon: {
		alignSelf: "center",
		marginLeft: "auto",
		padding: 8,
	},

	tab: {
		minWidth: 90,
		width: 90,
	},

	ticketOptionsBox: {
		display: "flex",
		justifyContent: "space-between",
		alignItems: "center",
		background: "#fafafa",
		padding: theme.spacing(1),
	},

	serachInputWrapper: {
		flex: 1,
		background: "#fff",
		display: "flex",
		borderRadius: 40,
		padding: 4,
		marginRight: theme.spacing(1),
	},

	searchIcon: {
		color: "grey",
		marginLeft: 6,
		marginRight: 6,
		alignSelf: "center",
	},

	searchInput: {
		flex: 1,
		border: "none",
		borderRadius: 30,
	},
}));

const TicketsManager = () => {
	const classes = useStyles();
	const history = useHistory();
	const [searchParam, setSearchParam] = useState("");
	const [tab, setTab] = useState("open");
	const [newTicketModalOpen, setNewTicketModalOpen] = useState(false);
	const [confirmationOpen, setConfirmationOpen] = useState(false);
	const [confirmationDelete, setConfirmationDelete] = useState(false);
	const [updateTickets, setUpdateTickets] = useState(false);
	const [showAllTickets, setShowAllTickets] = useState(false);
	const searchInputRef = useRef();
	const { user } = useContext(AuthContext);

	const userQueueIds = user.queues.map(q => q.id);

	const [ userTagIds,setUserTagIds ] =useState(null);
	const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

	const [selectedTagIds, setSelectedTagIds] = useState(null);
	const [ticketsSelected, setTicketsSelected] = useState([]);


	useEffect(() => {
		if (tab === "search") {
			searchInputRef.current.focus();
		}
	}, [tab]);

	

	useEffect(() => {
		(async () => {
			
			try {
				const {data} = await api.get("/tag");
				//console.log(data);
				setUserTagIds(data);
				setSelectedTagIds(data[0].name)
				
				
			} catch (err) {
		
				//console.log(err);
			}
		})();
	}, []);

	let searchTimeout;

	const handleSearch = e => {
		const searchedTerm = e.target.value.toLowerCase();

		clearTimeout(searchTimeout);

		if (searchedTerm === "") {
			setSearchParam(searchedTerm);
			setTab("open");
			return;
		}

		searchTimeout = setTimeout(() => {
			setSearchParam(searchedTerm);
		}, 500);
	};

	const handleChangeTab = (e, newValue) => {
		setTicketsSelected([]);
		setUpdateTickets(false);
		setTab(newValue);
	};

	const handleUpdateTicketStatus =  () => {
		////console.log(selectedTagIds);
		////console.log(ticketsSelected);
		ticketsSelected.forEach( function(ticket, indice) {
			try {
				 api.put(`/tickets/${ticket.id}`, {
					status: selectedTagIds,
					userId: user?.id,
				});
	
		
				history.push(`/tickets/${ticket.id}`);
				
			} catch (err) {
				
				toastError(err);
			}
		});
		
		
	};

	const handleDeleteTicket =  () => {
		ticketsSelected.forEach( function(ticket, indice) {
			try {
				api.delete(`/tickets/${ticket.id}`);
			} catch (err) {
				toastError(err);
			}
		});
	};

	return (
		<Paper elevation={0} variant="outlined" className={classes.ticketsWrapper}>
			<NewTicketModal
				modalOpen={newTicketModalOpen}
				onClose={e => setNewTicketModalOpen(false)}
			/>
			<ConfirmationModal
				title={"Cambio de estatus masivo"}
				open={confirmationOpen}
				onClose={() => {setConfirmationOpen(false);}}
				onConfirm={() => {handleUpdateTicketStatus()}}
			>
				{"¿Desea cambiar el estatus de los tickets seleccionados a "+selectedTagIds+"?"}
			</ConfirmationModal>
			<ConfirmationModal
				title={"Borrado masivo"}
				open={confirmationDelete}
				onClose={() => {setConfirmationDelete(false);}}
				onConfirm={() => {handleDeleteTicket()}}
			>
				{"¿Desea eliminar los tickets seleccionados permanentemente ?"}
			</ConfirmationModal>
			<Paper elevation={0} square className={classes.tabsHeader}>
				<Tabs
					value={tab}
					onChange={handleChangeTab}
					variant="fullWidth"
					indicatorColor="primary"
					textColor="primary"
					aria-label="icon label tabs example"
				>
					<Tab
						value={"pending"}
						icon={<MoveToInboxIcon />}
						label={i18n.t("tickets.tabs.pending.title")}
						classes={{ root: classes.tab }}
					/>
					<Tab
						value={"open"}
						icon={<MoveToInboxIcon />}
						label={i18n.t("tickets.tabs.open.title")}
						classes={{ root: classes.tab }}
					/>
					<Tab
						value={"closed"}
						icon={<CheckBoxIcon />}
						label={i18n.t("tickets.tabs.closed.title")}
						classes={{ root: classes.tab }}
					/>
					<Tab
						value={"search"}
						icon={<SearchIcon />}
						label={i18n.t("tickets.tabs.search.title")}
						classes={{ root: classes.tab }}
					/>
				</Tabs>
			</Paper>
			<Paper square elevation={0} className={classes.ticketOptionsBox}>
				{tab === "search" ? (
					<div className={classes.serachInputWrapper}>
						<SearchIcon className={classes.searchIcon} />
						<InputBase
							className={classes.searchInput}
							inputRef={searchInputRef}
							placeholder={i18n.t("tickets.search.placeholder")}
							type="search"
							onChange={handleSearch}
						/>
					</div>
				) : (
					<>
						{/*<Button
							variant="outlined"
							color="primary"
							onClick={() => setNewTicketModalOpen(true)}
						>
							{i18n.t("ticketsManager.buttons.newTicket")}
						</Button>*/}
						<Button
							variant="outlined"
							color="primary"
							onClick={() =>{ 
								setTicketsSelected([]);
								setUpdateTickets(!updateTickets);
								
							}}
						>
							{updateTickets ? "Cancelar" : "Acción"

							}
							
						</Button>

						{updateTickets ? <Button
							variant="outlined"
							color="primary"
							onClick={() =>{ 
								if(ticketsSelected.length == 0){
									alert("Debes seleccionar al menos un ticket");
									return;
								}
								setConfirmationDelete(!confirmationDelete);
								
							}}
						>
							{"Borrar"}
							
						</Button>: ""}
						{/*<Can
							role={user.profile}
							perform="tickets-manager:showall"
							yes={() => (
								<FormControlLabel
									label={i18n.t("tickets.buttons.showAll")}
									labelPlacement="start"
									control={
										<Switch
											size="small"
											checked={showAllTickets}
											onChange={() =>
												setShowAllTickets(prevState => !prevState)
											}
											name="showAllTickets"
											color="primary"
										/>
									}
								/>
							)}
								/>*/}
					</>
				)}
				{!updateTickets ?
						<TicketsQueueSelect
						style={{ marginLeft: 6 }}
						selectedQueueIds={selectedQueueIds}
						userQueues={user?.queues}
						onChange={values => setSelectedQueueIds(values)}
					/> 
					:""}
				{!updateTickets ?
					<TicketsTagSelect
					style={{ marginLeft: 6 }}
					selectedQueueIds={selectedTagIds}
					userTags={userTagIds}
					onChange={values => setSelectedTagIds(values)}
					placeholder ={selectedTagIds}
				/>
			:""}
			{updateTickets ?
					<TicketsTagSelect
					style={{ marginLeft: 6 }}
					selectedQueueIds={selectedTagIds}
					userTags={userTagIds}
					onChange={values => {
						if(ticketsSelected.length == 0){
							alert("Debes seleccionar al menos un ticket");
							return;
						}
						setSelectedTagIds(values);
						setConfirmationOpen(true);
					}}
					placeholder ={selectedTagIds}
				/>
			:""}
			
				
				
			</Paper>
			<TabPanel value={tab} name="open" className={classes.ticketsWrapper}>
				<TicketsList
					status={selectedTagIds}
					showAll={showAllTickets}
					selectedQueueIds={selectedQueueIds}
					ticketsSelected = {ticketsSelected}
					updateTickets = {updateTickets}
					ticketTags={userTagIds}
				/>
			
			</TabPanel>
			<TabPanel value={tab} name="pending" className={classes.ticketsWrapper}>

				<TicketsList status="pending" selectedQueueIds={selectedQueueIds} ticketsSelected = {ticketsSelected}
					updateTickets = {updateTickets} ticketTags={userTagIds}/>
			
			</TabPanel>
			<TabPanel value={tab} name="closed" className={classes.ticketsWrapper}>
				<TicketsList
					status="closed"
					showAll={true}
					selectedQueueIds={selectedQueueIds}
					ticketTags={userTagIds}
				/>
			</TabPanel>
			<TabPanel value={tab} name="search" className={classes.ticketsWrapper}>
				<TicketsList
					searchParam={searchParam}
					showAll={true}
					selectedQueueIds={selectedQueueIds}
					ticketTags={userTagIds}
				/>
			</TabPanel>
		</Paper>
	);
};

export default TicketsManager;
