import React, { useEffect, useReducer, useState } from "react";



import {
	Button,
	IconButton,
	makeStyles,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Typography,
} from "@material-ui/core";

import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import TableRowSkeleton from "../../components/TableRowSkeleton";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";
import api from "../../services/api";
import { DeleteOutline, Edit } from "@material-ui/icons";
import CsvModal from "../../components/CsvModal";
import { toast } from "react-toastify";
import ConfirmationModal from "../../components/ConfirmationModal";

const useStyles = makeStyles(theme => ({
	mainPaper: {
		flex: 1,
		padding: theme.spacing(1),
		overflowY: "scroll",
		...theme.scrollbarStyles,
	},
	customTableCell: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
	},
}));

const reducer = (state, action) => {
	if (action.type === "LOAD_QUEUES") {
		const queues = action.payload;
		const newQueues = [];

		queues.forEach(queue => {
			const queueIndex = state.findIndex(q => q.id === queue.id);
			if (queueIndex !== -1) {
				state[queueIndex] = queue;
			} else {
				newQueues.push(queue);
			}
		});

		return [...state, ...newQueues];
	}

	if (action.type === "UPDATE_QUEUES") {
		const queue = action.payload;
		const queueIndex = state.findIndex(u => u.id === queue.id);

		if (queueIndex !== -1) {
			state[queueIndex] = queue;
			return [...state];
		} else {
			return [queue, ...state];
		}
	}

	if (action.type === "DELETE_QUEUE") {
		const queueId = action.payload;
		const queueIndex = state.findIndex(q => q.id === queueId);
		if (queueIndex !== -1) {
			state.splice(queueIndex, 1);
		}
		return [...state];
	}

	if (action.type === "RESET") {
		return [];
	}
};

const Sends = () => {
	const classes = useStyles();


	const [queueModalOpen, setQueueModalOpen] = useState(false);
	const [selectedQueue, setSelectedQueue] = useState(null);
    const [csvFile, setCsvFile] =  useState([]);

	useEffect(() => {
		
	}, []);

    const revisaArchivo=(files,rejectedFiles) => {
        setCsvFile(files);
        if(rejectedFiles.length > 0){
            alert("El archivo es demasiado pesado");
        }
        console.log(files);
    }

	const handleOpenQueueModal = () => {
		setQueueModalOpen(true);
		setSelectedQueue(null);
	};

	const handleCloseQueueModal = () => {
		setQueueModalOpen(false);
		setSelectedQueue(null);
	};

	

	return (
		<MainContainer>
			
			<CsvModal
				open={queueModalOpen}
				onClose={handleCloseQueueModal}
				queueId={selectedQueue?.id}
			/>
			<MainHeader>
				<Title>{i18n.t("Envio masivo")}</Title>
				<MainHeaderButtonsWrapper>
					<Button
						variant="contained"
						color="primary"
						onClick={handleOpenQueueModal}
					>
						{i18n.t("Agregar speach")}
					</Button>
				</MainHeaderButtonsWrapper>
			</MainHeader>
			<Paper className={classes.mainPaper} variant="outlined">
				<Dropzone id="documents" onDrop={revisaArchivo} maxSize={250000} multiple={false}>
                    {({getRootProps, getInputProps}) => (
                    <div {...getRootProps()}  className="dropzone">
                        <input onChange={this.handleChange} {...getInputProps()} />
                        
                        <div> {this.state.archivos
                            ? <ul> {this.state.archivos.map((archivo, i) => (
                                <li key={i} value={archivo.name} id={archivo.name}>{archivo.name}</li>
                            ))}</ul>
                            : <p>Agrega CSV</p>}</div>
                    </div>
                    
                    )}
                </Dropzone>
			</Paper>
		</MainContainer>
	);
};

export default Sends;
