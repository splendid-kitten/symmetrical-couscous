<script setup>
import { useLayout } from '@/layout/composables/layout';

const { onMenuToggle } = useLayout();
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <span> Symmetrical Couscous</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

    </div>
</template>

<style lang="scss" scoped></style>
