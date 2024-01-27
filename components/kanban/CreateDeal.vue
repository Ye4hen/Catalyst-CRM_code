<script setup lang="ts">
import { useMutation } from "@tanstack/vue-query";
import { v4 as uuid } from "uuid";
import { defineProps, ref, onMounted, watchEffect } from "vue";
import { COLLECTION_DEALS, COLLECTION_CUSTOMERS, DB_ID } from "~/app.constants";
import type { ICustomer } from "~/types/deals.types";
import { useQuery } from "@tanstack/vue-query";
import type { IDeal } from "~/types/deals.types";

const isOpenForm = ref(false);

interface IDealFormState extends Pick<IDeal, "name" | "price"> {
  customers: {
    email: string;
    name: string;
  };
  status: string;
}

const dealError = ref("");
const isDealError = ref(false);

const props = defineProps({
  status: {
    type: String,
    default: "",
  },
  refetch: {
    type: Function,
  },
});

const { handleSubmit, defineField, handleReset } = useForm<IDealFormState>({
  initialValues: {
    status: props.status,
  },
});

const { data: customers, isLoading } = useQuery({
  queryKey: ["customers"],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_CUSTOMERS),
});

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isPriceValid = (dealPrice: number) => {
  if (dealPrice > 0) return true;
  return false;
};

const [name, nameAttrs] = defineField("name");
const [price, priceAttrs] = defineField("price");
const [customerEmail, customerEmailAttrs] = defineField("customers.email");
const [customerName, customerNameAttrs] = defineField("customers.name");
const customer = defineField("customers");

const { mutate, isPending } = useMutation({
  mutationKey: ["create a new deal"],
  mutationFn: (data: IDealFormState) =>
    DB.createDocument(DB_ID, COLLECTION_DEALS, uuid(), data),

  onSuccess() {
    props.refetch && props.refetch();
    handleReset();
  },
});

const areInputsEmpty = computed(() => {
  if (
    !customerName.value ||
    !name.value ||
    !price.value ||
    !customerEmail.value
  )
    return true;
  return false;
});

const onSubmit = handleSubmit((values) => {
  const foundCustomer = customers.value?.documents.find(
    (item) => item.email === customerEmail.value
  );
  if (
    isValidEmail(customerEmail.value) &&
    isPriceValid(price.value) &&
    !foundCustomer
  ) {
    mutate(values);
  } else {
    isDealError.value = true;
    setTimeout(() => {
      isDealError.value = false;
    }, 5000);
    if (!isValidEmail(customerEmail.value)) {
      dealError.value = "Provide valid email";
    } else if (!isPriceValid(price.value)) {
      dealError.value = "Provide valid price";
    } else if (foundCustomer) {
      dealError.value = "Customer can only have one deal";
    }
  }
});
</script>

<template>
  <div class="text-center mb-2">
    <button
      class="transition-all opacity-5 hover:opacity-100 hover:text-[#a252c8]"
      @click="isOpenForm = !isOpenForm"
    >
      <Icon
        v-if="isOpenForm"
        name="radix-icons:arrow-up"
        class="fade-in-100 fade-out-0"
        size="35"
      />
      <Icon
        v-else
        name="radix-icons:plus-circled"
        class="fade-in-100 fade-out-0"
        size="35"
      />
    </button>
  </div>
  <form v-if="isOpenForm" @submit="onSubmit" class="form">
    <UiInput
      placeholder="Title"
      v-model="name"
      v-bind="nameAttrs"
      type="text"
      class="input"
    />
    <UiInput
      placeholder="Price"
      v-model="price"
      v-bind="priceAttrs"
      type="number"
      class="input"
    />
    <UiInput
      placeholder="Email"
      v-model="customerEmail"
      v-bind="customerEmailAttrs"
      type="email"
      class="input"
    />
    <UiInput
      placeholder="Company"
      v-model="customerName"
      v-bind="customerNameAttrs"
      type="text"
      class="input"
    />

    <button
      class="btn"
      :class="{ 'opacity-80': areInputsEmpty }"
      :disabled="isPending || areInputsEmpty"
    >
      {{ isPending ? "Loading..." : "Add" }}
    </button>
    <UiBadge
      :class="{ 'opacity-100': isDealError }"
      variant="outline"
      class="text-[#ffffff] bg-[#ff0000] mx-auto mt-4 max-w-xs transition-opacity opacity-0 text-center"
    >
      {{ dealError }}
    </UiBadge>
  </form>
</template>

<style scoped>
.input {
  @apply border-[#161c26] mb-2 placeholder:text-[#748092] focus:border-border transition-colors;
}

.btn {
  @apply text-xs border py-1 px-2 rounded border-[#161c26] hover:border-[#482c65] transition-colors text-[#aebed5] hover:text-white;
}

.form {
  @apply mb-3 block;
  animation: show 0.3s ease-in-out;
}

@keyframes show {
  from {
    @apply border-[#a252c83d];
    transform: translateY(-35px);
    opacity: 0.4;
  }

  90% {
    @apply border-[#a252c83d];
  }

  to {
    @apply border-transparent;
    transform: translateY(0);
    opacity: 1;
  }
}
</style>
