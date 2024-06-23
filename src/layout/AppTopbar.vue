<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import { useLayout } from '@/layout/composables/layout';
import { useRouter } from 'vue-router';
import axios from 'axios';

const { layoutConfig, onMenuToggle } = useLayout();

const outsideClickListener = ref(null);
const topbarMenuActive = ref(false);
const visibleFull = ref(false);
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
                api_key: import.meta.env.VITE_API_KEY,
                query: searchQuery.value
            }
        });

        searchResults.value = response.data.results.map((result) => ({
            id: result.id,
            title: result.title,
            posterPath: result.poster_path,
            release_date: result.release_date,
            vote_average: result.vote_average
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

const closeSidebar = () => {
    visibleFull.value = false;
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
            <Sidebar v-model:visible="visibleFull" :baseZIndex="1000" position="full">
                <div class="col-12">
                    <div class="p-inputgroup full-width-search">
                        <span class="p-inputgroup-addon">
                            <i class="pi pi-search"></i>
                        </span>
                        <InputText v-model="searchQuery" @input="onSearchInput" placeholder="Search" />
                    </div>
                    <!-- Display search results -->
                    <div v-if="searchResults.length > 0" class="search-results-grid">
                        <div v-for="result in searchResults" :key="result.id" class="search-result-item">
                            <router-link :to="{ name: 'moviedetails', params: { id: result.id } }" @click.native="closeSidebar">
                                <img v-if="result.posterPath" :src="'https://image.tmdb.org/t/p/w500' + result.posterPath" :alt="result.title + ' poster'" />
                            </router-link>
                            <span class="text-lg">{{ result.title }}</span>
                            <span class="release-date">Release Date: {{ result.release_date }}</span>
                            <span class="vote-average">Rating: {{ result.vote_average }}</span>
                        </div>
                    </div>
                    <p v-else-if="searchQuery && !searchResults.length" class="no-results">No results found</p>
                </div>
            </Sidebar>
            <button class="p-link layout-topbar-button" @click="visibleFull = true">
                <i class="pi pi-search"></i>
                <span>Search</span>
            </button>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.layout-topbar-menu {
    position: relative;
}

.full-width-search {
    width: 100%;
    margin-bottom: 1rem;
}

.search-results-grid {
    display: grid;
    grid-template-columns: repeat(6, 1fr);
    gap: 10px;
    padding: 10px;
}

.search-result-item {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.search-result-item img {
    width: 270px;
    height: auto;
    margin: 10px 0 10px 0;
}

.search-result-item .release-date,
.search-result-item .vote-average {
    margin-top: 5px;
    font-size: 0.9rem;
    color: #666;
}

.no-results {
    margin-top: 10px;
    color: #666;
}
</style>
