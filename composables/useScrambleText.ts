import { ref, onMounted, onBeforeUnmount } from 'vue'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()'

export function useScrambleText(text: string) {
  const output = ref(text)
  let frame = 0
  let rafId: number

  const animate = () => {
    frame++

    output.value = text
      .split('')
      .map((char, i) => {
        if (char === ' ') return ' '
        return i < frame % (text.length + 1)
          ? char
          : CHARS[Math.floor(Math.random() * CHARS.length)]
      })
      .join('')

    rafId = requestAnimationFrame(animate)
  }

  onMounted(() => {
    rafId = requestAnimationFrame(animate)
  })

  onBeforeUnmount(() => {
    cancelAnimationFrame(rafId)
  })

  return output
}
