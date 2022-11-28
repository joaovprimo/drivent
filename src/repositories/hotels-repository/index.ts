import { prisma } from "@/config";

async function findHotels() {
  return prisma.hotel.findMany();
}

async function findRooms(hotelId: number) {
  return prisma.room.findFirst({
    where: {
      hotelId,
    },
    include: {
      Hotel: true,
    }
  });
}

const hotelsRepository = {
  findHotels,
  findRooms
};

export default hotelsRepository;
