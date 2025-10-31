<template>
  <u-dashboard-panel
    id="inbox-1"
    resizable
    :default-size="40"
    :min-size="35"
    :max-size="55"
  >
    <UContainer>
      <div class="max-w-5xl">
        <div class="px-4 pt-6">
          <h1 class="text-3xl font-semibold">Add Location</h1>
          <p class="mt-2 text-sm">
            A location is a place you have traveled or will travel to. It can be
            a city, country, state or point of interest. You can add specific
            times you visited this location after adding it.
          </p>
        </div>
        <!-- Add Inputs -->
        <DashboardFormsAddForm class="mt-4" />
      </div>
    </UContainer>
  </u-dashboard-panel>
</template>
