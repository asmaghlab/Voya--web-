import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Send, Loader2, Mail, Phone } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Input } from "../../components/UI/Input";

const contactSchema = z.object({
  name: z.string().min(1, "Name is required").min(2, "Name must be at least 2 characters").max(100),
  email: z.string().min(1, "Email is required").email("Invalid email").max(255),
  phone: z.string().regex(/^[\d\s\-+()]*$/, "Invalid phone number").optional().or(z.literal("")),
  subject: z.string().min(1, "Subject is required").min(3, "Subject must be at least 3 characters").max(200),
  message: z.string().min(1, "Message is required").min(10, "Message must be at least 10 characters").max(1000),
});

type ContactFormData = z.infer<typeof contactSchema>;

const CONTACT_API_ENDPOINT = "https://693ad9ce9b80ba7262cba402.mockapi.io/voya-contact-api/messages";

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
  setIsSubmitting(true);

  const payload = {
    ...data,
    reply: "",
    createdAt: new Date().toISOString(), 
  };

  try {
    const response = await fetch(CONTACT_API_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) throw new Error("Failed");

    toast.success("Message sent successfully!");
    reset();
  } catch (error) {
    toast.error("Something went wrong!");
  } finally {
    setIsSubmitting(false);
  }
};


  return (
    <section className="py-20 px-4 bg-gray-100/30">
      <div className="container max-w-6xl mx-auto grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Leave Us Your Info
          </h2>
          <p className="text-gray-500 mb-8 max-w-md">
            A wonderful serenity has taken possession of my entire soul.
          </p>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Input placeholder="Full Name *" {...register("name")} />
              {errors.name && (
                <p className="mt-1 text-sm text-red-500">{errors.name.message}</p>
              )}
            </div>

            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <Input placeholder="Email Address *" {...register("email")} />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div>
                <Input placeholder="Phone Number" {...register("phone")} />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone.message}</p>
                )}
              </div>
            </div>

            <div>
              <Input placeholder="Subject *" {...register("subject")} />
              {errors.subject && (
                <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>
              )}
            </div>

            <div>
              <textarea
                placeholder="Your Message *"
                rows={5}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-base placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 resize-none md:text-sm"
                {...register("message")}
              />
              {errors.message && (
                <p className="mt-1 text-sm text-red-500">{errors.message.message}</p>
              )}
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>
          </form>
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-8"
        >
          <div>
            <h3 className="font-serif text-2xl font-semibold text-gray-800 mb-4">
              Location
            </h3>
            <p className="text-gray-500">
              123 Travel Street, The Grand Avenue<br />
              San Francisco, CA 94102
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Mail className="h-5 w-5 text-primary" />
              </div>
              <a
                href="mailto:Voya@gmail.com"
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                Voya@gmail.com
              </a>
            </div>

            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <Phone className="h-5 w-5 text-primary" />
              </div>
              <a
                href="tel:+15551234567"
                className="text-gray-500 hover:text-blue-500 transition-colors"
              >
                +1-3524-3356
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ContactForm;
