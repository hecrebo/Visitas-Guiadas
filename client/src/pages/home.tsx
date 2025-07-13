import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Users, 
  MapPin, 
  Settings,
  BookOpen,
  Menu
} from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube, FaLinkedin } from "react-icons/fa";
import fundacyteLogo from "../assets/fundacyte-logo.png";
import { useToast } from "@/hooks/use-toast";
import CourseRegistrationModal from "@/components/course-registration-modal";
import AdminPanel from "@/components/admin-panel";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertTourRegistrationSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Course, Tour } from "@shared/schema";

type TabType = "courses" | "tours" | "admin";

const tourRegistrationFormSchema = insertTourRegistrationSchema.extend({
  preferredDate: z.string().min(1, "La fecha es requerida"),
  numberOfPeople: z.string().min(1, "El número de personas es requerido"),
});

export default function Home() {
  const [activeTab, setActiveTab] = useState<TabType>("courses");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { toast } = useToast();

  const { data: courses = [], isLoading: coursesLoading } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const { data: tours = [], isLoading: toursLoading } = useQuery<Tour[]>({
    queryKey: ["/api/tours"],
  });

  const tourForm = useForm<z.infer<typeof tourRegistrationFormSchema>>({
    resolver: zodResolver(tourRegistrationFormSchema),
    defaultValues: {
      tourType: "",
      preferredDate: "",
      numberOfPeople: "",
      responsibleName: "",
      email: "",
      phone: "",
    },
  });

  const onTourSubmit = async (values: z.infer<typeof tourRegistrationFormSchema>) => {
    try {
      await apiRequest("POST", "/api/tour-registrations", values);
      toast({
        title: "¡Reserva confirmada!",
        description: "Tu reserva de visita ha sido registrada correctamente.",
      });
      tourForm.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la reserva. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  const openCourseModal = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const getTourTypeLabel = (type: string) => {
    switch (type) {
      case "weekday":
        return "Lunes a Viernes (08:00-13:00)";
      default:
        return type;
    }
  };

  const tabItems = [
    { id: "courses", label: "Cursos", icon: BookOpen },
    { id: "tours", label: "Visitas Guiadas", icon: MapPin },
    { id: "admin", label: "Administración", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <img 
                src={fundacyteLogo} 
                alt="Fundacyte Logo" 
                className="h-12 w-auto"
              />
              <h1 className="text-xl font-semibold text-gray-900">Fundacite Carabobo</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {tabItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id as TabType)}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      activeTab === item.id
                        ? "text-primary border-b-2 border-primary"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="px-4 py-2 space-y-1">
            {tabItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id as TabType);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center space-x-2 w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === item.id
                      ? "text-primary bg-blue-50"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Courses Section */}
        {activeTab === "courses" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Cursos Disponibles</h2>
              <p className="text-gray-600">Descubre nuestros cursos de formación especializados</p>
            </div>

            {coursesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <div className="h-48 bg-gray-200"></div>
                    <CardContent className="p-6">
                      <div className="h-6 bg-gray-200 rounded mb-2"></div>
                      <div className="h-4 bg-gray-200 rounded mb-4"></div>
                      <div className="h-4 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <Card key={course.id} className="overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={course.imageUrl}
                      alt={course.name}
                      className="w-full h-48 object-cover"
                    />
                    <CardContent className="p-6">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{course.name}</h3>
                      <p className="text-gray-600 mb-4">{course.description}</p>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center text-sm text-gray-500">
                          <Calendar className="w-4 h-4 mr-2" />
                          <span>{course.date}</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-500">
                          <Users className="w-4 h-4 mr-2" />
                          <span>{course.capacity} cupos</span>
                        </div>
                      </div>
                      <Button
                        onClick={() => openCourseModal(course)}
                        className="w-full bg-primary hover:bg-blue-700"
                      >
                        Inscribirse
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tours Section */}
        {activeTab === "tours" && (
          <div>
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Visitas Guiadas</h2>
              <p className="text-gray-600">Explora nuestras instalaciones con guías especializados</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Tours Schedule */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Horarios Disponibles</h3>
                <div className="space-y-3">
                  {toursLoading ? (
                    [...Array(3)].map((_, i) => (
                      <div key={i} className="animate-pulse p-3 bg-gray-50 rounded-lg">
                        <div className="h-4 bg-gray-200 rounded mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded"></div>
                      </div>
                    ))
                  ) : (
                    tours.map((tour) => (
                      <div key={tour.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-900">
                            {tour.type === "weekday" && "Lunes a Viernes"}
                          </span>
                          <p className="text-sm text-gray-600">{tour.description}</p>
                        </div>
                        <div className="text-right">
                          <span className="text-primary font-semibold">{tour.schedule}</span>
                          <p className="text-sm text-gray-500">{tour.capacity} cupos</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>

              {/* Tour Reservation Form */}
              <Card className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Reservar Visita</h3>
                <Form {...tourForm}>
                  <form onSubmit={tourForm.handleSubmit(onTourSubmit)} className="space-y-4">
                    <FormField
                      control={tourForm.control}
                      name="tourType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Tipo de Visita</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecciona el tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="weekday">Lunes a Viernes (08:00-13:00)</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={tourForm.control}
                      name="preferredDate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha Preferida</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={tourForm.control}
                      name="numberOfPeople"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Personas</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              placeholder="Ingresa el número de personas" 
                              min="1"
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={tourForm.control}
                      name="responsibleName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nombre del Responsable</FormLabel>
                          <FormControl>
                            <Input placeholder="Tu nombre completo" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={tourForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Correo Electrónico</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="tu@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={tourForm.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Teléfono</FormLabel>
                          <FormControl>
                            <Input type="tel" placeholder="+34 600 000 000" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button type="submit" className="w-full bg-secondary hover:bg-purple-800">
                      Reservar Visita
                    </Button>
                  </form>
                </Form>
              </Card>
            </div>
          </div>
        )}

        {/* Admin Section */}
        {activeTab === "admin" && <AdminPanel />}
      </main>

      {/* Course Registration Modal */}
      <CourseRegistrationModal
        course={selectedCourse}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Footer with Social Media */}
      <footer className="bg-gray-900 text-white py-8 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo and Info */}
            <div className="flex flex-col items-center md:items-start">
              <img src={fundacyteLogo} alt="Fundacite Carabobo" className="h-16 w-auto mb-4" />
              <p className="text-gray-300 text-center md:text-left text-sm">
                Centro de tecnología e innovación de Carabobo
              </p>
              <p className="text-gray-300 text-center md:text-left text-sm mt-2">
                Horario: Lunes a Viernes 8:00 AM - 1:00 PM
              </p>
            </div>

            {/* Contact Info */}
            <div className="flex flex-col items-center">
              <h3 className="text-lg font-semibold mb-4">Contacto</h3>
              <div className="space-y-2 text-sm text-gray-300 text-center">
                <p>📧 info@fundacitecarabobo.gob.ve</p>
                <p>📞 +58 241-8000000</p>
                <p>📍 Valencia, Estado Carabobo</p>
              </div>
            </div>

            {/* Social Media */}
            <div className="flex flex-col items-center md:items-end">
              <h3 className="text-lg font-semibold mb-4">Síguenos</h3>
              <div className="flex space-x-4">
                <a 
                  href="https://www.facebook.com/fundacitecarabobo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-500 transition-colors"
                >
                  <FaFacebook size={24} />
                </a>
                <a 
                  href="https://www.instagram.com/fundacitecarabobo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-pink-500 transition-colors"
                >
                  <FaInstagram size={24} />
                </a>
                <a 
                  href="https://twitter.com/fundacitecarabo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-400 transition-colors"
                >
                  <FaTwitter size={24} />
                </a>
                <a 
                  href="https://www.youtube.com/channel/fundacitecarabobo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-red-500 transition-colors"
                >
                  <FaYoutube size={24} />
                </a>
                <a 
                  href="https://www.linkedin.com/company/fundacite-carabobo" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-blue-600 transition-colors"
                >
                  <FaLinkedin size={24} />
                </a>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p className="text-gray-400 text-sm">
              © 2025 Fundacite Carabobo. Todos los derechos reservados.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
