import Header from "@/components/header";

export default function PatrolLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en">
        <body
          className=''>
            <Header />
          {children}
        </body>
      </html>
    );
  }