'use client'

import { Suspense } from 'react'
import ActivityContent from './ActivityContent'

export default function ActivitiesPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ActivityContent />
    </Suspense>
  )
}