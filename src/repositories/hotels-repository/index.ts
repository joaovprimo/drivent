import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRooms(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

async function findHotelById(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId
    }
  });
}

const hotelsRepository = {
  findHotels,
  findRooms,
  findHotelById
};

export default hotelsRepository;
