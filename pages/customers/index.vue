<script lang="ts" setup>
import { useQuery } from "@tanstack/vue-query";
import { COLLECTION_CUSTOMERS, DB_ID } from "~/app.constants";
import type { ICustomer } from "~/types/deals.types";

useSeoMeta({
  title: "Customers | CatalystCRM System",
});

const { data: customers, isLoading } = useQuery({
  queryKey: ["customers"],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_CUSTOMERS),
});
</script>

<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10">Our customers</h1>
    <div v-if="isLoading">Loading...</div>
    <UiTable v-else>
      <UiTableHeader>
        <UiTableRow
          class="md:table-row md:gap-x-0 grid grid-cols-1 gap-x-2 xs:grid-cols-2"
        >
          <UiTableHead class="w-[200px]">Image</UiTableHead>
          <UiTableHead class="w-[300px]">Name</UiTableHead>
          <UiTableHead class="w-[200px]">Email</UiTableHead>
          <UiTableHead>Where has he/she come from?</UiTableHead>
        </UiTableRow>
      </UiTableHeader>
      <UiTableBody>
        <UiTableRow
          class="md:table-row md:gap-x-0 grid grid-cols-1 gap-x-2 xs:grid-cols-2"
          v-for="customer in (customers?.documents as unknown as ICustomer[])"
          :key="customer.$id"
        >
          <UiTableCell>
            <NuxtImg
              :src="customer.avatar_url"
              :alt="customer.name"
              width="50"
              height="50"
              class="rounded-full"
            />
          </UiTableCell>
          <UiTableCell class="font-medium">
            {{ customer.name }}
          </UiTableCell>
          <UiTableCell>{{ customer.email }}</UiTableCell>
          <UiTableCell>{{ customer.from_source }}</UiTableCell>
          <!-- <UiTableCell>
            <NuxtLink
              :href="`/customers/edit/${customer.$id}`"
              class="border rounded-md border-primary py-2 px-4 hover:border-foreground hover:text-primary transition-all"
            >
              Edit
            </NuxtLink>
          </UiTableCell> -->
        </UiTableRow>
      </UiTableBody>
    </UiTable>
  </div>
</template>
