import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import TanStackProvider from '@/components/TanStackProvider/TanStackProvider';

export default function RootLayout({
  children,
  modal, // 👈 ДОДАЛИ
}: {
  children: React.ReactNode;
  modal: React.ReactNode; // 👈 ДОДАЛИ
}) {
  return (
    <html lang="en">
      <body>
        <TanStackProvider>
          <Header />

          {children}

          {modal} {/* 👈 ОСЬ ТУТ */}

          <Footer />
        </TanStackProvider>
      </body>
    </html>
  );
}