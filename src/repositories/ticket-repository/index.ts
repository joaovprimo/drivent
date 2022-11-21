import { prisma } from "@/config";
import { Prisma } from "@prisma/client";
import { TicketStatus } from "@prisma/client";

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
      Enrollment: { select: { userId: true } },
      TicketType: { select: { price: true } }
    }
  });
}

async function upDateTicket(ticket: number) {
  return await prisma.ticket.update({
    where: { id: ticket },
    data: { status: TicketStatus.PAID } 
  }
  );
}

const ticketRepository = {
  findTicketsType,
  insertTicket,
  findTicket,
  findTicketById,
  upDateTicket
};

export default ticketRepository;
