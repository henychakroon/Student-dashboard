import * as z from "zod"
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "../ui/form.jsx";
import {Input} from "../ui/input.jsx";
import {Button} from "../ui/button.jsx";
import {useNavigate} from "react-router-dom";
import {ADMIN_DASHBOARD_ROUTE, STUDENT_DASHBOARD_ROUTE, TEACHER_DASHBOARD_ROUTE} from "../../router/index.jsx";
import {Loader} from "lucide-react";
import {useUserContext} from "../../context/StudentContext.jsx";
import { axiosClient } from "../../api/axios.js";

const formSchema = z.object({
  email: z.string().email().min(2).max(30),
  password: z.string().min(8).max(30)
})
export default function UserLogin() {
  const {login, setAuthenticated, setToken} = useUserContext()
  const navigate = useNavigate()
  const form = useForm({
    resolver: zodResolver(formSchema),
  })
  const {setError, formState: {isSubmitting}} = form

  // 2. Define a submit handler.
  const onSubmit = async values => {
    try {
      // Récupérer le jeton CSRF
      await axiosClient.get('/sanctum/csrf-cookie');
  
      // Effectuer la demande de connexion
      const response = await axiosClient.post('/login', values);
  
      // Vérifier le statut de la réponse
      if (response.status === 204) {
        // Si la connexion réussit, enregistrer le jeton et définir l'authentification comme vrai
        setToken(response.data.token);
        setAuthenticated(true);
        // Rediriger vers le tableau de bord de l'administrateur
        navigate(ADMIN_DASHBOARD_ROUTE);
      }
    } catch (error) {
      // Gérer les erreurs
      if (error.response) {
        // Si une réponse avec des erreurs de validation est renvoyée
        const { data } = error.response;
        setError('email', {
          message: data.errors.email.join()
        });
      } else {
        // Autres types d'erreurs (par exemple, erreur réseau)
        console.error('An error occurred:', error);
        // Gérer l'erreur de manière appropriée (affichage d'un message d'erreur, redirection vers une page d'erreur, etc.)
      }
    }
  };
  
  
  

    /*await login(values.email, values.password).then(
      ({status, data}) => {
        if (status === 200) {
          setToken(data.token)
          setAuthenticated(true)
          const {role} = data.user
          switch (role) {
            case 'student':
              navigate(STUDENT_DASHBOARD_ROUTE);
              break;
            case 'admin':
              navigate(ADMIN_DASHBOARD_ROUTE)
              break;
            case 'teacher':
              navigate(TEACHER_DASHBOARD_ROUTE)
              break;
          }
        }
      }).catch(({response}) => {
      setError('email', {
        message: response.data.errors.email.join()
      })
    })
  }
*/
  return <>
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FormField
          control={form.control}
          name="email"
          render={({field}) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({field}) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type={'password'} placeholder="Password" {...field} />
              </FormControl>
              <FormMessage/>
            </FormItem>
          )}
        />
        <Button className={'mt-2'} disabled={isSubmitting} type="submit">
          {isSubmitting && <Loader className={'mx-2 my-2 animate-spin'}/>} {' '} Login
        </Button>
      </form>
    </Form>
  </>
}
