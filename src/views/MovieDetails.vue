<script setup>
    import { ref, onMounted, watch, computed } from 'vue';
    import { useRoute } from 'vue-router';
    import axios from 'axios';

    const route = useRoute();
    const movie = ref(null);
    const formatYear = (date) => {
        return new Date(date).getFullYear();
    };

    const fetchMovieDetails = async (movieId) => {
        try {
            const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
                params: {
                    api_key: import.meta.env.VITE_API_KEY
                }
            });
            movie.value = response.data;
        } catch (error) {
            console.error('Error fetching movie details:', error);
        }
    };

    onMounted(() => {
        fetchMovieDetails(route.params.id);
    });

    watch(
        () => route.params.id,
        (newId) => {
            fetchMovieDetails(newId);
        }
    );

    const formattedRuntime = computed(() => {
        if (movie.value && movie.value.runtime) {
            const hours = Math.floor(movie.value.runtime / 60);
            const minutes = movie.value.runtime % 60;
            return `${hours} hours ${minutes} minutes`;
        }
        return 'N/A';
    });
</script>

<template>
    <!-- backdrop -->
    <div class="card relative overflow-hidden" v-if="movie">
        <img v-if="movie.backdrop_path" :src="'https://image.tmdb.org/t/p/w1280' + movie.backdrop_path" :alt="`${movie.title} backdrop`" class="absolute inset-0 w-full h-full object-cover opacity-20" />
        <!-- img -->
        <div class="relative grid gap-4 p-4">
            <div class="col-4 md:col-3 flex justify-center items-center">
                <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path" :alt="`${movie.title} poster`" class="mb-2 rounded-img" />
            </div>
            <!-- details -->
            <div class="col-8 md:col-8 py-6">
                <h1 class="text-3xl font-bold mb-2">{{ movie.title }} ({{ formatYear(movie.release_date) }})</h1>
                <p class="text-lg"><span class="font-bold">Release Date: </span>{{ movie.release_date }} | <span class="font-bold">Rating: </span>{{ movie.vote_average }} | <span class="font-bold">Runtime: </span>{{ formattedRuntime }}</p>
                <p class="font-italic text-lg my-5">{{ movie.tagline }}</p>
                <p class="font-bold text-xl">Overview</p>
                <p class="text-xl">{{ movie.overview }}</p>
                <p class="font-bold text-xl">Genres:</p>
                <p class="text-lg">
                    <span v-if="movie.genres && movie.genres.length > 0">
                        <span v-for="(genre, index) in movie.genres" :key="genre.id">
                            {{ genre.name }}
                            <span v-if="index < movie.genres.length - 1">, </span>
                        </span>
                    </span>
                    <span v-else>N/A</span>
                </p>
            </div>
        </div>
    </div>

    <div v-else>
        <p class="text-center">Loading...</p>
    </div>
</template>

<style scoped>
    .inset-0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
    }

    .object-cover {
        object-fit: cover;
    }

    .rounded-img {
        border-radius: 1rem 1rem 1rem 1rem !important;
    }
</style>
