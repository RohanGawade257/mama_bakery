import PageContainer from "../../components/layout/PageContainer.jsx";

const ContactPage = () => (
  <PageContainer>
    <div className="grid gap-6 lg:grid-cols-[1fr,340px]">
      <div className="flame-card p-6 sm:p-8">
        <h1 className="page-title text-[#4a4039]">Contact Us</h1>
        <p className="mt-3 text-[#6e6158]">
          For custom cakes, event catering, and bulk orders, contact our team.
        </p>
        <div className="mt-5 space-y-3 text-[#5f554e]">
          <p>
            <span className="font-semibold">Phone:</span> +91 98765 43210
          </p>
          <p>
            <span className="font-semibold">Email:</span> hello@mama-bakery.com
          </p>
          <p>
            <span className="font-semibold">Address:</span> Panaji, Goa
          </p>
        </div>
      </div>

      <div className="flame-card p-5">
        <h2 className="text-xl text-[#4a4039]">Business Hours</h2>
        <ul className="mt-4 space-y-2 text-sm text-[#6f6259]">
          <li>Monday to Friday: 9:00 AM - 9:00 PM</li>
          <li>Saturday: 9:00 AM - 10:00 PM</li>
          <li>Sunday: 10:00 AM - 8:00 PM</li>
        </ul>
      </div>
    </div>
  </PageContainer>
);

export default ContactPage;

