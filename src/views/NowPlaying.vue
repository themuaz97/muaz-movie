<script setup>
    import { ref, onMounted } from 'vue';
    import axios from 'axios';
    import { useRouter } from 'vue-router';

    const movies = ref([]);
    const router = useRouter();

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
            movies.value = response.data.results;
        } catch (error) {
            console.error('Error fetching now playing movies:', error);
        }
    });

    const navigateToMovieDetails = (movieId) => {
        router.push({ name: 'moviedetails', params: { id: movieId } });
    };
</script>

<template>
    <div class="card">
        <h3 class="flex justify-content-center mb-5">Now Playing Movies</h3>
        <Divider />
        <div class="grid-container mt-5">
            <div v-for="movie in movies" :key="movie.id" class="grid-item">
                <router-link :to="{ name: 'moviedetails', params: { id: movie.id } }">
                    <img :src="'https://image.tmdb.org/t/p/w200' + movie.poster_path" :alt="movie.title" style="width: 100%; cursor: pointer" @click="navigateToMovieDetails(movie.id)" />
                </router-link>
                <div class="title">{{ movie.title }}</div>
                <div class="release-date">Release Date: {{ movie.release_date }}</div>
                <div class="vote-average">Vote Average: {{ movie.vote_average }}</div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .grid-container {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* Adjust minmax width as needed */
        gap: 1rem; /* Adjust gap between grid items */
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
        color: #666;
    }
</style>
