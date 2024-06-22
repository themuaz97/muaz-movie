<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const movie = ref(null);

const fetchMovieDetails = async (movieId) => {
  try {
    const response = await axios.get(`https://api.themoviedb.org/3/movie/${movieId}`, {
      params: {
        api_key: import.meta.env.VITE_SEARCH_API_KEY,
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

watch(() => route.params.id, (newId) => {
  fetchMovieDetails(newId);
});
</script>

<template>
  <div v-if="movie">
    <h1>{{ movie.title }}</h1>
    <img v-if="movie.poster_path" :src="'https://image.tmdb.org/t/p/w500' + movie.poster_path" :alt="movie.title + ' poster'" />
    <p>{{ movie.overview }}</p>
    <p>Release Date: {{ movie.release_date }}</p>
    <p>Rating: {{ movie.vote_average }}</p>
  </div>
  <div v-else>
    <p>Loading...</p>
  </div>
</template>

<style scoped>
/* Your styles here */
</style>
