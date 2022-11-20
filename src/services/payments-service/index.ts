import { badRequestError, notFoundError, unauthorizedError }  from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import paymentsRepository from "@/repositories/payment-repository.ts";
import { Ticket, Payment } from "@prisma/client";

async function getPaymentsByTicketId(userId: number, ticket: number): Promise<Payment> {
  if(!ticket) throw badRequestError();
  await verifyTicketById(userId, ticket); 
  const findPaymentByTicketId = await paymentsRepository.findPayment(ticket);
  return findPaymentByTicketId;
}

async function verifyTicketById(userId: number, ticketId: number): Promise<ValidateTicket> {
  const ticket = await ticketRepository.findTicketById(ticketId);
  if (!ticket) throw notFoundError();
  if(ticket.Enrollment.userId !== userId) throw unauthorizedError();
  return ticket;
}

type ValidateTicket = {
    Enrollment: {userId: number}
}

const paymentsService = {
  getPaymentsByTicketId
};

export default paymentsService;
