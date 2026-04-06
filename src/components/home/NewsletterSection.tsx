import { useState } from "react";
import { Mail, Send } from "lucide-react";
import { Button } from "@/components/UI/Button";
import { Input } from "@/components/UI/Input";
import { useToast } from "@/components/UI/use-toast2";
import emailjs from "emailjs-com";

export const NewsletterSection = () => {
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

         
    emailjs
      .send(
        "service_y5m44xi",    // service ID 
        "template_597vzfq",    // template ID
        { user_email: email }, //template parameters
        "Q7rYCbg8yztdmO1xU"      // public key
      )
      .then(() => {
        toast({
          title: "Subscribed!",
          description: "A confirmation email has been sent to you 🎉",
        });

        setEmail("");
      })
      .catch((err) => {
        console.error("EmailJS Error:", err);
        toast({
          title: "Error",
          description: "Something went wrong while sending email.",
        });
      });
  };

  return (
    <section className="py-16 bg-secondary/50">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary/10 mb-6">
            <Mail className="h-8 w-8 text-primary" />
          </div>

          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-3">
            Don't miss a thing
          </h2>
          <p className="text-muted-foreground mb-8">
            Get update to special deals and exclusive offers.
            <br />
            Sign up to our newsletter!
          </p>

          <form onSubmit={handleSubmit} className="flex gap-3 max-w-md mx-auto">
            <Input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 bg-background"
              required
            />
            <Button type="submit" className="gap-2">
              <Send className="h-4 w-4" />
              Subscribe
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
};
