import { ticketsType } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";

async function getTicketTypesServices(): Promise<ticketsType[]> {
  const ticketsTypes = await ticketRepository.findTicketsType();
  console.log(ticketsTypes);
  if (!ticketsTypes) throw notFoundError();
  return ticketsTypes;
}

const ticketsService = {
  getTicketTypesServices
};

export default ticketsService;
