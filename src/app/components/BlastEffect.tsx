'use client'

import { useEffect } from 'react'
import confetti from 'canvas-confetti'

interface BlastEffectProps {
  onComplete: () => void
}

const emojis = [
  '🎉', '🎊', '🥳', '🌟', '💯', '🏆', '🎁', '💥', '🌈', '✨', '🔥',
  '💪', '🙌', '👏', '💖', '💫', '🏅', '🎯', '👑', '🌞', '🚀',
  '🏅', '⚡', '🥇', '🧩', '🏆', '💥', '🚨', '💥', '🧨', '🏁', '🎯', '💎'
];

export default function BlastEffect({ onComplete }: BlastEffectProps) {
  useEffect(() => {
    const duration = 3000 // 1.5 seconds
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = window.setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        clearInterval(interval) // Clear the interval
        onComplete() // Trigger the callback once
        return
      }

      const particleCount = 90 * (timeLeft / duration)

      // Confetti effect
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: 0 },
      })

      // Bottom-center upwards
      confetti({
        ...defaults,
        particleCount,
        angle: 270, // Direction in degrees
        origin: { x: 0.5, y: 1 } // Start from bottom-center
      })

       // Top-left to bottom-right
       confetti({
        ...defaults,
        particleCount,
        angle: 45, // Direction in degrees
        origin: { x: 0, y: 0 } // Start from top-left
      })

      // Top-right to bottom-left
      confetti({
        ...defaults,
        particleCount,
        angle: 135, // Direction in degrees
        origin: { x: 1, y: 0 } // Start from top-right
      })


      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: 0 },
      })

      const numberOfEmojis = 50 // Number of emojis to generate per blast

      for (let i = 0; i < numberOfEmojis; i++) {
        const emoji = emojis[Math.floor(Math.random() * emojis.length)]
        const emojiConfetti = document.createElement('div')
        emojiConfetti.textContent = emoji
        emojiConfetti.style.position = 'fixed'
        emojiConfetti.style.zIndex = '10001'
        emojiConfetti.style.fontSize = `${randomInRange(1, 2)}rem` // Randomize size for variety
        // Emojis from the top-left corner
        if (Math.random() > 0.5) {
          // Start from the top-left corner
          emojiConfetti.style.left = `0vw`
          emojiConfetti.style.top = `0vh`
        } else {
          // Start from the top-right corner
          emojiConfetti.style.left = `100vw` // Right edge of the screen
          emojiConfetti.style.top = `0vh`
        }
        document.body.appendChild(emojiConfetti)

        // Random spread from the top-left corner
        const angle = Math.random() * Math.PI * 2; // Random angle for spreading in all directions
        const distance = randomInRange(5, 90); // Random distance from the origin (top-left corner)

        const xOffset = distance * Math.cos(angle); // Calculate X offset based on the angle
        const yOffset = distance * Math.sin(angle); // Calculate Y offset based on the angle

        // Animate the emoji to fall to the bottom
        setTimeout(() => {
          emojiConfetti.style.transition = 'transform 3s ease-out, opacity 2s'
          emojiConfetti.style.transform = `translate(${xOffset}vw, ${yOffset}vh) translateY(100vh)` // Spread and fall down
          emojiConfetti.style.opacity = '0' // Make it fade out as it falls

          // After the emoji falls, remove it from the DOM
          setTimeout(() => {
            emojiConfetti.remove()
          }, 2000)
        }, 0)
      }
    }, 250)



    return () => clearInterval(interval) // Cleanup on unmount
  }, [onComplete])

  return null
}
