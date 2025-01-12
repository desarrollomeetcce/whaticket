import React, { useState, useEffect, useContext, useRef } from "react";
import "emoji-mart/css/emoji-mart.css";
import { useParams } from "react-router-dom";
import { Picker } from "emoji-mart";
import MicRecorder from "mic-recorder-to-mp3";
import clsx from "clsx";

import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import InputBase from "@material-ui/core/InputBase";
import CircularProgress from "@material-ui/core/CircularProgress";
import { green } from "@material-ui/core/colors";
import AttachFileIcon from "@material-ui/icons/AttachFile";
import IconButton from "@material-ui/core/IconButton";
import MoodIcon from "@material-ui/icons/Mood";
import SendIcon from "@material-ui/icons/Send";
import CancelIcon from "@material-ui/icons/Cancel";
import ClearIcon from "@material-ui/icons/Clear";
import MicIcon from "@material-ui/icons/Mic";
import CheckCircleOutlineIcon from "@material-ui/icons/CheckCircleOutline";
import HighlightOffIcon from "@material-ui/icons/HighlightOff";
import { FormControlLabel, Switch } from "@material-ui/core";

import { i18n } from "../../translate/i18n";
import api from "../../services/api";
import RecordingTimer from "./RecordingTimer";

import { AuthContext } from "../../context/Auth/AuthContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import toastError from "../../errors/toastError";
import { toast } from "react-toastify";
import {
	Button,    
} from "@material-ui/core";


const Mp3Recorder = new MicRecorder({ bitRate: 128 });

const useStyles = makeStyles(theme => ({
	mainWrapper: {
		background: "#eee",
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
	},

	newMessageBox: {
		background: "#eee",
		width: "100%",
		display: "flex",
		padding: "7px",
		alignItems: "center",
	},

	messageInputWrapper: {
		padding: 6,
		marginRight: 7,
		background: "#fff",
		display: "flex",
		borderRadius: 20,
		flex: 1,
	},

	messageInput: {
		paddingLeft: 10,
		flex: 1,
		border: "none",
	},

	sendMessageIcons: {
		color: "grey",
	},

	uploadInput: {
		display: "none",
	},

	viewMediaInputWrapper: {
		display: "flex",
		padding: "10px 13px",
		position: "relative",
		justifyContent: "space-between",
		alignItems: "center",
		backgroundColor: "#eee",
		borderTop: "1px solid rgba(0, 0, 0, 0.12)",
	},

	emojiBox: {
		position: "absolute",
		bottom: 63,
		width: 40,
		borderTop: "1px solid #e8e8e8",
	},

	circleLoading: {
		color: green[500],
		opacity: "70%",
		position: "absolute",
		top: "20%",
		left: "50%",
		marginLeft: -12,
	},

	audioLoading: {
		color: green[500],
		opacity: "70%",
	},

	recorderWrapper: {
		display: "flex",
		alignItems: "center",
		alignContent: "middle",
	},

	cancelAudioIcon: {
		color: "red",
	},

	sendAudioIcon: {
		color: "green",
	},



	messageContactName: {
		display: "flex",
		color: "#6bcbef",
		fontWeight: 500,
	},
}));

const MessageInputMassive = ({sendMessage,messageBtn}) => {
	const classes = useStyles();
	

	
	const [medias, setMedias] = useState([]);
	const [inputMessage, setInputMessage] = useState("");
	const [showEmoji, setShowEmoji] = useState(false);
	const [loading, setLoading] = useState(false);
	const [recording, setRecording] = useState(false);
	const inputRef = useRef();

	const { user } = useContext(AuthContext);

	const [signMessage, setSignMessage] = useLocalStorage("signOption", true);

	useEffect(() => {
		if(!messageBtn)
		{
			messageBtn= "Enviar";
		}
		//inputRef.current.focus();
	}, [medias]);

	useEffect(() => {
	//	inputRef.current.focus();
		return () => {
			setInputMessage("");
			setShowEmoji(false);
		
			
		};
	}, [ ]);

	const handleChangeInput = e => {
		setInputMessage(e.target.value);
	};

	const handleAddEmoji = e => {
		let emoji = e.native;
		setInputMessage(prevState => prevState + emoji);
	};

	const handleChangeMedias2 = e => {
		
		if (!e.target.files) {
			return;
		}

		const selectedMedias = Array.from(e.target.files);
		console.log(selectedMedias);
		setMedias(selectedMedias);
	};

	const handleInputPaste = e => {
		if (e.clipboardData.files[0]) {
			setMedias([e.clipboardData.files[0]]);
		}
	};

	const handleUploadMedia = async e => {
		setLoading(true);
		e.preventDefault();

		const formData = new FormData();
		formData.append("fromMe", true);
		medias.forEach(media => {
			formData.append("medias", media);
			formData.append("body", media.name);
		});

		try {
			//await api.post(`/messages/${ticketId}`, formData);
		} catch (err) {
			toastError(err);
		}

		setLoading(false);
		setMedias([]);
	};

	const handleSendMessage = async () => {
		
		if (inputMessage.trim() === "") return;
		setLoading(true);

		const message = {
			read: 1,
			fromMe: true,
			mediaUrl: "",
			body: signMessage
				? `*${user?.name}:*\n${inputMessage.trim()}`
				: inputMessage.trim(),
			
		};
		try {
			//await api.post(`/messages/${ticketId}`, message);
		} catch (err) {
			toastError(err);
		}

		setInputMessage("");
		setShowEmoji(false);
		setLoading(false);
	
	};

	const handleStartRecording = async () => {
		setLoading(true);
		try {
			await navigator.mediaDevices.getUserMedia({ audio: true });
			await Mp3Recorder.start();
			setRecording(true);
			setLoading(false);
		} catch (err) {
			toastError(err);
			setLoading(false);
		}
	};

	const handleUploadAudio = async () => {
		setLoading(true);
		try {
			const [, blob] = await Mp3Recorder.stop().getMp3();
			if (blob.size < 10000) {
				setLoading(false);
				setRecording(false);
				return;
			}

			const formData = new FormData();
			const filename = `${new Date().getTime()}.mp3`;
			formData.append("medias", blob, filename);
			formData.append("body", filename);
			formData.append("fromMe", true);

			//await api.post(`/messages/${ticketId}`, formData);
		} catch (err) {
			toastError(err);
		}

		setRecording(false);
		setLoading(false);
	};

	const handleCancelAudio = async () => {
		try {
			await Mp3Recorder.stop().getMp3();
			setRecording(false);
		} catch (err) {
			toastError(err);
		}
	};
	
	const sendMediaPrim =  () =>{
		sendMessage(medias);
	}
	if (medias.length > 0)
		return (
			<>
			<Paper elevation={0} square className={classes.viewMediaInputWrapper}>
				<IconButton
					aria-label="cancel-upload"
					component="span"
					onClick={e => setMedias([])}
				>
					<CancelIcon className={classes.sendMessageIcons} />
				</IconButton>

				{loading ? (
					<div>
						<CircularProgress className={classes.circleLoading} />
					</div>
				) : (
					<span>
						{medias[0]?.name}
						{/* <img src={media.preview} alt=""></img> */}
					</span>
				)}
				<IconButton
					aria-label="send-upload"
					component="span"
					onClick={handleUploadMedia}
					disabled={loading}
				>
					<SendIcon className={classes.sendMessageIcons} />
				</IconButton>
			</Paper>
			<div style={{textAlign: 'center'}}>
				<Button
					
					color="primary"
								
					variant="contained"
					onClick={sendMediaPrim}
				>
					{messageBtn}
				</Button>
		</div>
			</>
		);
	else {
		return (
			<>
			<Paper square elevation={0} className={classes.mainWrapper}>
				
				<div className={classes.newMessageBox}>
					{/*<IconButton
						aria-label="emojiPicker"
						component="span"
						
						onClick={e => setShowEmoji(prevState => !prevState)}
					>
						<MoodIcon className={classes.sendMessageIcons} />
					</IconButton>*/}
					{showEmoji ? (
						<div className={classes.emojiBox}>
							<Picker
								perLine={16}
								showPreview={false}
								showSkinTones={false}
								onSelect={handleAddEmoji}
							/>
						</div>
					) : null}

					<input
						multiple
						type="file"
						id="upload-button2"
						
						className={classes.uploadInput}
						onChange={handleChangeMedias2}
					/>
					<label htmlFor="upload-button2">
						<IconButton
							aria-label="upload"
							component="span"
							
						>
							<AttachFileIcon className={classes.sendMessageIcons} />
						</IconButton>
					</label>
					{/*<FormControlLabel
						style={{ marginRight: 7, color: "gray" }}
						label={i18n.t("messagesInput.signMessage")}
						labelPlacement="start"
						control={
							<Switch
								size="small"
								checked={signMessage}
								onChange={e => {
									setSignMessage(e.target.checked);
								}}
								name="showAllTickets"
								color="primary"
							/>
						}
					/>*/}
					{/*<div className={classes.messageInputWrapper}>
						<InputBase
							inputRef={input => {
								input && input.focus();
								input && (inputRef.current = input);
							}}
							className={classes.messageInput}
							
							multiline
							rowsMax={5}
							value={inputMessage}
							onChange={handleChangeInput}
						
							onPaste={e => {
								handleInputPaste(e);
							}}
							onKeyPress={e => {
								if (loading || e.shiftKey) return;
								else if (e.key === "Enter") {
									handleSendMessage();
								}
							}}
						/>
						</div>*/}
					{/*inputMessage ? (
						<IconButton
							aria-label="sendMessage"
							component="span"
							onClick={handleSendMessage}
							disabled={loading}
						>
							<SendIcon className={classes.sendMessageIcons} />
						</IconButton>
					) : recording ? (
						<div className={classes.recorderWrapper}>
							<IconButton
								aria-label="cancelRecording"
								component="span"
								fontSize="large"
								disabled={loading}
								onClick={handleCancelAudio}
							>
								<HighlightOffIcon className={classes.cancelAudioIcon} />
							</IconButton>
							{loading ? (
								<div>
									<CircularProgress className={classes.audioLoading} />
								</div>
							) : (
								<RecordingTimer />
							)}

							<IconButton
								aria-label="sendRecordedAudio"
								component="span"
								onClick={handleUploadAudio}
								disabled={loading}
							>
								<CheckCircleOutlineIcon className={classes.sendAudioIcon} />
							</IconButton>
						</div>
					) : (
						<IconButton
							aria-label="showRecorder"
							component="span"
						
							onClick={handleStartRecording}
						>
							<MicIcon className={classes.sendMessageIcons} />
						</IconButton>
					)*/}
				</div>
				
			</Paper>
			
				<div style={{textAlign: 'center'}}>
				<Button
					variant="contained"
					color="inherit"
					onClick={sendMessage}
				>
					{"Enviar"}
				</Button>
		</div>
		</>
		);
	}
};

export default MessageInputMassive;
