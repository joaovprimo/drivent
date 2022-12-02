import { notFoundError, unauthorizedError, requestError, paymentError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { Booking, Room } from "@prisma/client";

async function getBookingService(userId: number): Promise<bookingWithRoom> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) {
    throw notFoundError();
  }
  if(ticket.status !== "PAID") {
    throw paymentError();
  }
  const booking = await bookingRepository.findBooking(userId);
  if(!booking) {
    throw notFoundError();
  }
  return booking;
}

type bookingWithRoom = Booking & {
    Room: Room
};

const bookingService = {
  getBookingService
};

export default bookingService;
