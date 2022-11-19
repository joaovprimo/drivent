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

const ticketRepository = {
  findTicketsType,
  insertTicket
};

export default ticketRepository;
