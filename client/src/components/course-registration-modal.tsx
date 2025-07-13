import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertCourseRegistrationSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Course } from "@shared/schema";

interface CourseRegistrationModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

const courseRegistrationFormSchema = insertCourseRegistrationSchema.extend({
  participantName: z.string().min(1, "El nombre es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "El teléfono es requerido"),
  level: z.string().min(1, "El nivel es requerido"),
});

export default function CourseRegistrationModal({ course, isOpen, onClose }: CourseRegistrationModalProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof courseRegistrationFormSchema>>({
    resolver: zodResolver(courseRegistrationFormSchema),
    defaultValues: {
      courseId: course?.id || 0,
      participantName: "",
      email: "",
      phone: "",
      level: "",
    },
  });

  // Update courseId when course changes
  if (course && form.getValues("courseId") !== course.id) {
    form.setValue("courseId", course.id);
  }

  const onSubmit = async (values: z.infer<typeof courseRegistrationFormSchema>) => {
    try {
      await apiRequest("POST", "/api/course-registrations", values);
      toast({
        title: "¡Inscripción exitosa!",
        description: "Tu inscripción al curso ha sido registrada correctamente.",
      });
      form.reset();
      onClose();
      // Invalidate cache to refresh admin data
      queryClient.invalidateQueries({ queryKey: ["/api/course-registrations"] });
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo completar la inscripción. Inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Inscripción al Curso</DialogTitle>
        </DialogHeader>
        
        {course && (
          <div className="mb-4 p-3 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900">{course.name}</h4>
            <p className="text-sm text-gray-600">{course.date}</p>
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="participantName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre Completo</FormLabel>
                  <FormControl>
                    <Input placeholder="Tu nombre completo" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
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
              control={form.control}
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

            <FormField
              control={form.control}
              name="level"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nivel de Experiencia</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu nivel" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="principiante">Principiante</SelectItem>
                      <SelectItem value="intermedio">Intermedio</SelectItem>
                      <SelectItem value="avanzado">Avanzado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancelar
              </Button>
              <Button type="submit" className="flex-1 bg-primary hover:bg-blue-700">
                Confirmar Inscripción
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
