<script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';
    import Divider from 'primevue/divider';

    const movies = ref([]);
    const router = useRouter();
    const formatYear = (date) => {
        return new Date(date).getFullYear();
    };

    onMounted(async () => {
        try {
            const response = await axios.get('https://api.themoviedb.org/3/movie/now_playing', {
                params: {
                    api_key: import.meta.env.VITE_API_KEY,
                    language: 'en-US',
                    page: 1
                }
            });
            console.log('API response:', response);
            const movieDetailsPromises = response.data.results.map(async (movie) => {
                const detailsResponse = await axios.get(`https://api.themoviedb.org/3/movie/${movie.id}`, {
                    params: {
                        api_key: import.meta.env.VITE_API_KEY,
                        language: 'en-US'
                    }
                });
                return { ...movie, ...detailsResponse.data };
            });
            movies.value = await Promise.all(movieDetailsPromises);
        } catch (error) {
            console.error('Error fetching now playing movies:', error);
        }
    });

    const navigateToMovieDetails = (movieId) => {
        router.push({ name: 'moviedetails', params: { id: movieId } });
    };

    const formattedRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours} hour${hours !== 1 ? 's' : ''} ${mins.toString().padStart(2, '0')} minute${mins !== 1 ? 's' : ''}`;
    };
</script>

<template>
    <Carousel :value="movies" :numVisible="1" :numScroll="1" :circular="true" :autoplayInterval="4000" :showNavigators="false">
        <template #item="{ data }">
            <div class="carousel-item">
                <RouterLink :to="{ name: 'moviedetails', params: { id: data.id } }">
                    <img :src="'https://image.tmdb.org/t/p/w1280' + data.backdrop_path" :alt="data.title" class="w-full h-48 object-cover carousel-border" />
                </RouterLink>
                <div class="carousel-content p-6">
                    <h3 class="text-6xl font-bold text-white">{{ data.title }} ({{ formatYear(data.release_date) }})</h3>
                    <p class="text-lg">{{ formattedRuntime(data.runtime) }}</p>
                    <p class="text-lg">
                        <span v-for="(genre, index) in data.genres" :key="genre.id">{{ genre.name }}<span v-if="index < data.genres.length - 1"> | </span></span>
                    </p>
                </div>
            </div>
        </template>
    </Carousel>
    <div class="card rounded-card">
        <h3 class="flex justify-content-center mb-5">Now Playing Movies</h3>
        <Divider />
        <div class="grid-container mt-5">
            <div v-for="movie in movies" :key="movie.id" class="grid-item">
                <router-link :to="{ name: 'moviedetails', params: { id: movie.id } }">
                    <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" :alt="movie.title" style="width: 100%; cursor: pointer" @click="navigateToMovieDetails(movie.id)" />
                    <div class="title text-xl">{{ movie.title }}</div>
                </router-link>
                <div class="release-date">Release Date: {{ movie.release_date }}</div>
                <div class="vote-average">Vote Average: {{ movie.vote_average }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
        gap: 1rem;
    }

    .grid-item {
        text-align: center;
        padding: 1rem;
        border: 1px solid #dee2e6;
    }

    .grid-item img {
        max-width: 100%;
        height: auto;
        cursor: pointer;
    }

    .title {
        font-weight: bold;
        margin-top: 0.5rem;
    }

    .release-date,
    .vote-average {
        margin-top: 0.5rem;
    }

    .carousel-item {
        position: relative;
        width: 100%;
        height: 100%;
    }

    .carousel-item img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .carousel-content {
        background-color: rgba(58, 54, 54, 0.6);
        color: white;
        position: absolute;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
    }

    .carousel-border {
        border-radius: 1rem 1rem 0 0 !important;
    }

    .rounded-card {
        border-radius: 0 0 1rem 1rem !important;
    }
</style>
