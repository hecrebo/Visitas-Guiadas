import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertCourseRegistrationSchema,
  insertTourRegistrationSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Courses endpoints
  app.get("/api/courses", async (req, res) => {
    try {
      const courses = await storage.getAllCourses();
      res.json(courses);
    } catch (error) {
      res.status(500).json({ message: "Error fetching courses" });
    }
  });

  app.get("/api/courses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const course = await storage.getCourse(id);
      if (!course) {
        return res.status(404).json({ message: "Course not found" });
      }
      res.json(course);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course" });
    }
  });

  // Tours endpoints
  app.get("/api/tours", async (req, res) => {
    try {
      const tours = await storage.getAllTours();
      res.json(tours);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tours" });
    }
  });

  // Course registrations endpoints
  app.get("/api/course-registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllCourseRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching course registrations" });
    }
  });

  app.post("/api/course-registrations", async (req, res) => {
    try {
      const validatedData = insertCourseRegistrationSchema.parse(req.body);
      const registration = await storage.createCourseRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating course registration" });
    }
  });

  app.patch("/api/course-registrations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const registration = await storage.updateCourseRegistrationStatus(id, status);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Error updating registration status" });
    }
  });

  app.delete("/api/course-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteCourseRegistration(id);
      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting registration" });
    }
  });

  // Tour registrations endpoints
  app.get("/api/tour-registrations", async (req, res) => {
    try {
      const registrations = await storage.getAllTourRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Error fetching tour registrations" });
    }
  });

  app.post("/api/tour-registrations", async (req, res) => {
    try {
      const validatedData = insertTourRegistrationSchema.parse(req.body);
      const registration = await storage.createTourRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid data", errors: error.errors });
      }
      res.status(500).json({ message: "Error creating tour registration" });
    }
  });

  app.patch("/api/tour-registrations/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status } = req.body;
      
      if (!status || !["pending", "confirmed", "cancelled"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
      }

      const registration = await storage.updateTourRegistrationStatus(id, status);
      if (!registration) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.json(registration);
    } catch (error) {
      res.status(500).json({ message: "Error updating registration status" });
    }
  });

  app.delete("/api/tour-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTourRegistration(id);
      if (!deleted) {
        return res.status(404).json({ message: "Registration not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Error deleting registration" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
