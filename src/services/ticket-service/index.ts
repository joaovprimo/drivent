import { ticketsType, ticketType } from "@/protocols";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import enrollmentRepository from "@/repositories/enrollment-repository";
import { TicketStatus } from "@prisma/client";

async function getTicketTypesServices(): Promise<ticketsType[]> {
  const ticketsTypes = await ticketRepository.findTicketsType();
  if (!ticketsTypes) throw notFoundError();
  return ticketsTypes;
}

async function postTicketServices(ticketTypeId: number, userId: number) {
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

export async function getEnrollmentByUserId(userId: number): Promise<number> {
  console.log(userId);
  const enrollmentWithAddress = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollmentWithAddress) {
    throw notFoundError();
  }
  return enrollmentWithAddress.id;
}

const ticketsService = {
  getTicketTypesServices, 
  postTicketServices
};

export default ticketsService;
