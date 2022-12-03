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
    throw badRequestError();
  }

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

  const room = await roomRepository.findRoomByID(roomId);
  if(!room) {
    throw notFoundError();
  }

  if(room.capacity < 1) {
    throw forbiddenError();
  }
  
  const postingBooking = await bookingRepository.postBooking(userId, roomId);
  return postingBooking;
}

async function updatingBooking(userId: number, roomId: number, bookingId: number): Promise<Booking> {
  if(!roomId || roomId < 1 || typeof roomId !== "number" || bookingId < 1) {
    throw badRequestError();
  }

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

  const room = await roomRepository.findRoomByID(roomId);
  if(!room) {
    throw notFoundError();
  }

  if(room.capacity < 1) {
    throw forbiddenError();
  }

  const bookingByUser = await bookingRepository.findBooking(userId);
  if(!bookingByUser) {
    throw notFoundError(); //feito
  }

  if(bookingByUser.id !== bookingId) {
    throw forbiddenError(); //feito
  }  

  const updatedBooking = await bookingRepository.updateBooking(bookingId, roomId);
  return updatedBooking;
}

type bookingWithRoom = Booking & {
    Room: Room
};

const bookingService = {
  getBookingService,
  postBookingService,
  updatingBooking
};

export default bookingService;
