<script lang="ts" setup>
import { useAuthStore, useIsLoadingStore } from "~/store/auth.store";
import { ref } from "vue";

const store = useAuthStore();
const isLoadingStore = useIsLoadingStore();
const router = useRouter();

const logout = async () => {
  isLoadingStore.set(true);
  await account.deleteSession("current");
  store.clear();
  await router.push("/login");
  isLoadingStore.set(false);
};

function openMenu() {
  const menu = document.querySelector(".menu");
  const higherMenu = document.querySelector(".higher-menu");
  menu.classList.toggle("menu-open");
  higherMenu.classList.toggle("menu-after");
  document.body.classList.toggle("_lock");
}

function closeMenu() {
  const menu = document.querySelector(".menu");
  const higherMenu = document.querySelector(".higher-menu");
  menu.classList.remove("menu-open");
  higherMenu.classList.remove("menu-after");
  document.body.classList.remove("_lock");
}
</script>

<template>
  <aside class="px-5 py-8 bg-sidebar h-full relative w-full">
    <div
      class="flex justify-between items-center lg:grid lg:justify-normal lg:items-stretch gap-y-10 higher-menu"
    >
      <NuxtLink to="/" class="block relative z-[12]">
        <svg
          class="mx-auto lg:w-[140px] logo-width"
          viewBox="0 0 256 167"
          version="1.1"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="xMidYMid"
        >
          <path
            d="M256,2.84217094e-14 L224.03875,55.3664326 L192.077501,2.84217094e-14 L256,2.84217094e-14 Z M85.3436667,36.9522887 L64.0155001,36.9522887 L117.335917,129.33301 L96.0077501,166.285299 L0,2.84217094e-14 L106.671833,2.84217094e-14 L160.02325,92.3807217 L170.687333,73.9045774 L128,2.84217094e-14 L170.687333,2.84217094e-14 L192.0155,36.9522887 L213.343667,73.9045774 L160.02325,166.285299 L85.3436667,36.9522887 Z"
            fill="#a252c8"
          ></path>
        </svg>
      </NuxtLink>
      <button
        class="absolute top-2 right-3 transition-colors hover:text-primary"
        @click="logout"
      >
        <Icon name="line-md:logout" size="20" />
      </button>
      <button type="button" class="lg:hidden block" @click="openMenu">
        <Icon name="line-md:menu" size="40" class="relative z-[12]" />
      </button>
      <LayoutMenu
        class="lg:left-0 lg:static z-[10] absolute transition-all left-[-100%] menu"
        @click="closeMenu"
      />
    </div>
  </aside>
</template>


<style>
@media (max-width: 1024px) {
  .menu {
    display: grid;
    padding-top: 10rem;
    padding-bottom: 3rem;
    background-color: #0e172a;
    top: 0;
    overflow: auto;
  }
  .menu a {
    justify-content: end;
  }
  .menu-open {
    left: 0;
    width: 100%;
    height: 100vh;
  }
  .logo-width {
    position: relative;
    width: 7rem;
  }
  .higher-menu {
    /* position: relative; */
  }
  .menu-after::after {
    content: "";
    position: absolute;
    background-color: #0e172a;
    top: 0;
    left: 0;
    height: 8.5625rem;
    width: 100%;
    z-index: 11;
  }
}

._lock {
  overflow: hidden;
}
</style>
