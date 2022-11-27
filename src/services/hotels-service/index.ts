import { notFoundError, unauthorizedError, requestError, paymentError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import { TicketStatus } from "@prisma/client";
import { Hotel, Room } from "@prisma/client";

async function getHotelsService(userId: number): Promise<Hotel[]> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) {
    throw notFoundError();
  }
  if(ticket.TicketType.includesHotel === false) {
    throw unauthorizedError();
  }
  if(ticket.status !== "PAID") {
    throw paymentError();
  }
  const hotels = await hotelsRepository.findHotels();
  if(!hotels) {
    throw notFoundError();
  }
  return hotels;
} 

async function getRoomsService(userId: number, hotelId: number): Promise<RoomWithHotel> {
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if(!enrollment) {
    throw notFoundError();
  }
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);
  if(!ticket) {
    throw notFoundError();
  }
  if(ticket.TicketType.includesHotel === false) {
    throw unauthorizedError();
  }
  if(ticket.status !== "PAID") {
    throw paymentError();
  }
  const rooms = await hotelsRepository.findRooms(hotelId);
  if(!rooms) {
    throw  notFoundError();
  }
  return rooms;
}

type RoomWithHotel = Room & {
    Hotel: Hotel
};

const hotelsService = {
  getHotelsService,
  getRoomsService
};

export default hotelsService;
