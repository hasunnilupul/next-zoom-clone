import StreamClientProvider from '@/providers/StreamClientProvider';
import { Metadata } from 'next';
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: "Yoom",
  description: "Zoom clone developed using Next.js",
  icons: {
    icon: "/icons/logo.svg"
  }
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <main>
      <StreamClientProvider>
        {children}
      </StreamClientProvider>
    </main>
  )
}

export default RootLayout;