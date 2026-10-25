<script setup lang="ts">
const { steps } = usePanduan()
</script>

<template>
  <div class="flex flex-col gap-5">
    <PageHeader
      title="Panduan Admin"
      subtitle="Langkah penggunaan sistem pendataan warga Desa Sunggumanai"
    >
      <template #actions>
        <AppButton variant="secondary" to="/dashboard">Kembali ke Dashboard</AppButton>
      </template>
    </PageHeader>

    <AppCard :padding="6" class="flex flex-col gap-5">
      <div class="flex flex-col gap-1 border-b border-line pb-5">
        <h2 class="text-20 font-semibold text-ink">Cara menggunakan sistem</h2>
        <p class="text-14 text-ink-muted">
          Ikuti langkah berikut untuk mengelola data warga, mencatat kematian, dan membaca laporan.
        </p>
      </div>

      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-5">
        <AppCard
          v-for="step in steps"
          :key="step.number"
          :padding="5"
          class="flex min-h-[244px] flex-col gap-4"
        >
          <div class="flex items-start gap-3">
            <div class="flex size-[36px] shrink-0 items-center justify-center rounded-chip bg-brand-100">
              <span class="text-16 font-bold text-brand-700">{{ step.number }}</span>
            </div>
            <div class="flex min-w-0 flex-col gap-1">
              <p class="text-16 font-semibold text-ink">{{ step.title }}</p>
              <p class="text-13 text-ink-muted">{{ step.description }}</p>
            </div>
          </div>

          <ul class="flex flex-1 flex-col gap-2 pl-[49px]">
            <li v-for="point in step.points" :key="point" class="flex gap-2 text-13 text-ink">
              <span class="mt-[6px] size-[6px] shrink-0 rounded-full bg-brand-500" aria-hidden="true" />
              <span>{{ point }}</span>
            </li>
          </ul>

          <AppButton v-if="step.to && step.action" variant="secondary" :to="step.to" class="self-start">
            {{ step.action }}
          </AppButton>
        </AppCard>
      </div>
    </AppCard>
  </div>
</template>
