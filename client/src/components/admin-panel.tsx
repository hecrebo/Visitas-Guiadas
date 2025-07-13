import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Users, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
import type { CourseRegistration, TourRegistration, Course } from "@shared/schema";

export default function AdminPanel() {
  const { toast } = useToast();

  const { data: courseRegistrations = [], isLoading: courseRegLoading } = useQuery<CourseRegistration[]>({
    queryKey: ["/api/course-registrations"],
  });

  const { data: tourRegistrations = [], isLoading: tourRegLoading } = useQuery<TourRegistration[]>({
    queryKey: ["/api/tour-registrations"],
  });

  const { data: courses = [] } = useQuery<Course[]>({
    queryKey: ["/api/courses"],
  });

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

  // Statistics
  const activeCourses = courses.length;
  const totalCourseRegistrations = courseRegistrations.length;
  const totalTourRegistrations = tourRegistrations.length;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Panel de Administración</h2>
        <p className="text-gray-600">Gestiona inscripciones y registros</p>
      </div>

      <Tabs defaultValue="course-registrations" className="space-y-6">
        <TabsList>
          <TabsTrigger value="course-registrations">Inscripciones de Cursos</TabsTrigger>
          <TabsTrigger value="tour-registrations">Reservas de Visitas</TabsTrigger>
          <TabsTrigger value="statistics">Estadísticas</TabsTrigger>
        </TabsList>

        <TabsContent value="course-registrations">
          <Card>
            <CardContent className="p-0">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Inscripciones de Cursos</h3>
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
                        <TableHead>Fecha Inscripción</TableHead>
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
                          <TableCell className="text-gray-500">{registration.registrationDate}</TableCell>
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
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Reservas de Visitas Guiadas</h3>
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
                        <TableHead>Tipo de Visita</TableHead>
                        <TableHead>Responsable</TableHead>
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
                              {getTourTypeLabel(registration.tourType)}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-gray-900">{registration.responsibleName}</div>
                            <div className="text-sm text-gray-500">{registration.email}</div>
                          </TableCell>
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
