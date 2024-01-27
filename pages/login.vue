<script setup lang="ts">
import { v4 as uuid } from "uuid";
import { useQuery } from "@tanstack/vue-query";
import { COLLECTION_CUSTOMERS, DB_ID } from "~/app.constants";

useSeoMeta({
  title: "Login | CatalystCRM System",
});

const emailRef = ref("");
const passwordRef = ref("");
const nameRef = ref("");
const loginError = ref("");
const isLoginError = ref(false);

const isLoadingStore = useIsLoadingStore();
const authStore = useAuthStore();
const router = useRouter();

const isValidEmail = (email: string) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidPass = (pass: string) => {
  if (pass.length > 7) return true;
  else return false;
};

const login = async () => {
  try {
    await account.createEmailSession(emailRef.value, passwordRef.value);
    const response = await account.get();

    if (response) {
      isLoadingStore.set(true);
      authStore.set({
        email: response.email,
        name: response.name,
        status: response.status,
      });
      await router.push("/");
    } else {
      isLoginError.value = true;
      loginError.value = "Invalid login credentials";
    }
  } catch (error) {
    isLoginError.value = true;
    setTimeout(() => {
      isLoginError.value = false;
    }, 5000);
    if (emailRef.value && !isValidEmail(emailRef.value)) {
      loginError.value = "Provide valid email";
    } else if (passwordRef.value && !isValidPass(passwordRef.value)) {
      loginError.value = "Password must be at least 8 characters length";
    } else if (!emailRef.value || !passwordRef.value || !nameRef.value) {
      loginError.value = "Fill all fields";
    } else {
      loginError.value =
        "There are no such users. Verify credentials or sign up!";
    }
  } finally {
    isLoadingStore.set(false);
  }
};

const register = async () => {
  try {
    // await account.createEmailSession(emailRef.value, passwordRef.value);
    // const existingUser = await account.get();

    // if (existingUser) {
    //   isLoginError.value = true;
    //   loginError.value =
    //     "This user already exists. Change credentials or log in!";
    //   setTimeout(() => {
    //     isLoginError.value = false;
    //   }, 3000);
    // } else {
    if (
      emailRef.value &&
      isValidEmail(emailRef.value) &&
      passwordRef.value &&
      isValidPass(passwordRef.value) &&
      nameRef.value
    ) {
      await account.create(
        uuid(),
        emailRef.value,
        passwordRef.value,
        nameRef.value
      );
      await login();
    } else {
      isLoginError.value = true;
      setTimeout(() => {
        isLoginError.value = false;
      }, 3000);
      if (!emailRef.value && !passwordRef.value && !nameRef.value) {
        loginError.value = "Fill all fields";
      } else if (passwordRef.value && !isValidPass(passwordRef.value)) {
        loginError.value = "Password must be at least 8 characters length";
      } else if (emailRef.value && !isValidEmail(emailRef.value)) {
        loginError.value = "Provide valid email";
      } else {
        loginError.value =
          "This user already exists. Change credentials or log in!";
      }
      //   }
    }
  } catch (error) {
    console.error("Error checking user existence:", error);
    isLoginError.value = true;
    loginError.value =
      "Error checking user existence. Please, login if you already have an account or try again later😘.";
    setTimeout(() => {
      isLoginError.value = false;
    }, 5000);
  }
};
</script>

<template>
  <div class="flex items-center justify-center min-h-screen w-full">
    <UiBadge
      :class="{ 'opacity-100 pointer-events-auto': isLoginError }"
      variant="outline"
      class="text-[#ffffff] bg-[#ff0000] absolute top-[15%] mx-auto max-w-xs transition-opacity opacity-0 text-center pointer-events-none"
    >
      {{ loginError }}
    </UiBadge>
    <div class="rounded bg-sidebar w-full p-5 m-5 md:w-[31.25rem] md:m-0">
      <h1 class="text-2xl font-bold text-center mb-5">Login</h1>

      <form>
        <UiInput
          placeholder="Email"
          type="email"
          class="mb-3"
          v-model.trim="emailRef"
        />
        <UiInput
          placeholder="Password"
          type="password"
          class="mb-3"
          v-model.trim="passwordRef"
        />
        <UiInput
          placeholder="Name"
          type="name"
          class="mb-3"
          v-model.trim="nameRef"
        />
        <div class="flex items-center justify-center flex-wrap gap-5">
          <UiButton type="button" @click="login">Login</UiButton>
          <UiButton type="button" @click="register">Register</UiButton>
        </div>
      </form>
    </div>
  </div>
</template>
