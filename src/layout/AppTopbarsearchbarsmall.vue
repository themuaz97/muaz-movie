<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import axios from 'axios';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const searchQuery = ref('');
const router = useRouter();

onMounted(() => {
    bindOutsideClickListener();
});

onBeforeUnmount(() => {
    unbindOutsideClickListener();
});

const logoUrl = computed(() => {
    return `/layout/images/${layoutConfig.darkTheme.value ? 'logo-white' : 'logo-dark'}.svg`;
});

const searchResults = ref([]);

const onSearchInput = async (event) => {
    searchQuery.value = event.target.value;
    try {
        const response = await axios.get('https://api.themoviedb.org/3/search/movie', {
            params: {
                api_key: import.meta.env.VITE_SEARCH_API_KEY,
                query: searchQuery.value
            }
        });

        // Extract relevant data from API response
        searchResults.value = response.data.results.map((result) => ({
            title: result.title,
            posterPath: result.poster_path
        }));

        console.log('Search results:', searchResults.value);
    } catch (error) {
        console.error('Error searching movies:', error);
    }
};

const onTopBarMenuButton = () => {
    topbarMenuActive.value = !topbarMenuActive.value;
};

const topbarMenuClasses = computed(() => {
    return {
        'layout-topbar-menu-mobile-active': topbarMenuActive.value
    };
});

const bindOutsideClickListener = () => {
    if (!outsideClickListener.value) {
        outsideClickListener.value = (event) => {
            if (isOutsideClicked(event)) {
                topbarMenuActive.value = false;
            }
        };
        document.addEventListener('click', outsideClickListener.value);
    }
};

const unbindOutsideClickListener = () => {
    if (outsideClickListener.value) {
        document.removeEventListener('click', outsideClickListener.value);
        outsideClickListener.value = null;
    }
};

const isOutsideClicked = (event) => {
    if (!topbarMenuActive.value) return;

    const sidebarEl = document.querySelector('.layout-topbar-menu');
    const topbarEl = document.querySelector('.layout-topbar-menu-button');

    return !(sidebarEl.isSameNode(event.target) || sidebarEl.contains(event.target) || topbarEl.isSameNode(event.target) || topbarEl.contains(event.target));
};
</script>

<template>
    <div class="layout-topbar">
        <router-link to="/" class="layout-topbar-logo">
            <img :src="logoUrl" alt="logo" />
            <span>MUAZ</span>
        </router-link>

        <button class="p-link layout-menu-button layout-topbar-button" @click="onMenuToggle()">
            <i class="pi pi-bars"></i>
        </button>

        <button class="p-link layout-topbar-menu-button layout-topbar-button" @click="onTopBarMenuButton()">
            <i class="pi pi-ellipsis-v"></i>
        </button>

        <div class="layout-topbar-menu" :class="topbarMenuClasses">
            <IconField>
                <InputIcon class="pi pi-search" />
                <InputText v-model="searchQuery" @input="onSearchInput" placeholder="Search" />
            </IconField>
            <!-- Display search results -->
            <ul v-if="searchResults.length > 0" class="search-results">
                <li v-for="result in searchResults" :key="result.title">
                    <img v-if="result.posterPath" :src="'https://image.tmdb.org/t/p/w500' + result.posterPath" :alt="result.title + ' poster'" />
                    <span>{{ result.title }}</span>
                </li>
            </ul>
            <p v-else-if="searchQuery && !searchResults.length" class="no-results">No results found</p>
        </div>
    </div>
</template>

<style lang="scss" scoped>
/* Add your scoped styles here */
.search-results {
    list-style-type: none;
    padding: 0;
}

.search-results li {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
}

.search-results img {
    width: 50px; /* Adjust as needed */
    height: auto;
    margin-right: 10px;
}
</style>
