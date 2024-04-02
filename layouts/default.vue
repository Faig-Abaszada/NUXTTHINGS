<template>
    <div>
        <header class="shadow-sm bg-white">
            <nav class="container mx-auto p-4 flex justify-between">
                <NuxtLink class="font-bold" to="/">Logo</NuxtLink>
                <ul class="flex gap-4">
                    <li><NuxtLink to="/">Home</NuxtLink></li>
                    <li><NuxtLink to="/about">About</NuxtLink></li>
                    <li><NuxtLink to="/products">Products</NuxtLink></li>
                </ul>
            </nav>
        </header>
      

        <!-- 
        main difference is between nuxtlink and a tag 
        it make a fresh request to server and reload the page
        -->
        <!-- <a href="/about">Static link</a> -->

        <!-- output the page content -->
        <div class="container mx-auto p-4">
            <slot />
        </div>
  </div>
</template>
<style scoped>
    .router-link-exact-active {
        color: red;
    }
</style>