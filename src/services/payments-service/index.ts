import { badRequestError, notFoundError, unauthorizedError }  from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import paymentsRepository from "@/repositories/payment-repository.ts";
import { Payment, Prisma } from "@prisma/client";
import { cardData } from "@/protocols";

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

async function postPayment(userId: number, ticket: number, cardData: cardData): Promise<Payment> {
  if(!cardData || !ticket) throw badRequestError();
  const price = await verifyTicketById(userId, ticket); 
  const data = {
    ticketId: ticket,
    value: price.TicketType.price,
    cardIssuer: cardData.issuer,
    cardLastDigits: String(cardData.number).slice(-4)
  } as PaymentToInsert;
  const insertPayment = await paymentsRepository.insertPayment(data);
  await ticketRepository.upDateTicket(ticket);
  return insertPayment;
  //falta o retorno de sucesso de criação
}
type PaymentToInsert = Omit <Prisma.PaymentUncheckedCreateInput, "id"|"createdAt"|"updatedAt">

type ValidateTicket = {
    Enrollment: {userId: number},
    TicketType: {price: number}
}

const paymentsService = {
  getPaymentsByTicketId,
  postPayment
};

export default paymentsService;
