import { notFoundError, unauthorizedError, requestError, paymentError } from "@/errors";
import ticketRepository from "@/repositories/ticket-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import hotelsRepository from "@/repositories/hotels-repository";
import { Hotel, Room } from "@prisma/client";
import { badRequestError } from "@/errors/bad-request-error";

async function getHotelsService(userId: number): Promise<Hotel[]> {
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
  const hotels = await hotelsRepository.findHotels();

  return hotels;
} 

async function getRoomsService(userId: number, hotelId: number): Promise<Room[]> {
  if(!hotelId) {
    throw badRequestError();
  }
  const hotelByid = await hotelsRepository.findHotelById(hotelId);
  if(!hotelByid) {
    throw notFoundError();
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
  const rooms = await (await hotelsRepository.findRooms(hotelId)).Rooms;
  if(!rooms) {
    throw  notFoundError();
  }
  return rooms;
}

type RoomWithHotel = Hotel & {
    Rooms: Room []
};

const hotelsService = {
  getHotelsService,
  getRoomsService
};

export default hotelsService;
