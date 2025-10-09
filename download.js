import { createClient } from 'pexels';
import * as fs from 'fs';
import * as https from 'https';

// 1. IMPORTANT: Replace 'YOUR_API_KEY' with your actual Pexels API key.
const client = createClient('Jub7tkwiaEQw1DivSu5y9obDqPFUVSDWahepKivgxYKDJVeAYVZZkL6G');

const query = 'Side Hustle';

console.log(`Searching for a photo with query: "${query}"...`);

// Find a photo
client.photos.search({ query, per_page: 1 })
  .then(response => {
    if (response.photos.length === 0) {
      console.error('No photos found for your query.');
      return;
    }

    const photo = response.photos[0];
    console.log(`Found photo: ${photo.url}`);

    // The URL to the actual image file
    const imageUrl = photo.src.original;
    const fileExtension = new URL(imageUrl).pathname.split('.').pop();
    const fileName = `image-${photo.id}.${fileExtension}`;
    const filePath = `images/${fileName}`;

    console.log(`Downloading image to ${filePath}...`);

    // Download the image
    const file = fs.createWriteStream(filePath);
    https.get(imageUrl, function (response) {
      response.pipe(file);
      file.on('finish', function () {
        file.close();
        console.log(`Success! Image saved to ${filePath}`);
      });
    }).on('error', function (err) {
      fs.unlink(filePath); // Delete the file on error
      console.error(`Error downloading image: ${err.message}`);
    });
  })
  .catch(err => {
    if (err.message.includes('401')) {
      console.error('Error: Authentication failed. Is your API key correct in download.js?');
    } else {
      console.error('An error occurred:', err.message);
    }
  });
