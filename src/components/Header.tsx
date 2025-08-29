'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Menu, Settings } from 'lucide-react'

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Productos', href: '/#productos-destacados' },
    { name: '¿Por qué elegirnos?', href: '/#por-que-elegir' },
    { name: 'Servicios', href: '/#servicios' },
    { name: 'Proceso', href: '/#proceso' },
    { name: 'Técnica', href: '/tecnicas' },
    { name: 'Contacto', href: '/#contacto' },
  ]

  const handleNavigation = (href: string) => {
    setIsOpen(false)
    if (href.startsWith('/#')) {
      // For anchor links on the home page
      if (window.location.pathname === '/') {
        const elementId = href.substring(2)
        setTimeout(() => {
          document.getElementById(elementId)?.scrollIntoView({ behavior: "smooth" })
        }, 100)
      } else {
        // Navigate to home page with anchor
        router.push(href)
      }
    } else if (href.startsWith('/')) {
      // For regular page navigation
      router.push(href)
    } else {
      // For external links or other cases
      window.location.href = href
    }
  }

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <img
                src="https://assets.zyrosite.com/cdn-cgi/image/format=auto,w=768,fit=crop,q=95/d954ZOkEjGt2xlBk/captura-de-pantalla-2025-06-22-015846-YNq2M59XBxFk08x2.png"
                alt="Agencia 1 Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex gap-6">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => {
              // This will be handled by the main page component
              if (window.location.pathname === '/') {
                // Trigger quote dialog on home page
                window.dispatchEvent(new CustomEvent('open-quote-dialog'))
              } else {
                router.push('/#quote')
              }
            }}>
              Solicitar Cotización
            </Button>
            <Button onClick={() => {
              // Navigate to admin section
              if (window.location.pathname === '/') {
                window.dispatchEvent(new CustomEvent('show-admin-section'))
              } else {
                router.push('/#admin')
              }
            }}>
              <Settings className="mr-2 h-4 w-4" />
              Admin
            </Button>
            
            {/* Mobile menu button */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-6 mt-8">
                  {/* Mobile Navigation */}
                  <nav className="flex flex-col space-y-4">
                    {navigation.map((item) => (
                      <button
                        key={item.name}
                        onClick={() => handleNavigation(item.href)}
                        className="text-left text-gray-700 hover:text-blue-600 transition-colors duration-200 font-medium text-lg"
                      >
                        {item.name}
                      </button>
                    ))}
                  </nav>

                  {/* Mobile Action Buttons */}
                  <div className="border-t pt-6 space-y-4">
                    <Button variant="outline" className="w-full" onClick={() => {
                      setIsOpen(false)
                      if (window.location.pathname === '/') {
                        window.dispatchEvent(new CustomEvent('open-quote-dialog'))
                      } else {
                        router.push('/#quote')
                      }
                    }}>
                      Solicitar Cotización
                    </Button>
                    <Button className="w-full" onClick={() => {
                      setIsOpen(false)
                      if (window.location.pathname === '/') {
                        window.dispatchEvent(new CustomEvent('show-admin-section'))
                      } else {
                        router.push('/#admin')
                      }
                    }}>
                      <Settings className="mr-2 h-4 w-4" />
                      Admin
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}