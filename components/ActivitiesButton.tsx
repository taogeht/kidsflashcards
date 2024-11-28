import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { BookOpen } from 'lucide-react'

export default function ActivitiesButton() {
  return (
    <Link href="/activities" passHref>
      <Button className="w-full mt-8 py-8 text-2xl">
        <BookOpen className="w-8 h-8 mr-2" />
        Activities
      </Button>
    </Link>
  )
}

