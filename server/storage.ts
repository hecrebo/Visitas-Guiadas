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
  updateCourse(id: number, course: Partial<InsertCourse>): Promise<Course | undefined>;
  deleteCourse(id: number): Promise<boolean>;

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
        name: "Diseño Gráfico Básico",
        description: "Aprende tipografía, teoría del color, composición y software especializado como Adobe Illustrator, Photoshop e InDesign.",
        date: "15 Mar 2024",
        capacity: 15,
        imageUrl: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Marketing Digital",
        description: "Domina SEO, SEM, Social Media Marketing, Email Marketing y analítica web con Google Analytics.",
        date: "22 Mar 2024",
        capacity: 20,
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Robótica Educativa",
        description: "Programación de robots, diseño de mecanismos, electrónica básica e impresión 3D aplicada a la robótica.",
        date: "28 Mar 2024",
        capacity: 12,
        imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Inteligencia Artificial para el Trabajo",
        description: "Machine Learning, Deep Learning, Python para IA, TensorFlow y PyTorch para aplicaciones laborales.",
        date: "05 Abr 2024",
        capacity: 16,
        imageUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Tecno Competencia para la Educación",
        description: "Integración de TIC en el aula, diseño de materiales educativos digitales y gamificación educativa.",
        date: "12 Abr 2024",
        capacity: 18,
        imageUrl: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Cableado Estructurado y Redes",
        description: "Topologías de red, protocolos de comunicación, configuración de routers y switches, seguridad de redes.",
        date: "19 Abr 2024",
        capacity: 14,
        imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      },
      {
        name: "Reparación de Equipos Informáticos",
        description: "Hardware, software, mantenimiento preventivo y solución de problemas en equipos informáticos.",
        date: "26 Abr 2024",
        capacity: 10,
        imageUrl: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=200"
      }
    ];

    defaultCourses.forEach(course => {
      this.createCourse(course);
    });

    // Initialize tours
    const defaultTours: InsertTour[] = [
      {
        type: "weekday",
        schedule: "08:00 - 13:00",
        description: "Visita completa de instalaciones",
        capacity: 15
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

  async updateCourse(id: number, courseUpdate: Partial<InsertCourse>): Promise<Course | undefined> {
    const course = this.courses.get(id);
    if (course) {
      const updatedCourse = { ...course, ...courseUpdate };
      this.courses.set(id, updatedCourse);
      return updatedCourse;
    }
    return undefined;
  }

  async deleteCourse(id: number): Promise<boolean> {
    return this.courses.delete(id);
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
