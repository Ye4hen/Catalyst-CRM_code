<script setup lang="ts">
import { generateColumnStyle } from "@/components/kanban/generate-gradient";
import { useKanbanQuery } from "@/components/kanban/useKanbanQuery";
import { convertCurrency } from "@/utils/convertCurrency";
import { useMutation } from "@tanstack/vue-query";
import dayjs from "dayjs";
import { COLLECTION_DEALS, DB_ID } from "~/app.constants";
import type { ICard, IColumn } from "~/components/kanban/kanban.types";
import { useDealSlideStore } from "~/store/deal-slide.store";
import type { EnumStatus } from "~/types/deals.types";
import { useAuthStore, useIsLoadingStore } from "~/store/auth.store";

const storeAuth = useAuthStore();
const isLoadingStore = useIsLoadingStore();
const isDeleting = reactive<Record<string, boolean>>({});

useSeoMeta({
  title: "Home | CatalystCRM System",
});

const dragCardRef = ref<ICard | null>(null);
const sourceColumnRef = ref<IColumn | null>(null);
const { data, isLoading, refetch } = useKanbanQuery();
const store = useDealSlideStore();

type TypeMutationVariables = {
  docId: string;
  status?: EnumStatus;
};

const { mutate } = useMutation({
  mutationKey: ["move card"],
  mutationFn: ({ docId, status }: TypeMutationVariables) =>
    DB.updateDocument(DB_ID, COLLECTION_DEALS, docId, {
      status,
    }),
  onSuccess: () => {
    refetch();
  },
});

function handleDragStart(card: ICard, column: IColumn) {
  dragCardRef.value = card;
  sourceColumnRef.value = column;
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
}

function handleDrop(targetColumn: IColumn) {
  if (dragCardRef.value && sourceColumnRef.value) {
    mutate({ docId: dragCardRef.value.id, status: targetColumn.id });
  }
}

async function onDeleteDeal(cardId: string) {
  try {
    isDeleting[cardId] = true;
    await DB.deleteDocument(DB_ID, COLLECTION_DEALS, cardId);
    refetch();
  } catch (error) {
    console.error("Error deleting document:", error);
  } finally {
    isDeleting[cardId] = false;
  }
}
</script>

<template>
  <div class="p-10">
    <h1 class="font-bold text-2xl mb-10 lg:text-start text-center">
      CatalystCRM
    </h1>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div
        class="flex lg:justify-between justify-center lg:gap-x-8 gap-x-6 lg:gap-y-8 gap-y-4 flex-wrap"
      >
        <div
          v-for="(column, index) in data"
          :key="column.id"
          @dragover="handleDragOver"
          @drop="() => handleDrop(column)"
          class="w-48"
        >
          <div
            class="rounded bg-slate-700 py-1 px-5 mb-2 text-center"
            :style="generateColumnStyle(index, data?.length)"
          >
            {{ column.name }}
          </div>
          <div>
            <KanbanCreateDeal :refetch="refetch" :status="column.id" />
            <UiCard
              v-for="card in column.items"
              :key="card.id"
              class="mb-5 w-48"
              draggable="true"
              @dragstart="() => handleDragStart(card, column)"
            >
              <UiCardHeader role="button" @click="store.set(card)">
                <UiCardTitle>{{ card.name }}</UiCardTitle>

                <UiCardDescription class="mt-2 block">
                  <!--{{ convertCurrency(card.price) }}-->
                  ${{ card.price }}
                </UiCardDescription>
              </UiCardHeader>
              <UiCardContent
                class="text-xs"
                role="button"
                @click="store.set(card)"
              >
                <div>Company</div>
                {{ card.companyName }}</UiCardContent
              >
              <UiCardFooter class="grid gap-2">
                <span>
                  {{ dayjs(card.$createdAt).format("DD MMMM YYYY") }}
                </span>
                <button
                  type="button"
                  class="relative z-[3] mt-2 border border-foreground rounded-md py-1 px-2 transition-all hover:text-primary hover:border-primary"
                  :disabled="isDeleting[card.id]"
                  @click.prevent="onDeleteDeal(card.id)"
                >
                  {{ isDeleting[card.id] ? "Deleting..." : "Delete" }}
                </button>
              </UiCardFooter>
            </UiCard>
          </div>
        </div>
      </div>
      <KanbanSlideover />
    </div>
  </div>
</template>
