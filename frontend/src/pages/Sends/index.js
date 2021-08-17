import React, { useEffect, useState,useMemo,useContext } from "react";
import { WhatsAppsContext } from "../../context/WhatsApp/WhatsAppsContext";


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
    
} from "@material-ui/core";


import MainContainer from "../../components/MainContainer";
import MainHeader from "../../components/MainHeader";
import MainHeaderButtonsWrapper from "../../components/MainHeaderButtonsWrapper";
import Title from "../../components/Title";
import { i18n } from "../../translate/i18n";
import toastError from "../../errors/toastError";

import { CheckCircle,DeleteOutline, Edit, LocalConvenienceStoreOutlined, ShoppingCartOutlined } from "@material-ui/icons";

import Dropzone from 'react-dropzone';
import {useDropzone} from 'react-dropzone';

import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import TicketsQueueSelect from "../../components/TicketsQueueSelect";

import api from "../../services/api";
import { AuthContext } from "../../context/Auth/AuthContext";
import { toast } from "react-toastify";
import { green } from "@material-ui/core/colors";
const baseStyle = {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    borderWidth: 2,
    borderRadius: 2,
    borderColor: '#eeeeee',
    borderStyle: 'dashed',
    backgroundColor: '#fafafa',
    color: '#bdbdbd',
    outline: 'none',
    transition: 'border .24s ease-in-out'
  };
  
  const activeStyle = {
    borderColor: '#2196f3'
  };
  
  const acceptStyle = {
    borderColor: '#00e676'
  };
  
  const rejectStyle = {
    borderColor: '#ff1744'
  };
  
  
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

const Sends = () => {
    const {
        getRootProps,
        getInputProps,
        isDragActive,
        isDragAccept,
        isDragReject
      } = useDropzone({accept: 'image/*'});
     
  
      const style = useMemo(() => ({
        ...baseStyle,
        ...(isDragActive ? activeStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
      }), [
        isDragActive,
        isDragReject,
        isDragAccept
      ]);

	const classes = useStyles();


    const [csvFile, setCsvFile] =  useState([]);
    const [clients, setClients] =  useState([]);
    const [msgSend, setMsgSend] =  useState([]);
    const [marcacion, Setmarcacion] =  useState("521");
    const [sepachsCount, setSepachsCount] =  useState(1);
    const [randomCount, setRandomCount] =  useState(1);
    const [sepachs, setSepachs] =  useState({});
    const [message, setmessage] =  useState("");

    const { user } = useContext(AuthContext);
    const { whatsApps, loading } = useContext(WhatsAppsContext);
    const userQueueIds = whatsApps.map(q => q.id);

    
	const [selectedQueueIds, setSelectedQueueIds] = useState(userQueueIds || []);

	useEffect(() => {
		setSepachsCount(1);
	}, []);

    const revisaArchivo=(files,rejectedFiles) => {
        
        if(files[0].e){

        }
        if(rejectedFiles.length > 0){
            alert("El archivo es demasiado pesado");
        }else{
            var reader = new FileReader();
            let cl = [];
            try{
                reader.onload = function(e) {
                
                    cl = reader.result.split("\n");
                   
                    for(let j =0;j<cl.length;j++){
                        let a = cl[j].replace(/\r?\n|\r/g, "");
                        cl[j] = a.split(";");
                        
                    }
        
                    setClients(cl);
                }
        
                reader.readAsText(files[0]);
               
                setCsvFile(files);
            }catch(err){
                toastError("El archivo csv no tiene el formato correcto\n"+err);
            }
           
         
           
            
          
        }

    }
    const reloadFIle=() => {
       
            var reader = new FileReader();
            let cl = [];
         
            reader.onload = function(e) {
                cl = reader.result.split("\n");
                for(let j =0;j<=cl[0].length;j++){
                    cl[j] = cl[j].split("|");
                }
   
                setClients(cl);
            }
        
            reader.readAsText(csvFile);
       
    }


    const deleteNumber = (index) =>{
      
       clients.splice(index, 1);
      
       setClients(clients);
       setRandomCount(randomCount+1);     
    }
    const handleMarcacion = (e) => {
		Setmarcacion(e.target.value);
	};
    const handleSpeach = (e,index,speach_key) => {
        let sp = sepachs;
        sp[speach_key][index] = e.target.value;
        setSepachs(sp);
        setRandomCount(randomCount+1);   
	};
    const addSpeach = () => {
        
        sepachs["SPEACH"+sepachsCount]=[];
        setSepachs(sepachs);
        setSepachsCount(sepachsCount+1);
       
	};
    const addSubSpeach = (key) => {
        sepachs[key].push("speach");
        setSepachs(sepachs);
        setRandomCount(randomCount+1);     
	};
	
    const sendMessage = () => {
         //Validar que haya archivo
         let err={};
         err["message"] = {};
         err["message"]["data"] = "Ocurrio un error";

         if(selectedQueueIds.length == 0){
            err["message"]["data"] = "Debe seleccionar un número";
            toastError(err);
            return false;
         }
        if(csvFile.length==0){
            err["message"]["data"] = "Debe adjuntar csv";
            toastError(err);
            return false;
        }
        //Validar mensaje
        if(message==""){
            err["message"]["data"] = "El mensaje no puede estar vacio";
            toastError(err);
            return false;
        }

        let finalData = {};
        finalData.clients = clients;
        finalData.message = message;
        finalData.speachs = sepachs;
        finalData.marcacion = marcacion;
        finalData.queue = selectedQueueIds;
        
        

    
        try {
            toast.success(i18n.t("Enviando mensajes"));
            let speachcount = 0;
            for(let i = 0; i< finalData.clients.length; i++){

                let msgtemp = message;
                for (let [key, value] of Object.entries(sepachs)) {
                  
                    if(value[speachcount]!=""){
                        msgtemp = msgtemp.replace("$"+key,value[speachcount]);
                    }
                   
                }
                if(typeof(sepachs["SPEACH1"])!=='undefined'){
                    if(speachcount==sepachs["SPEACH1"].length-1){
                        speachcount=0;
                    }else{
                        speachcount++;
                    }
                }
                
               
                let values = {
                
                    wpId:selectedQueueIds[0],
                    num:finalData.marcacion+clients[i][1],
                    msg: msgtemp
                }
                //console.log(values);
                try{
                    const { data } =  api.post("/messagesend", values);
                    console.log(data);
                    msgSend.push(i);
                    let msgSendTemp = msgSend;
                    setMsgSend(msgSendTemp);
                    setRandomCount(randomCount+1);    
                } catch (err) {
                   console.log(err);
                }
               
            }
           
            toast.success(i18n.t("Termina envio de mensajes"));
        } catch (err) {
            toastError(err);
        }
        
    }

	return (
		<MainContainer>
			
			<MainHeader>
				<Title>{i18n.t("Envio masivo")}</Title>
				
                <MainHeaderButtonsWrapper>
					Marcación<input
						onChange={handleMarcacion}
                        value={marcacion}
					/>
						
					
				</MainHeaderButtonsWrapper>
			</MainHeader>
          
            <Paper className={classes.mainPaper} variant="outlined">
               <h2>Mensaje</h2>
               <TicketsQueueSelect
					style={{ marginLeft: 6 }}
					selectedQueueIds={selectedQueueIds}
					userQueues={whatsApps}
					onChange={values => setSelectedQueueIds(values)}
				/>
                <div className="input-group col-lg-12 mb-4">
                    <TextField
                    // value={""}
                        onChange={(e) => setmessage(e.target.value)}
                        className={classes.input}
                        variant="outlined"
                        multiline
                        fullWidth
                    />
                </div>
                <br></br>
                <div style={{textAlign: 'center'}}>
                        <Button
                            variant="contained"
                            color="inherit"
                            onClick={sendMessage}
                        >
                            {"Enviar"}
                        </Button>
                </div>
                       
               
			</Paper>
            <Paper className={classes.mainPaper} variant="outlined">
                <MainHeader>
                    <h2>Speach</h2>
                    
                    <MainHeaderButtonsWrapper>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={addSpeach}
                        >
                            {"Agregar"}
                        </Button>
                        
                    </MainHeaderButtonsWrapper>
                </MainHeader>
               
               
                {Object.keys(sepachs).map((keyName, speach_array) => (
                    <Grid>
                        
                        <Paper>
                        <MainHeader>
                            <h3>{keyName}</h3>
                                
                                <MainHeaderButtonsWrapper>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={() =>addSubSpeach(keyName)}
                                    >
                                        {"Agregar"}
                                    </Button>
                                    
                                </MainHeaderButtonsWrapper>
                            </MainHeader>
                            {
                                sepachs[keyName].map((speach_temp, i) => (
                                    <input
                                    value = {speach_temp}
                                        onChange={(e) => {
                                            handleSpeach(e, i,keyName);
                                        }}
                                
                                    />		
                                )

                                )
                            }
                        </Paper>
                    </Grid>
                ))}
                
            </Paper>
            <Paper className={classes.mainPaper} variant="outlined">
            <h2>Archivo</h2>
                <Dropzone 
                    onDrop={revisaArchivo}
                    accept=".csv"
                >
                {({getRootProps, getInputProps}) => (
                <div className="container">
                <div {...getRootProps({style})}>
                    <input {...getInputProps()} />
                    <p>{csvFile.length!=0 ?csvFile[0].name:"Agrega CSV"}</p>
                </div>
                </div>
                )}
                </Dropzone> 

                <Table size="small">
					<TableHead>
						<TableRow>
							<TableCell align="center">
								{"Contacto"}
							</TableCell>
                            <TableCell align="center">
								{"Marcación"}
							</TableCell>
							<TableCell align="center">
								{"Teléfono"}
							</TableCell>
                            <TableCell align="center">
								{"Estatus"}
							</TableCell>
                           
							<TableCell align="center">
								{"Acciones"}
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						<>
							{clients.map((queue, i) => (
								<TableRow key={queue[0]}>
									<TableCell align="center">{queue[0]}</TableCell>
                                    <TableCell align="center">{marcacion}</TableCell>
									<TableCell align="center">{queue[1]}</TableCell>
                                    <TableCell align="center">
                                        {msgSend.indexOf(i) != -1 ?
                                            
                                                <CheckCircle style={{ color: green[500] }} />
                                            
                                        : "Pendiente"}
                                    </TableCell>
									<TableCell align="center">
										{/*<IconButton
											size="small"
											onClick={() => handleEditQueue(queue)}
										>
											<Edit />
                                        </IconButton>*/}

										<IconButton
											size="small"
											onClick={() => {
												deleteNumber(i);
											}}
										>
											<DeleteOutline />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							
						</>
					</TableBody>
				</Table>
			</Paper>
		
            
		</MainContainer>
	);
};

export default Sends;
