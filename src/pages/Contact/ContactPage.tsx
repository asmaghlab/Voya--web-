import { Helmet } from "react-helmet-async";
import Hero from "./Hero";
import ContactCards from "./ContactCards";
import ContactForm from "./ContactForm";
import Map from "./Map";
import CTA from "./CTAA";

const ContactPage = () => {
  return (
    <>
      <Helmet>
        <title>Voya | Contact Us</title>
        <meta
          name="description"
          content="Get in touch with Travel Tour. We're here to help you plan your next adventure. Contact us via phone, email, or visit our office."
        />
        <meta property="og:title" content="Contact Us | Travel Tour" />
        <meta
          property="og:description"
          content="Get in touch with Travel Tour. We're here to help you plan your next adventure."
        />
        <link rel="canonical" href="/contact" />
      </Helmet>

      <main className="min-h-screen bg-gray-50">
        <Hero />
        <ContactCards />
        <ContactForm />
        <Map />
        <CTA />

        {/* Footer spacer */}
        <div className="h-8" />
      </main>
    </>
  );
};

export default ContactPage;
