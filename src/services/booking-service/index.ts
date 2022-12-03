import { notFoundError, paymentError, badRequestError, forbiddenError } from "@/errors";
import bookingRepository from "@/repositories/booking-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import roomRepository from "@/repositories/room-repository";
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

async function postBookingService(userId: number, roomId: number): Promise<Booking> {
  if(!roomId || roomId < 1 || typeof roomId !== "number") {
    throw badRequestError();//400 feito
  }

  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) {
    throw notFoundError();//feito
  }

  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) {
    throw notFoundError(); //feito
  }

  if(ticket.status !== "PAID") {
    throw paymentError(); //feito
  }

  const room = await roomRepository.findRoomByID(roomId);
  if(!room) {
    throw notFoundError();//404 feito
  }

  if(room.capacity < 1) {
    throw forbiddenError();//403 feito
  }
  
  const postingBooking = await bookingRepository.postBooking(userId, roomId);
  return postingBooking;
}

type bookingWithRoom = Booking & {
    Room: Room
};

const bookingService = {
  getBookingService,
  postBookingService
};

export default bookingService;
