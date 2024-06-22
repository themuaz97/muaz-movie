<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const movies = ref([]);

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
</script>

<template>
    <div class="card">
        <h5>Now Playing Movies</h5>
        <DataTable :value="movies" :rows="5" :paginator="true" responsiveLayout="scroll">
            <Column style="width: 15%">
                <template #header> Image </template>
                <template #body="slotProps">
                    <img :src="'https://image.tmdb.org/t/p/w200' + slotProps.data.poster_path" :alt="slotProps.data.title" style="width: 100px" />
                </template>
            </Column>
            <Column field="title" header="Title"></Column>
            <Column field="release_date" header="Release Date"></Column>
            <Column field="vote_average" header="Vote Average"></Column>
        </DataTable>
    </div>
</template>

<style scoped>
/* Add any custom styles here */
</style>
