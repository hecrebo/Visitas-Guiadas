import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const courses = pgTable("courses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  date: text("date").notNull(),
  capacity: integer("capacity").notNull(),
  imageUrl: text("image_url").notNull(),
});

export const tours = pgTable("tours", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // weekday, saturday, sunday
  schedule: text("schedule").notNull(),
  description: text("description").notNull(),
  capacity: integer("capacity").notNull(),
});

export const courseRegistrations = pgTable("course_registrations", {
  id: serial("id").primaryKey(),
  courseId: integer("course_id").notNull(),
  participantName: text("participant_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  level: text("level").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  registrationDate: text("registration_date").notNull(),
});

export const tourRegistrations = pgTable("tour_registrations", {
  id: serial("id").primaryKey(),
  tourType: text("tour_type").notNull(),
  preferredDate: text("preferred_date").notNull(),
  numberOfPeople: text("number_of_people").notNull(),
  responsibleName: text("responsible_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  status: text("status").notNull().default("pending"), // pending, confirmed, cancelled
  registrationDate: text("registration_date").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertCourseSchema = createInsertSchema(courses).omit({
  id: true,
});

export const insertTourSchema = createInsertSchema(tours).omit({
  id: true,
});

export const insertCourseRegistrationSchema = createInsertSchema(courseRegistrations).omit({
  id: true,
  registrationDate: true,
  status: true,
});

export const insertTourRegistrationSchema = createInsertSchema(tourRegistrations).omit({
  id: true,
  registrationDate: true,
  status: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCourse = z.infer<typeof insertCourseSchema>;
export type Course = typeof courses.$inferSelect;

export type InsertTour = z.infer<typeof insertTourSchema>;
export type Tour = typeof tours.$inferSelect;

export type InsertCourseRegistration = z.infer<typeof insertCourseRegistrationSchema>;
export type CourseRegistration = typeof courseRegistrations.$inferSelect;

export type InsertTourRegistration = z.infer<typeof insertTourRegistrationSchema>;
export type TourRegistration = typeof tourRegistrations.$inferSelect;
