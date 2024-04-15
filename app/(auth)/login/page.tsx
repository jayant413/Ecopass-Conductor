"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import api from "@/helper/api";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  email_id: z.string().min(5, { message: "Enter a valid email id." }).max(50),
  password: z
    .string()
    .min(4, { message: "Enter password of at least 4 characters." })
    .max(30),
});

const Login = () => {
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email_id: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await api.post(`/login`, values);

      toast({ title: " Logged in successfully" });
      if (response.data.success) {
        router.push(`/${response?.data?.data?._id}/start-journey`);
      }
    } catch (error: any) {
      if (error?.response?.status === 404) {
        toast({ title: "Not Registered" });
        return;
      }
      if (error?.response?.status === 401) {
        toast({ title: "Invalid password" });
        return;
      }
      toast({ title: "Something went wrong." });
    }
  }

  return (
    <div className="w-full h-[100vh] flex flex-col justify-center items-center bg-gray-100">
      <div className="pb-10">
        <span className="text-2xl font-bold"> Ecopass Conductor Login </span>
      </div>
      <div className="bg-white p-14 rounded-2xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="email_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email-Id</FormLabel>
                  <FormControl>
                    <Input type="text" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
        <div className="flex  flex-col text-blue-500 underline  mt-6 space-y-2">
          <span className="cursor-pointer">Change Password ?</span>
          <span className="cursor-pointer">Fogot Password ?</span>
        </div>
      </div>
    </div>
  );
};

export default Login;
