import Ticket from "../../models/Ticket";
import AppError from "../../errors/AppError";
import Contact from "../../models/Contact";
import User from "../../models/User";
import Queue from "../../models/Queue";

const ShowTicketServiceByChat = async (idChat: string | number): Promise<Ticket> => {
  let options = {
    where:{
      idChat: idChat
    }
  };
  const ticket = await Ticket.findOne(options);

  if (!ticket) {
    throw new AppError("ERR_NO_TICKET_FOUND", 404);
  }

  return ticket;
};

export default ShowTicketServiceByChat;
