<template>
  <u-dashboard-panel id="inbox-1" resizable>
    <UContainer class="my-10">
      <div class="mx-auto grid max-w-5xl grid-cols-2 gap-4">
        <div class="my-10 px-4 py-6">
          <h1 class="mb-4 text-6xl font-semibold">Add Location</h1>
          <p>
            A location is a place you have traveled or will travel to. It can be
            a city, country, state or point of interest. You can add specific
            times you visited this location after adding it.
          </p>
        </div>
        <!-- Add Inputs -->
        <DashboardAddLocationAddForm class="mt-4" />
      </div>
    </UContainer>
  </u-dashboard-panel>
</template>
