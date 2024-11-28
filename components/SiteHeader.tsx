'use client'

import Link from 'next/link'

export default function SiteHeader() {
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-4">
            {/* Replace src with your actual logo */}
            <img 
              src="/images/logo.png" 
              alt="Macmillan Language School" 
              className="h-12 w-auto"
            />
            <h1 className="text-2xl md:text-3xl font-bold">
              Macmillan Language School
            </h1>
          </Link>
        </div>
      </div>
    </header>
  )
}