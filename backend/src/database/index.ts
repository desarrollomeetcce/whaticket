import { Sequelize } from "sequelize-typescript";
import User from "../models/User";
import Setting from "../models/Setting";
import Contact from "../models/Contact";
import Ticket from "../models/Ticket";
import Whatsapp from "../models/Whatsapp";
import ContactCustomField from "../models/ContactCustomField";
import Message from "../models/Message";
import Queue from "../models/Queue";
import Tag from "../models/Tag";
import ProgramatedMessage from "../models/ProgramatedMessage";
import WhaticketApiToken from "../models/WhaticketApiToken"
import WhaticketApiMessage from "../models/WhaticketApiMessage";
import WhatsappQueue from "../models/WhatsappQueue";
import UserQueue from "../models/UserQueue";

// eslint-disable-next-line
const dbConfig = require("../config/database");
// import dbConfig from "../config/database";

const sequelize = new Sequelize(dbConfig);

const models = [
  User,
  Contact,
  Ticket,
  Message,
  Whatsapp,
  ContactCustomField,
  Setting,
  Queue,
  Tag,
  ProgramatedMessage,
  WhaticketApiToken,
  WhaticketApiMessage,
  WhatsappQueue,
  UserQueue
];

sequelize.addModels(models);

export default sequelize;
