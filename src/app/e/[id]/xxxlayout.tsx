export default function EncounterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // <section className="h-screen grid grid-cols-12 grid-rows-[48px_repeat(5,_1fr)] auto-rows-min">
    // <section className="grid grid-cols-12 grid-rows-6">
    <section className="">{children}</section>
  );
}
