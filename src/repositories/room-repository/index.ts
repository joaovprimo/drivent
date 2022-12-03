import { prisma } from "@/config";

async function findRoomByID(roomId: number) {
  return await prisma.room.findFirst({
    where: {
      id: roomId
    }
  });
}

const roomRepository = {
  findRoomByID
};

export default roomRepository;
