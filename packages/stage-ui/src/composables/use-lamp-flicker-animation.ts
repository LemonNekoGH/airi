import type { MaybeRefOrGetter } from 'vue'

import { computed, ref, toValue, watch } from 'vue'

/** Matches `.lamp-flicker-animation` in `@proj-airi/stage-ui/styles/lamp-flicker.css` (import that CSS once per app). */
export const lampFlickerAnimationClass = 'lamp-flicker-animation' as const

const LAMP_FLICKER_DELAY_VAR = '--lamp-flicker-delay'
const LAMP_FLICKER_DURATION_VAR = '--lamp-flicker-duration'

/**
 * Drives randomized keyframe timing for the shared lamp-flicker CSS while `flickerActive` is true.
 * When inactive, delay resets to 0s so the element looks steady.
 */
export function useLampFlickerAnimation(flickerActive: MaybeRefOrGetter<boolean>) {
  const flickerDuration = ref('6.4s')
  const flickerDelay = ref('0s')

  function randomizeFlicker(resetPhase = false) {
    flickerDuration.value = `${(5.8 + Math.random() * 1.8).toFixed(2)}s`

    if (resetPhase) {
      flickerDelay.value = `${(-Math.random() * 5.4).toFixed(2)}s`
      return
    }

    flickerDelay.value = '0s'
  }

  function onAnimationIteration() {
    if (toValue(flickerActive)) {
      randomizeFlicker()
    }
  }

  watch(
    () => toValue(flickerActive),
    (active) => {
      if (!active) {
        flickerDelay.value = '0s'
        return
      }

      randomizeFlicker(true)
    },
    { immediate: true },
  )

  const flickerStyle = computed(() => {
    if (!toValue(flickerActive)) {
      return undefined
    }

    return {
      [LAMP_FLICKER_DELAY_VAR]: flickerDelay.value,
      [LAMP_FLICKER_DURATION_VAR]: flickerDuration.value,
    } as Record<string, string>
  })

  return {
    flickerStyle,
    onAnimationIteration,
  }
}
