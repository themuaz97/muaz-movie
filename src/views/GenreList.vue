<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

// Define a reactive reference for storing genres
const genres = ref([]);
const router = useRouter();

// Fetch genres on component mount
onMounted(async () => {
  try {
    const response = await axios.get('https://api.themoviedb.org/3/genre/movie/list', {
      params: {
        api_key: import.meta.env.VITE_API_KEY
      }
    });
    genres.value = response.data.genres; // Assuming genres are under 'genres' key in API response
  } catch (error) {
    console.error('Error fetching genres:', error);
  }
});

// Function to navigate to shows page for a specific genre
const navigateToGenreShows = (genreId) => {
  router.push({ name: 'genreshows', params: { id: genreId } }); // Use 'id' as the parameter name
};
</script>

<template>
  <div class="grid">
    <div class="col-12">
      <div class="card">
        <h3 class="flex justify-content-center">Genres</h3>
        <Divider />
        <div class="grid gap-4 mx-auto col-10">
          <!-- Loop through genres and display each in a grid item -->
          <Button v-for="genre in genres" :key="genre.id" class="col-span-1 md:col-2 flex justify-content-center" text>
            <div class="text-lg cursor-pointer" @click="navigateToGenreShows(genre.id)">
              {{ genre.name }}
            </div>
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Add scoped styles here if needed */
</style>
