import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findTicketsType() {
  return prisma.ticketType.findMany();
}

async function insertTicket(data: Prisma.TicketUncheckedCreateInput) {
  return prisma.ticket.create({
    data,
    include: { TicketType: true }
  }
  );
}
async function findTicket(usuerId: number) {
  return prisma.ticket.findFirst({
    where: {
      Enrollment: { userId: usuerId }
    },
    include: { TicketType: true },

  });
}

async function findTicketById(ticket: number) {
  return await prisma.ticket.findFirst({
    where: {
      id: ticket
    },
    select: {
      Enrollment: { select: { userId: true } }
    }
  });
}

const ticketRepository = {
  findTicketsType,
  insertTicket,
  findTicket,
  findTicketById
};

export default ticketRepository;
