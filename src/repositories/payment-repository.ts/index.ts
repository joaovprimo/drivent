import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findPayment(ticket: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId: ticket
    }
  });
}

const paymentsRepository = {
  findPayment
};

export default paymentsRepository;
