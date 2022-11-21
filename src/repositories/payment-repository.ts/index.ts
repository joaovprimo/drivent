import { prisma } from "@/config";
import { Prisma } from "@prisma/client";

async function findPayment(ticket: number) {
  return await prisma.payment.findFirst({
    where: {
      ticketId: ticket
    }
  });
}

async function insertPayment(data: Prisma.PaymentUncheckedCreateInput) {
  return await prisma.payment.create({
    data
  });
}

const paymentsRepository = {
  findPayment,
  insertPayment
};

export default paymentsRepository;
