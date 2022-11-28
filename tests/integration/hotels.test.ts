import app, { init } from "@/app";
import { prisma } from "@/config";
import faker from "@faker-js/faker";
import { TicketStatus } from "@prisma/client";
import httpStatus from "http-status";
import { number } from "joi";
import * as jwt from "jsonwebtoken";
import supertest from "supertest";
import { createEnrollmentWithAddress, createUser, createTicketType, createTicket, createPayment, createHotel, createRoom } from "../factories";
import { cleanDb, generateValidToken } from "../helpers";

beforeAll(async () => {
  await init();
  await cleanDb();
});

beforeEach(async () => {
  await cleanDb();
});

const server = supertest(app);

describe("GET /hotels", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels");

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
      
    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
    
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();

    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
      
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
      const token = await generateValidToken();
      
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesn't have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });

    /*it("should respond with status 401 when TicketType of ticket doesn't includes hotel", async ()=>{
            const user = await createUser();
            const token = await generateValidToken(user);
            const enrollment = await createEnrollmentWithAddress(user);
            const ticketType = await createTicketType({ isRemote:false, includesHotel:false });
            await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

            const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

            expect(response.status).toBe(httpStatus.UNAUTHORIZED);
        });*/

    it("should respond with status 402 when ticket isn't paid yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });

    it("should respond with an empty array when ticket is paid but there are not hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);

      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.body).toEqual([]);
    });

    it("should response with status 200 and list of hotels", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
            
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          name: hotel.name,
          image: hotel.image,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        }
      ]);
    });
  });
});

describe("GET /hotels/:hotelId", () => {
  it("should respond with status 401 if no token is given", async () => {
    const response = await server.get("/hotels/1");
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
  it("should respond with status 401 if given token is not valid", async () => {
    const token = faker.lorem.word();
        
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
  
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });
      
  it("should respond with status 401 if there is no session for given token", async () => {
    const userWithoutSession = await createUser();
  
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
  
    const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);
        
    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  describe("when token is valid", () => {
    it("should respond with status 400 when hotelId was not sent", async () => {
      const user = await createUser();
      const params = null as number;

      const token = await generateValidToken(user);
            
      const response = await server.get(`/hotels/${params}`).set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.BAD_REQUEST);
    });

    it("should respond with status 404 when there is not an hotel by hotelId sent",  async () => {
      const user = await createUser();

      const token = await generateValidToken(user);
            
      const response = await server.get("/hotels/1").set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });

    it("should respond with status 404 when user doesn't have an enrollment yet", async () => {
      const token = await generateValidToken();
          
      const response = await server.get("/hotels/").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.NOT_FOUND);
    });
    
    it("should respond with status 404 when user doesn't have a ticket yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      await createEnrollmentWithAddress(user);
    
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toEqual(httpStatus.NOT_FOUND);
    });
    
    /*it("should respond with status 401 when TicketType of ticket doesn't includes hotel", async ()=>{
                const user = await createUser();
                const token = await generateValidToken(user);
                const enrollment = await createEnrollmentWithAddress(user);
                const ticketType = await createTicketType({ isRemote:false, includesHotel:false });
                await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    
                const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
                expect(response.status).toBe(httpStatus.UNAUTHORIZED);
            });*/
    
    it("should respond with status 402 when ticket isn't paid yet", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      await createTicket(enrollment.id, ticketType.id, TicketStatus.RESERVED);
    
      const response = await server.get("/hotels").set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.PAYMENT_REQUIRED);
    });
    
    it("should respond with an empty array when there is not rooms for given hotel", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
    
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.body).toEqual([]);
    });
    
    it("should response with status 200 and list of rooms by hotelId sent", async () => {
      const user = await createUser();
      const token = await generateValidToken(user);
      const enrollment = await createEnrollmentWithAddress(user);
      const ticketType = await createTicketType({ isRemote: false, includesHotel: true });
      const ticket = await createTicket(enrollment.id, ticketType.id, TicketStatus.PAID);
      await createPayment(ticket.id, ticketType.price);
      const hotel = await createHotel();
      const rooms = await createRoom(hotel.id);
                
      const response = await server.get(`/hotels/${hotel.id}`).set("Authorization", `Bearer ${token}`);
    
      expect(response.status).toBe(httpStatus.OK);
      expect(response.body).toEqual([
        {
          id: expect.any(Number),
          name: rooms.name,
          capacity: rooms.capacity,
          hotelId: rooms.hotelId,
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }]
      );
    });
  });
});
