<template>
    <div>
        <NuxtLink to="/">Logo</NuxtLink>
        <ul>
        <li><NuxtLink to="/">Home</NuxtLink></li>
        <li><NuxtLink to="/about">About</NuxtLink></li>
        <li><NuxtLink to="/products">Products</NuxtLink></li>
        </ul>

        <!-- 
        main difference is between nuxtlink and a tag 
        it make a fresh request to server and reload the page
        -->
        <a href="/about">Static link</a>

        <!-- output the page content -->
        <div>
            <slot />
        </div>
  </div>
</template>
<style scoped>
    .router-link-exact-active {
        color: red;
    }
</style>