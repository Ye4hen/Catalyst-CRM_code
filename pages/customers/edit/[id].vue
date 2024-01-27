<script setup lang="ts">
import { useMutation, useQuery } from "@tanstack/vue-query";
import { v4 as uuid } from "uuid";
import { COLLECTION_CUSTOMERS, DB_ID, STORAGE_ID } from "~/app.constants";
import type { ICustomer } from "~/types/deals.types";
import { useRouter } from "vue-router";
import { ref } from "vue";

const router = useRouter();

const customerError = ref("");
const isCustomerError = ref(false);

interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

interface ICustomerFormState
  extends Pick<ICustomer, "avatar_url" | "email" | "name" | "from_source"> {}

useSeoMeta({
  title: `Company Editing`,
});

const { data: customers, isLoading } = useQuery({
  queryKey: ["customers"],
  queryFn: () => DB.listDocuments(DB_ID, COLLECTION_CUSTOMERS),
});

const route = useRoute();
const customerId = route.params.id as string;

const { handleSubmit, defineField, setFieldValue, setValues, values } =
  useForm<ICustomerFormState>();

const { data, isSuccess } = useQuery({
  queryKey: ["get customer", customerId],
  queryFn: () => DB.getDocument(DB_ID, COLLECTION_CUSTOMERS, customerId),
});

watch(isSuccess, () => {
  const initialData = data.value as unknown as ICustomerFormState;
  setValues({
    email: initialData.email,
    avatar_url: initialData.avatar_url,
    from_source: initialData.from_source || "",
    name: initialData.name,
  });
});

const [name, nameAttrs] = defineField("name");
const [email, emailAttrs] = defineField("email");
const [fromSource, fromSourceAttrs] = defineField("from_source");

const { mutate, isPending } = useMutation({
  mutationKey: ["update customer", customerId],
  mutationFn: (data: ICustomerFormState) =>
    DB.updateDocument(DB_ID, COLLECTION_CUSTOMERS, customerId, data),
});

const { mutate: uploadImage, isPending: isUploadImagePending } = useMutation({
  mutationKey: ["upload image"],
  mutationFn: (file: File) => storage.createFile(STORAGE_ID, uuid(), file),
  onSuccess(data) {
    const response = storage.getFileDownload(STORAGE_ID, data.$id);
    setFieldValue("avatar_url", response.href);
  },
});

const onSubmit = handleSubmit((values) => {
  const foundCustomer = customers.value?.documents.find(
    (item) => item.email === email.value
  );
  if (name.value && email.value && !foundCustomer) {
    mutate(values);
    setTimeout(() => {
      router.push("/customers");
    }, 1000);
  } else {
    isCustomerError.value = true;
    setTimeout(() => {
      isCustomerError.value = false;
    }, 5000);
    if (foundCustomer) {
      customerError.value = "Such customer already exists";
    } else {
      customerError.value = "Fields 'name' and 'email' are required";
    }
  }
});
</script>

<template>
  <div class="p-10">
    <h1 class="font-bold md:text-2xl text-xl mb-10">
      Editing {{ (data as unknown as ICustomerFormState)?.name }}
    </h1>

    <form @submit="onSubmit" class="form">
      <UiInput
        placeholder="Name"
        v-model="name"
        v-bind="nameAttrs"
        type="text"
        class="border-[#161c26] mb-4 placeholder:text-[#748092] focus:border-border transition-colors"
      />

      <UiInput
        placeholder="Email"
        v-model="email"
        v-bind="emailAttrs"
        type="text"
        class="border-[#161c26] mb-4 placeholder:text-[#748092] focus:border-border transition-colors"
      />
      <UiInput
        placeholder="Where has he/she come from?"
        v-model="fromSource"
        v-bind="fromSourceAttrs"
        type="text"
        class="border-[#161c26] mb-4 placeholder:text-[#748092] focus:border-border transition-colors"
      />

      <img
        v-if="values.avatar_url || isUploadImagePending"
        :src="values.avatar_url"
        alt=""
        width="50"
        height="50"
        class="rounded-full my-4"
      />
      <div
        class="grid w-full max-w-sm items-center gap-1.5 border-[#161c26] mb-4 placeholder:text-[#748092] focus:border-border transition-colors"
      >
        <label>
          <div class="text-sm mb-2">Logo</div>
          <UiInput
            type="file"
            :onchange="(e:InputFileEvent) => e?.target?.files?.length && uploadImage(e.target.files[0])"
            :disabled="isUploadImagePending"
          />
        </label>
      </div>

      <UiButton :disabled="isPending" variant="secondary" class="mt-3 mr-2">
        {{ isPending ? "Loading..." : "Save" }}
      </UiButton>
      <NuxtLink
        href="/customers"
        class="bg-secondary text-secondary-foreground shadow-sm hover:bg-[#354359] py-1 px-2 rounded-md"
      >
        Cancel
      </NuxtLink>
      <UiBadge
        :class="{ 'opacity-100': isCustomerError }"
        variant="outline"
        class="text-[#ffffff] bg-[#ff0000] mx-auto mt-4 max-w-xs transition-opacity opacity-0 text-center"
      >
        {{ customerError }}
      </UiBadge>
    </form>
  </div>
</template>

