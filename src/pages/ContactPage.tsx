import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object({
    nombre: Yup.string().trim().required("El nombre es obligatorio"),
    email: Yup.string().trim().email("Debe ser un email válido").required("El email es obligatorio"),
    mensaje: Yup.string().trim().required("El mensaje es obligatorio"),
});

const ContactPage: React.FC = () => {
    const formik = useFormik({
        initialValues: {
            nombre: "",
            email: "",
            mensaje: ""
        },
        validationSchema,
        onSubmit: async (values) => {
            //TODO: Cambiar esto por el endpoint piola
            await fetch("http://DelgaApiCommentApp/api/contacto", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(values)
            }).then((response) => {
                if (!response.ok) {
                    throw new Error("Error al enviar el formulario. " + response.statusText);
                }
                console.log("Formulario válido y envido:", values);
                formik.resetForm();
            }).catch((e) => {
                console.error(e.message);
            });
        }
    });

    return (
        <div className="flex justify-center items-center min-h-screen">
            <Card className="min-w-96 w-[35vw] min-h-[400px] flex flex-col">
                <CardHeader className="gap-5">
                    <CardTitle className="ml-10 mr-10 border-b-2 p-1 text-xl">Contactanos</CardTitle>
                    <CardDescription className="ml-10 mr-10">Envianos tu consulta, duda o sugerencia</CardDescription>
                </CardHeader>

                <CardContent className="p-5 ml-10 mr-10 flex-1 flex flex-col">
                    <form onSubmit={formik.handleSubmit} className="flex flex-col gap-4 flex-1">
                        <div className="w-full">
                            <input className="w-full border-b p-1 focus:outline-none" type="text" placeholder="Nombre"
                                name="nombre"
                                value={formik.values.nombre}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.nombre && formik.errors.nombre ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.nombre}</p>
                            ) : null}
                        </div>

                        <div className="w-full">
                            <input className="w-full border-b p-1 focus:outline-none" type="email" placeholder="Email"
                                name="email"
                                value={formik.values.email}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.email && formik.errors.email ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
                            ) : null}
                        </div>

                        <div className="w-full flex-1 flex flex-col">
                            <textarea className="w-full flex-1 border-2 rounded-md p-3 resize-none focus:outline-none focus:ring-2 focus:ring"
                                placeholder="Tu mensaje..."
                                name="mensaje"
                                value={formik.values.mensaje}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.mensaje && formik.errors.mensaje ? (
                                <p className="text-red-500 text-sm mt-1">{formik.errors.mensaje}</p>
                            ) : null}
                        </div>

                        <button 
                            type="submit"
                            disabled={!formik.isValid || !formik.dirty}
                            className="self-center rounded-xl border-2 w-fit p-2 disabled:opacity-50 mt-2 disabled:cursor-not-allowed">
                                Enviar
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
};

export default ContactPage;