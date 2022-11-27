import { prisma } from "@/config";
import { Hotel } from "@prisma/client";

async function findHotels(): Promise<Hotel[]> {
  return await prisma.hotel.findMany();
}

const hotelsRepository = {
  findHotels
};

export default hotelsRepository;
