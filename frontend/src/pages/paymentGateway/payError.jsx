import { useRouter } from 'next/router'
import React from 'react'

export default function PayError() {
    const router = useRouter()
  return (
    <div>
        error while paying the amount
    </div>
  )
}
