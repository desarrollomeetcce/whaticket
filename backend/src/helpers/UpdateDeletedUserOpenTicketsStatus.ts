import Ticket from "../models/Ticket";
import UpdateTicketService from "../services/TicketServices/UpdateTicketService";

const UpdateDeletedUserOpenTicketsStatus = async (
  tickets: Ticket[]
): Promise<void> => {
  tickets.forEach(async t => {
    const ticketId = t.id.toString();

    await UpdateTicketService({
      ticketData: { status: t.status },
      ticketId
    });
  });
};

export default UpdateDeletedUserOpenTicketsStatus;
