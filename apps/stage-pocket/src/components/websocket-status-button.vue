<script setup lang="ts">
import { useModsServerChannelStore } from '@proj-airi/stage-ui/stores/mods/api/channel-server'
import { storeToRefs } from 'pinia'
import { TooltipContent, TooltipProvider, TooltipRoot, TooltipTrigger } from 'reka-ui'
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'

const { t } = useI18n()
const router = useRouter()
const { connected } = storeToRefs(useModsServerChannelStore())

const flickerDuration = ref('6.4s')
const flickerDelay = ref('0s')

const statusSize = {
  border: 'border-2',
  icon: 'size-6',
  padding: 'p-2.5',
} as const

const buttonClass = computed(() => {
  return [
    statusSize.border,
    statusSize.padding,
    'transition-all duration-300 ease-in-out',
    'border-solid rounded-xl backdrop-blur-md',
    'w-fit flex items-center self-end justify-center',
    connected.value
      ? 'border-emerald-200/60 bg-white/85 hover:bg-emerald-50/90 dark:border-emerald-400/15 dark:bg-neutral-900/75 dark:hover:bg-neutral-900/88'
      : 'border-amber-300/80 bg-amber-50/90 hover:bg-amber-100/90 dark:border-amber-400/30 dark:bg-amber-950/25 dark:hover:bg-amber-950/38',
  ]
})

const iconClasses = computed(() => {
  return [
    connected.value ? 'i-ph:wifi-high' : 'i-ph:wifi-slash pocket-ws-status-flicker',
    statusSize.icon,
    'shrink-0 transition-colors duration-300 ease-in-out',
    connected.value
      ? 'text-emerald-600 dark:text-emerald-300'
      : 'text-amber-600 dark:text-amber-300',
  ]
})

const iconStyle = computed(() => {
  if (connected.value) {
    return undefined
  }

  return {
    '--pocket-ws-flicker-delay': flickerDelay.value,
    '--pocket-ws-flicker-duration': flickerDuration.value,
  }
})

const buttonLabel = computed(() => {
  return connected.value
    ? t('stage.websocket-status.connected')
    : t('stage.websocket-status.disconnected')
})

const tooltipLabel = computed(() => {
  return `${buttonLabel.value}. ${t('stage.websocket-status.open-settings')}`
})

function randomizeFlicker(resetPhase = false) {
  flickerDuration.value = `${(5.8 + Math.random() * 1.8).toFixed(2)}s`

  if (resetPhase) {
    flickerDelay.value = `${(-Math.random() * 5.4).toFixed(2)}s`
    return
  }

  flickerDelay.value = '0s'
}

function handleFlickerIteration() {
  if (!connected.value) {
    randomizeFlicker()
  }
}

watch(connected, (isConnected) => {
  if (isConnected) {
    flickerDelay.value = '0s'
    return
  }

  randomizeFlicker(true)
}, { immediate: true })

function openConnectionSettings() {
  void router.push('/settings/connection')
}
</script>

<template>
  <div
    class="fixed right-3 z-20"
    :style="{ top: 'max(0.75rem, env(safe-area-inset-top, 0px))' }"
  >
    <TooltipProvider :delay-duration="0" :skip-delay-duration="0">
      <TooltipRoot>
        <TooltipTrigger as-child>
          <button
            type="button"
            :class="buttonClass"
            :aria-label="tooltipLabel"
            :title="tooltipLabel"
            @click="openConnectionSettings"
          >
            <div
              :class="iconClasses"
              :style="iconStyle"
              @animationiteration="handleFlickerIteration"
            />
          </button>
        </TooltipTrigger>
        <Transition name="pocket-ws-tooltip-fade">
          <TooltipContent
            :class="[
              'border border-solid border-neutral-200/60 dark:border-neutral-800/10',
              'bg-neutral-50/80 dark:bg-neutral-800/70',
              'w-fit flex items-center px-1.5 py-1 rounded-lg backdrop-blur-md text-xs',
            ]"
            side="left"
            :side-offset="4"
          >
            {{ tooltipLabel }}
          </TooltipContent>
        </Transition>
      </TooltipRoot>
    </TooltipProvider>
  </div>
</template>

<style scoped>
.pocket-ws-tooltip-fade-enter-active,
.pocket-ws-tooltip-fade-leave-active {
  transition: opacity 0.2s ease-in-out;
}

.pocket-ws-tooltip-fade-enter-from,
.pocket-ws-tooltip-fade-leave-to {
  opacity: 0;
}

.pocket-ws-tooltip-fade-enter-to,
.pocket-ws-tooltip-fade-leave-from {
  opacity: 1;
}

@keyframes pocket-ws-lamp-flicker {
  0%,
  6%,
  22%,
  33%,
  52%,
  68%,
  86%,
  100% {
    opacity: 1;
  }

  3% {
    opacity: 0.74;
  }

  9% {
    opacity: 0.92;
  }

  13% {
    opacity: 0.38;
  }

  18% {
    opacity: 0.58;
  }

  27% {
    opacity: 0.44;
  }

  29% {
    opacity: 0.84;
  }

  41% {
    opacity: 0.42;
  }

  45% {
    opacity: 0.88;
  }

  57% {
    opacity: 0.62;
  }

  61% {
    opacity: 0.8;
  }

  73% {
    opacity: 0.36;
  }

  74.4% {
    opacity: 0.08;
  }

  75.2% {
    opacity: 0.82;
  }

  78% {
    opacity: 0.94;
  }

  91% {
    opacity: 0.52;
  }
}

.pocket-ws-status-flicker {
  animation-delay: var(--pocket-ws-flicker-delay, 0s);
  animation-duration: var(--pocket-ws-flicker-duration, 6.4s);
  animation-iteration-count: infinite;
  animation-name: pocket-ws-lamp-flicker;
  animation-timing-function: ease-in-out;
  filter: drop-shadow(0 0 0.14rem rgb(251 191 36 / 0.18));
  will-change: opacity;
}
</style>
