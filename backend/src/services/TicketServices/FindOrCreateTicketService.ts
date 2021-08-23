import { subHours } from "date-fns";
import { Op } from "sequelize";
import Contact from "../../models/Contact";
import Ticket from "../../models/Ticket";
import ShowTicketService from "./ShowTicketService";
import Queue from "../../models/Queue";
import Whatsapp from "../../models/Whatsapp";

const FindOrCreateTicketService = async (
  contact: Contact,
  whatsappId: number,
  unreadMessages: number,
  groupContact?: Contact
): Promise<Ticket> => {

  let what =  await Whatsapp.findOne({
    where: {

      id:whatsappId
    },
    include: [
      {
        model: Queue,
        as: "queues",
        attributes: ["id", "name", "color", "greetingMessage"]
      }
    ]
  });
  let ticket = await Ticket.findOne({
    where: {

      contactId: groupContact ? groupContact.id : contact.id
    }
  });
 
  if (ticket) {
    if(what){
      ticket.queueId = what.queues[0].id;
    }
    
    await ticket.update({ unreadMessages });
  }

  if (!ticket && groupContact) {
    ticket = await Ticket.findOne({
      where: {
        contactId: groupContact.id
      },
      order: [["updatedAt", "DESC"]]
    });

    if (ticket) {
      if(what){
        ticket.queueId = what.queues[0].id;
      }
      await ticket.update({
        status: "pending",
        userId: null,
        unreadMessages
      });
    }
  }

  if (!ticket && !groupContact) {
    ticket = await Ticket.findOne({
      where: {
        updatedAt: {
          [Op.between]: [+subHours(new Date(), 2), +new Date()]
        },
        contactId: contact.id
      },
      order: [["updatedAt", "DESC"]]
    });

    if (ticket) {
      if(what){
        ticket.queueId = what.queues[0].id;
      }

      await ticket.update({
        status: "pending",
        userId: null,
        unreadMessages
      });
    }
  }

  if (!ticket) {
    let queueIdtemp = whatsappId*-1;
    if(what){
      queueIdtemp = what.queues[0].id;
    }
  
    ticket = await Ticket.create({
      contactId: groupContact ? groupContact.id : contact.id,
      status: "pending",
      isGroup: !!groupContact,
      queueId: queueIdtemp,
      unreadMessages,
      whatsappId,
      
    });
  }

  ticket = await ShowTicketService(ticket.id);

  return ticket;
};

export default FindOrCreateTicketService;
