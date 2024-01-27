<template>
  <div class="p-10">
    <h1 class="text-3xl font-bold mb-8">Client Feedback</h1>

    <div v-if="feedbacks.length === 0" class="text-gray-500">
      No feedback available.
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-3 gap-5">
      <div
        v-for="feedback in feedbacks"
        :key="feedback.id"
        class="mb-8 bg-secondary p-4 rounded-lg"
      >
        <div class="flex items-center mb-4">
          <div class="flex-shrink-0">
            <img
              :src="feedback.avatar"
              alt="Client Avatar"
              class="h-12 w-12 rounded-full object-cover"
            />
          </div>
          <div class="ml-4">
            <h2 class="text-xl font-semibold">{{ feedback.clientName }}</h2>
            <p class="text-gray-300">
              {{ feedback.date }}
            </p>
          </div>
        </div>
        <p class="text-gray-400 text-xs md:text-base">{{ feedback.comment }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const feedbacks = ref([
  {
    id: 1,
    clientName: "John Doe",
    avatar: "https://placekitten.com/200/200",
    date: "January 25, 2024",
    comment: "Great service! I'm satisfied with the results.",
  },
  {
    id: 2,
    clientName: "Jane Smith",
    avatar: "https://placekitten.com/201/201",
    date: "January 26, 2024",
    comment: "Excellent support team! Quick responses and helpful solutions.",
  },
  {
    id: 3,
    clientName: "Bob Johnson",
    avatar: "https://placekitten.com/202/202",
    date: "January 27, 2024",
    comment: "Impressed with the quality of work. Will definitely recommend!",
  },
]);
</script>
