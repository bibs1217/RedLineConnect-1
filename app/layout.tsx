import type { Metadata } from 'next'
import { AuthProvider } from './providers/auth-provider'

export const metadata: Metadata = {
  title: { default: 'RedLineConnect-1', template: '%s | RedLineConnect-1' },
  description: 'The ultimate platform for golf cart enthusiasts. Custom builds, community, commerce, and AI-powered tools.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <style>{`
          *{box-sizing:border-box;margin:0;padding:0}
          body{background:#0A1628;color:white;font-family:system-ui,-apple-system,sans-serif}
          a{color:inherit;text-decoration:none}
          input,select,textarea,button{font-family:inherit}
          ::-webkit-scrollbar{width:5px}
          ::-webkit-scrollbar-track{background:#1A2940}
          ::-webkit-scrollbar-thumb{background:linear-gradient(180deg,#E63946,#FFB700);border-radius:3px}
          ::selection{background:#E63946;color:white}
          @keyframes redline-shimmer{0%{background-position:200% center}100%{background-position:-200% center}}
          @keyframes glow-pulse{0%,100%{opacity:0.7}50%{opacity:1}}
          .redline-text{background:linear-gradient(90deg,#E63946 0%,#FFB700 40%,#E63946 80%);background-size:200% auto;-webkit-background-clip:text;-webkit-text-fill-color:transparent;background-clip:text;animation:redline-shimmer 2.5s linear infinite}
          .card-hover{transition:transform 0.2s,box-shadow 0.2s}
          .card-hover:hover{transform:translateY(-4px);box-shadow:0 12px 40px rgba(230,57,70,0.2)}
        `}</style>
      </head>
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
