export const metadata = { title: 'Contact' };

export default function Contact() {
  const email = process.env.CONTACT_EMAIL || 'contact@example.com';
  return (
    <div className="max-w-2xl space-y-4 leading-relaxed text-slate-300">
      <h1 className="text-3xl font-bold text-white">Contact</h1>
      <p>Questions, movie requests or removal requests? Write to us and we will reply as soon as we can.</p>
      <a href={`mailto:${email}`} className="inline-block rounded-lg bg-brand px-5 py-3 font-semibold text-white hover:bg-brand2">{email}</a>
    </div>
  );
}
