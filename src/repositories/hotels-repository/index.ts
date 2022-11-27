import { prisma } from "@/config";

async function findHotels() {
  return await prisma.hotel.findMany();
}

async function findRooms(hotelId: number) {
  return await prisma.room.findFirst({
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
