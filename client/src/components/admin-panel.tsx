import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, MapPin, Plus, Edit, Trash2, LogOut, Download, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import AdminLogin from "./admin-login";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCourseSchema } from "@shared/schema";
import { z } from "zod";
import type { CourseRegistration, TourRegistration, Course } from "@shared/schema";

const courseFormSchema = insertCourseSchema.extend({
  name: z.string().min(1, "El nombre es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  date: z.string().min(1, "La fecha es requerida"),
  capacity: z.number().min(1, "La capacidad debe ser mayor a 0"),
  imageUrl: z.string().url("Debe ser una URL válida"),
});

function AdminPanelContent() {
  const { toast } = useToast();
  const { logout } = useAuth();
  const [isAddCourseOpen, setIsAddCourseOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  
  const handleLogout = () => {
    logout();
    toast({
      title: "Sesión cerrada",
      description: "Has cerrado sesión del panel de administración",
    });
  };

  const { data: courseRegistrations = [], isLoading: courseRegLoading } = useQuery<CourseRegistration[]>({
    queryKey: ["/api/course-registrations"],
  });

  const { data: tourRegistrations = [], isLoading: tourRegLoading } = useQuery<TourRegistration[]>({
    queryKey: ["/api/tour-registrations"],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

  const courseForm = useForm<z.infer<typeof courseFormSchema>>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: "",
      description: "",
      date: "",
      capacity: 15,
      imageUrl: "",
    },
  });

  const createCourseMutation = useMutation({
    mutationFn: (course: z.infer<typeof courseFormSchema>) =>
      apiRequest("POST", "/api/courses", course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Curso creado",
        description: "El curso ha sido creado exitosamente.",
      });
      courseForm.reset();
      setIsAddCourseOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo crear el curso.",
        variant: "destructive",
      });
    },
  });

  const updateCourseMutation = useMutation({
    mutationFn: ({ id, course }: { id: number; course: z.infer<typeof courseFormSchema> }) =>
      apiRequest("PATCH", `/api/courses/${id}`, course),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Curso actualizado",
        description: "El curso ha sido actualizado exitosamente.",
      });
      courseForm.reset();
      setEditingCourse(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el curso.",
        variant: "destructive",
      });
    },
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/courses/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/courses"] });
      toast({
        title: "Curso eliminado",
        description: "El curso ha sido eliminado exitosamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar el curso.",
        variant: "destructive",
      });
    },
  });

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    courseForm.reset({
      name: course.name,
      description: course.description,
      date: course.date,
      capacity: course.capacity,
      imageUrl: course.imageUrl,
    });
  };

  const handleDeleteCourse = (id: number) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este curso?")) {
      deleteCourseMutation.mutate(id);
    }
  };

  const onCourseSubmit = (values: z.infer<typeof courseFormSchema>) => {
    if (editingCourse) {
      updateCourseMutation.mutate({ id: editingCourse.id, course: values });
    } else {
      createCourseMutation.mutate(values);
    }
  };

  const updateCourseRegistrationMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/course-registrations/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-registrations"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la inscripción ha sido actualizado.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    },
  });

  const deleteCourseRegistrationMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/course-registrations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/course-registrations"] });
      toast({
        title: "Inscripción eliminada",
        description: "La inscripción ha sido eliminada correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la inscripción.",
        variant: "destructive",
      });
    },
  });

  const updateTourRegistrationMutation = useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      apiRequest("PATCH", `/api/tour-registrations/${id}/status`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-registrations"] });
      toast({
        title: "Estado actualizado",
        description: "El estado de la reserva ha sido actualizado.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado.",
        variant: "destructive",
      });
    },
  });

  const deleteTourRegistrationMutation = useMutation({
    mutationFn: (id: number) => apiRequest("DELETE", `/api/tour-registrations/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tour-registrations"] });
      toast({
        title: "Reserva eliminada",
        description: "La reserva ha sido eliminada correctamente.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "No se pudo eliminar la reserva.",
        variant: "destructive",
      });
    },
  });

  const getCourseName = (courseId: number) => {
    const course = courses.find(c => c.id === courseId);
    return course?.name || "Curso desconocido";
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return <Badge className="bg-green-100 text-green-800">Confirmado</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      case "cancelled":
        return <Badge className="bg-red-100 text-red-800">Cancelado</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTourTypeLabel = (type: string) => {
    switch (type) {
      case "weekday":
        return "Lunes a Viernes";
      default:
        return type;
    }
  };

  // Export functions
  const exportCourseRegistrationsToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Fundacite Carabobo - Inscripciones de Cursos', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
    
    // Table data
    const tableData = courseRegistrations.map(reg => [
      getCourseName(reg.courseId),
      reg.participantName,
      reg.level,
      reg.email,
      reg.preferredDate,
      reg.status === 'confirmed' ? 'Confirmado' : reg.status === 'pending' ? 'Pendiente' : 'Cancelado'
    ]);
    
    (doc as any).autoTable({
      head: [['Curso', 'Participante', 'Nivel', 'Email', 'Fecha Preferida', 'Estado']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 8 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save('inscripciones-cursos.pdf');
    
    toast({
      title: "PDF generado",
      description: "Las inscripciones de cursos se han exportado correctamente",
    });
  };

  const exportTourRegistrationsToPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(16);
    doc.text('Fundacite Carabobo - Reservas de Visitas', 20, 20);
    doc.setFontSize(10);
    doc.text(`Generado el: ${new Date().toLocaleDateString('es-ES')}`, 20, 30);
    
    // Table data
    const tableData = tourRegistrations.map(reg => [
      `${reg.responsibleName} ${reg.responsibleLastName}`,
      reg.cedula,
      reg.gender,
      `${reg.age} años`,
      reg.email,
      reg.phone,
      reg.institution,
      reg.preferredDate,
      reg.numberOfPeople,
      reg.status === 'confirmed' ? 'Confirmado' : reg.status === 'pending' ? 'Pendiente' : 'Cancelado'
    ]);
    
    (doc as any).autoTable({
      head: [['Responsable', 'Cédula', 'Sexo', 'Edad', 'Email', 'Teléfono', 'Institución', 'Fecha', 'Personas', 'Estado']],
      body: tableData,
      startY: 40,
      styles: { fontSize: 7 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save('reservas-visitas.pdf');
    
    toast({
      title: "PDF generado",
      description: "Las reservas de visitas se han exportado correctamente",
    });
  };

  const exportCourseRegistrationsToExcel = () => {
    const data = courseRegistrations.map(reg => ({
      'Curso': getCourseName(reg.courseId),
      'Participante': reg.participantName,
      'Nivel': reg.level,
      'Email': reg.email,
      'Fecha Preferida': reg.preferredDate,
      'Estado': reg.status === 'confirmed' ? 'Confirmado' : reg.status === 'pending' ? 'Pendiente' : 'Cancelado',
      'Fecha de Registro': reg.registrationDate
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Inscripciones');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'inscripciones-cursos.xlsx');
    
    toast({
      title: "Excel generado",
      description: "Las inscripciones de cursos se han exportado correctamente",
    });
  };

  const exportTourRegistrationsToExcel = () => {
    const data = tourRegistrations.map(reg => ({
      'Nombre': reg.responsibleName,
      'Apellido': reg.responsibleLastName,
      'Cédula': reg.cedula,
      'Sexo': reg.gender,
      'Edad': reg.age,
      'Email': reg.email,
      'Teléfono': reg.phone,
      'Institución': reg.institution,
      'Fecha de Visita': reg.preferredDate,
      'Número de Personas': reg.numberOfPeople,
      'Estado': reg.status === 'confirmed' ? 'Confirmado' : reg.status === 'pending' ? 'Pendiente' : 'Cancelado',
      'Fecha de Registro': reg.registrationDate
    }));
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Reservas');
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    saveAs(blob, 'reservas-visitas.xlsx');
    
    toast({
      title: "Excel generado",
      description: "Las reservas de visitas se han exportado correctamente",
    });
  };

  // Statistics
  const activeCourses = courses.length;
  const totalCourseRegistrations = courseRegistrations.length;
  const totalTourRegistrations = tourRegistrations.length;

  return (
    <div>
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h2>
          <p className="text-gray-600">Gestiona inscripciones y registros</p>
        </div>
        <Button 
          onClick={handleLogout}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar Sesión</span>
        </Button>
      </div>

      <Tabs defaultValue="course-registrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="course-registrations">Inscripciones de Cursos</TabsTrigger>
          <TabsTrigger value="tour-registrations">Reservas de Visitas</TabsTrigger>
          <TabsTrigger value="course-management">Gestión de Cursos</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="course-registrations">
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Inscripciones de Cursos</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportCourseRegistrationsToPDF}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportCourseRegistrationsToExcel}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Excel</span>
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {courseRegLoading ? (
                  <div className="p-6">Cargando inscripciones...</div>
                ) : courseRegistrations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No hay inscripciones registradas
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Curso</TableHead>
                        <TableHead>Participante</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Fecha Preferida</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courseRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {getCourseName(registration.courseId)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{registration.participantName}</div>
                            <div className="text-sm text-gray-500">{registration.level}</div>
                          </TableCell>
                          <TableCell className="text-gray-500">{registration.email}</TableCell>
                          <TableCell className="text-gray-500">{registration.preferredDate}</TableCell>
                          <TableCell>{getStatusBadge(registration.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {registration.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateCourseRegistrationMutation.mutate({
                                      id: registration.id,
                                      status: "confirmed",
                                    })
                                  }
                                  disabled={updateCourseRegistrationMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirmar
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteCourseRegistrationMutation.mutate(registration.id)}
                                disabled={deleteCourseRegistrationMutation.isPending}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tour-registrations">
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Reservas de Visitas Guiadas</h3>
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportTourRegistrationsToPDF}
                    className="flex items-center space-x-2"
                  >
                    <FileText className="w-4 h-4" />
                    <span>PDF</span>
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={exportTourRegistrationsToExcel}
                    className="flex items-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Excel</span>
                  </Button>
                </div>
              </div>
              <div className="overflow-x-auto">
                {tourRegLoading ? (
                  <div className="p-6">Cargando reservas...</div>
                ) : tourRegistrations.length === 0 ? (
                  <div className="p-6 text-center text-gray-500">
                    No hay reservas registradas
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Responsable</TableHead>
                        <TableHead>Información Personal</TableHead>
                        <TableHead>Contacto</TableHead>
                        <TableHead>Institución</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Personas</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tourRegistrations.map((registration) => (
                        <TableRow key={registration.id}>
                          <TableCell>
                            <div className="font-medium text-gray-900">
                              {registration.responsibleName} {registration.responsibleLastName}
                            </div>
                            <div className="text-sm text-gray-500">{registration.cedula}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{registration.gender}</div>
                            <div className="text-sm text-gray-500">{registration.age} años</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{registration.email}</div>
                            <div className="text-sm text-gray-500">{registration.phone}</div>
                          </TableCell>
                          <TableCell className="text-gray-500">{registration.institution}</TableCell>
                          <TableCell className="text-gray-500">{registration.preferredDate}</TableCell>
                          <TableCell className="text-gray-500">{registration.numberOfPeople}</TableCell>
                          <TableCell>{getStatusBadge(registration.status)}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              {registration.status === "pending" && (
                                <Button
                                  size="sm"
                                  onClick={() =>
                                    updateTourRegistrationMutation.mutate({
                                      id: registration.id,
                                      status: "confirmed",
                                    })
                                  }
                                  disabled={updateTourRegistrationMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Confirmar
                                </Button>
                              )}
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => deleteTourRegistrationMutation.mutate(registration.id)}
                                disabled={deleteTourRegistrationMutation.isPending}
                              >
                                Cancelar
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="course-management">
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Gestión de Cursos</h3>
              <Dialog open={isAddCourseOpen} onOpenChange={setIsAddCourseOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Agregar Curso
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Agregar Nuevo Curso</DialogTitle>
                  </DialogHeader>
                  <Form {...courseForm}>
                    <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
                      <FormField
                        control={courseForm.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Curso</FormLabel>
                            <FormControl>
                              <Input placeholder="Nombre del curso" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={courseForm.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Descripción del curso" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={courseForm.control}
                        name="date"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Fecha</FormLabel>
                            <FormControl>
                              <Input placeholder="Ej: 15-20 de Enero, 2025" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={courseForm.control}
                        name="capacity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Capacidad</FormLabel>
                            <FormControl>
                              <Input 
                                type="number" 
                                placeholder="Capacidad máxima" 
                                {...field} 
                                onChange={e => field.onChange(parseInt(e.target.value))}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={courseForm.control}
                        name="imageUrl"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>URL de la Imagen</FormLabel>
                            <FormControl>
                              <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex space-x-3 pt-4">
                        <Button 
                          type="button" 
                          variant="outline" 
                          onClick={() => setIsAddCourseOpen(false)} 
                          className="flex-1"
                        >
                          Cancelar
                        </Button>
                        <Button 
                          type="submit" 
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={createCourseMutation.isPending}
                        >
                          Crear Curso
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Descripción</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Capacidad</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">{course.name}</TableCell>
                          <TableCell className="max-w-xs truncate">{course.description}</TableCell>
                          <TableCell>{course.date}</TableCell>
                          <TableCell>{course.capacity}</TableCell>
                          <TableCell>
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditCourse(course)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleDeleteCourse(course.id)}
                                disabled={deleteCourseMutation.isPending}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Edit Course Dialog */}
          <Dialog open={editingCourse !== null} onOpenChange={() => setEditingCourse(null)}>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Editar Curso</DialogTitle>
              </DialogHeader>
              <Form {...courseForm}>
                <form onSubmit={courseForm.handleSubmit(onCourseSubmit)} className="space-y-4">
                  <FormField
                    control={courseForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Curso</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del curso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Descripción</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Descripción del curso" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 15-20 de Enero, 2025" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="capacity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacidad</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            placeholder="Capacidad máxima" 
                            {...field} 
                            onChange={e => field.onChange(parseInt(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={courseForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL de la Imagen</FormLabel>
                        <FormControl>
                          <Input placeholder="https://..." {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex space-x-3 pt-4">
                    <Button 
                      type="button" 
                      variant="outline" 
                      onClick={() => setEditingCourse(null)} 
                      className="flex-1"
                    >
                      Cancelar
                    </Button>
                    <Button 
                      type="submit" 
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      disabled={updateCourseMutation.isPending}
                    >
                      Actualizar Curso
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </TabsContent>

        <TabsContent value="statistics">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-100">
                  <BookOpen className="text-blue-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Cursos Activos</p>
                  <p className="text-2xl font-semibold text-gray-900">{activeCourses}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-green-100">
                  <Users className="text-green-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Total Inscritos</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalCourseRegistrations}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-purple-100">
                  <MapPin className="text-purple-600 w-6 h-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Visitas Reservadas</p>
                  <p className="text-2xl font-semibold text-gray-900">{totalTourRegistrations}</p>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default function AdminPanel() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  return <AdminPanelContent />;
}
