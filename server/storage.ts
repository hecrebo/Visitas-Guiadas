import { 
  users, courses, tours, courseRegistrations, tourRegistrations,
  type User, type InsertUser,
  type Course, type InsertCourse,
  type Tour, type InsertTour,
  type CourseRegistration, type InsertCourseRegistration,
  type TourRegistration, type InsertTourRegistration
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Courses
  getAllCourses(): Promise<Course[]>;
  getCourse(id: number): Promise<Course | undefined>;
  createCourse(course: InsertCourse): Promise<Course>;

  // Tours
  getAllTours(): Promise<Tour[]>;
  getTour(id: number): Promise<Tour | undefined>;
  createTour(tour: InsertTour): Promise<Tour>;

  // Course Registrations
  getAllCourseRegistrations(): Promise<CourseRegistration[]>;
  getCourseRegistration(id: number): Promise<CourseRegistration | undefined>;
  createCourseRegistration(registration: InsertCourseRegistration): Promise<CourseRegistration>;
  updateCourseRegistrationStatus(id: number, status: string): Promise<CourseRegistration | undefined>;
  deleteCourseRegistration(id: number): Promise<boolean>;

  // Tour Registrations
  getAllTourRegistrations(): Promise<TourRegistration[]>;
  getTourRegistration(id: number): Promise<TourRegistration | undefined>;
  createTourRegistration(registration: InsertTourRegistration): Promise<TourRegistration>;
  updateTourRegistrationStatus(id: number, status: string): Promise<TourRegistration | undefined>;
  deleteTourRegistration(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private courses: Map<number, Course>;
  private tours: Map<number, Tour>;
  private courseRegistrations: Map<number, CourseRegistration>;
  private tourRegistrations: Map<number, TourRegistration>;
  private currentUserId: number;
  private currentCourseId: number;
  private currentTourId: number;
  private currentCourseRegistrationId: number;
  private currentTourRegistrationId: number;

  constructor() {
    this.users = new Map();
    this.courses = new Map();
    this.tours = new Map();
    this.courseRegistrations = new Map();
    this.tourRegistrations = new Map();
    this.currentUserId = 1;
    this.currentCourseId = 1;
    this.currentTourId = 1;
    this.currentCourseRegistrationId = 1;
    this.currentTourRegistrationId = 1;

    // Initialize with default data
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Initialize courses
    const defaultCourses: InsertCourse[] = [
      {
        name: "Técnicas de Cocina Profesional",
        description: "Aprende las técnicas fundamentales de la cocina profesional con chefs expertos.",
        date: "15 Mar 2024",
        capacity: 12,
        imageUrl: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Marketing Digital Avanzado",
        description: "Domina las estrategias más efectivas del marketing digital y redes sociales.",
        date: "22 Mar 2024",
        capacity: 20,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Fotografía Profesional",
        description: "Desarrolla tu ojo artístico y técnicas profesionales de fotografía.",
        date: "28 Mar 2024",
        capacity: 8,
        imageUrl: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      }
    ];

    defaultCourses.forEach(course => {
      this.createCourse(course);
    });

    // Initialize tours
    const defaultTours: InsertTour[] = [
      {
        type: "weekday",
        schedule: "10:00 - 11:30",
        description: "Visita completa de instalaciones",
        capacity: 15
      },
      {
        type: "saturday",
        schedule: "09:00 - 12:00",
        description: "Visita especializada + taller",
        capacity: 10
      },
      {
        type: "sunday",
        schedule: "11:00 - 12:00",
        description: "Visita familiar",
        capacity: 20
      }
    ];

    defaultTours.forEach(tour => {
      this.createTour(tour);
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Courses
  async getAllCourses(): Promise<Course[]> {
    return Array.from(this.courses.values());
  }

  async getCourse(id: number): Promise<Course | undefined> {
    return this.courses.get(id);
  }

  async createCourse(insertCourse: InsertCourse): Promise<Course> {
    const id = this.currentCourseId++;
    const course: Course = { ...insertCourse, id };
    this.courses.set(id, course);
    return course;
  }

  // Tours
  async getAllTours(): Promise<Tour[]> {
    return Array.from(this.tours.values());
  }

  async getTour(id: number): Promise<Tour | undefined> {
    return this.tours.get(id);
  }

  async createTour(insertTour: InsertTour): Promise<Tour> {
    const id = this.currentTourId++;
    const tour: Tour = { ...insertTour, id };
    this.tours.set(id, tour);
    return tour;
  }

  // Course Registrations
  async getAllCourseRegistrations(): Promise<CourseRegistration[]> {
    return Array.from(this.courseRegistrations.values());
  }

  async getCourseRegistration(id: number): Promise<CourseRegistration | undefined> {
    return this.courseRegistrations.get(id);
  }

  async createCourseRegistration(insertRegistration: InsertCourseRegistration): Promise<CourseRegistration> {
    const id = this.currentCourseRegistrationId++;
    const registration: CourseRegistration = {
      ...insertRegistration,
      id,
      status: "pending",
      registrationDate: new Date().toLocaleDateString('es-ES')
    };
    this.courseRegistrations.set(id, registration);
    return registration;
  }

  async updateCourseRegistrationStatus(id: number, status: string): Promise<CourseRegistration | undefined> {
    const registration = this.courseRegistrations.get(id);
    if (registration) {
      const updatedRegistration = { ...registration, status };
      this.courseRegistrations.set(id, updatedRegistration);
      return updatedRegistration;
    }
    return undefined;
  }

  async deleteCourseRegistration(id: number): Promise<boolean> {
    return this.courseRegistrations.delete(id);
  }

  // Tour Registrations
  async getAllTourRegistrations(): Promise<TourRegistration[]> {
    return Array.from(this.tourRegistrations.values());
  }

  async getTourRegistration(id: number): Promise<TourRegistration | undefined> {
    return this.tourRegistrations.get(id);
  }

  async createTourRegistration(insertRegistration: InsertTourRegistration): Promise<TourRegistration> {
    const id = this.currentTourRegistrationId++;
    const registration: TourRegistration = {
      ...insertRegistration,
      id,
      status: "pending",
      registrationDate: new Date().toLocaleDateString('es-ES')
    };
    this.tourRegistrations.set(id, registration);
    return registration;
  }

  async updateTourRegistrationStatus(id: number, status: string): Promise<TourRegistration | undefined> {
    const registration = this.tourRegistrations.get(id);
    if (registration) {
      const updatedRegistration = { ...registration, status };
      this.tourRegistrations.set(id, updatedRegistration);
      return updatedRegistration;
    }
    return undefined;
  }

  async deleteTourRegistration(id: number): Promise<boolean> {
    return this.tourRegistrations.delete(id);
  }
}

export const storage = new MemStorage();
