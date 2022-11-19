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

const ticketRepository = {
  findTicketsType,
  insertTicket,
  findTicket
};

export default ticketRepository;
