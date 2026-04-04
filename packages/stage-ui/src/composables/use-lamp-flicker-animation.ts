import type { MaybeRefOrGetter } from 'vue'

import { computed, ref, toValue, watch } from 'vue'

/** CSS custom property names bound to animation-delay and animation-duration. */
export interface LampFlickerCssVars {
  delay: string
  duration: string
}

/**
 * Drives randomized keyframe timing for a “lamp flicker” opacity animation while `flickerActive` is true.
 * When inactive, delay resets to 0s so the icon looks steady.
 */
export function useLampFlickerAnimation(
  flickerActive: MaybeRefOrGetter<boolean>,
  cssVars: LampFlickerCssVars,
) {
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
      [cssVars.delay]: flickerDelay.value,
      [cssVars.duration]: flickerDuration.value,
    } as Record<string, string>
  })

  return {
    flickerStyle,
    onAnimationIteration,
  }
}
