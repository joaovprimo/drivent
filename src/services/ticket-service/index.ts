import { ticketsType, ticketType } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";
import { Prisma, Ticket, TicketType } from "@prisma/client";

async function getTicketTypesServices(): Promise<ticketsType[]> {
  const ticketsTypes = await ticketRepository.findTicketsType();
  if (!ticketsTypes) throw notFoundError();
  return ticketsTypes;
}

async function postTicketServices(ticketTypeId: number, userId: number): Promise<postingTickets> {
  const enrollmentId = await getEnrollmentByUserId(userId);
  const status = TicketStatus.RESERVED;

  const data = {
    ticketTypeId,
    enrollmentId,
    status
  };

  const postingTickets = await ticketRepository.insertTicket(data);
  return postingTickets;
}

async function getEnrollmentByUserId(userId: number): Promise<number> {
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentWithAddress) {
    throw notFoundError();
  }
  return enrollmentWithAddress.id;
}

async function getTicketServices(userId: number): Promise<postingTickets> {
  const ticket = await ticketRepository.findTicket(userId);
  if(!ticket) {
    throw notFoundError();
  }
  return ticket;
}

const ticketsService = {
  getTicketTypesServices, 
  postTicketServices,
  getTicketServices
};

export default ticketsService;

type postingTickets = Ticket & {
    TicketType: TicketType;
}
