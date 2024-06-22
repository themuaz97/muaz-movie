<script setup>
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';

// Define reactive references for storing movies, genre details, and the current genre ID
const movies = ref([]);
const genre = ref({});
const route = useRoute();
const genreId = ref(route.params.id);

// Fetch movies by genre on component mount and whenever the genre ID changes
const fetchMoviesByGenre = async () => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/discover/movie', {
            params: {
                api_key: import.meta.env.VITE_API_KEY,
                with_genres: genreId.value,
                language: 'en-US',
                sort_by: 'popularity.desc',
                page: 1
            }
        });
        movies.value = response.data.results; // Assuming movies are under 'results' key in API response
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
    }
};

// Fetch genre details
const fetchGenreDetails = async () => {
    try {
        const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
            params: {
                api_key: import.meta.env.VITE_API_KEY
            }
        });
        const genres = response.data.genres; // Assuming genres are under 'genres' key in API response
        genre.value = genres.find(g => g.id === Number(genreId.value));
    } catch (error) {
        console.error('Error fetching genre details:', error);
    }
};

// Fetch data initially and whenever the genre ID changes
onMounted(() => {
    fetchMoviesByGenre();
    fetchGenreDetails();
});
watch(
    () => route.params.id,
    (newId) => {
        genreId.value = newId;
        fetchMoviesByGenre();
        fetchGenreDetails();
    }
);
</script>

<template>
    <div class="card">
        <div class="container mx-auto p-4">
            <h3 class="text-center text-2xl">Genre: {{ genre.name }}</h3>
            <Divider />
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                <!-- Loop through movies and display each in a grid item -->
                <div v-for="movie in movies" :key="movie.id" class="border rounded-lg p-4 mx-auto">
                    <router-link :to="{ name: 'moviedetails', params: { id: movie.id } }">
                        <img :src="'https://image.tmdb.org/t/p/w300' + movie.poster_path" :alt="movie.title" class="w-full h-64 object-cover rounded-lg mb-2 cursor-pointer" />
                        <div class="text-center text-lg font-medium">{{ movie.title }}</div>
                    </router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .container {
        max-width: 1200px; /* Adjust the max width as needed */
    }
</style>
