'use client'
import { useEffect } from 'react'
import Lenis from '@studio-freight/lenis'

export default function useLenis() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1, // try 1 to 1.1 for better control
      easing: (t) => t, // linear easing avoids overspeed at the end
      smooth: true,
    })

    lenis.on('scroll', ({ scroll }) => {
      console.log('scroll position:', scroll)
    })

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)

    return () => {
      lenis.destroy()
    }
  }, [])
}
