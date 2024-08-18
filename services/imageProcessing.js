const { v4: uuidv4 } = require('uuid');

const userImages = new Map();

function addUserImage(userId, imageUrl) {
  if (!userImages.has(userId)) {
    userImages.set(userId, []);
  }
  userImages.get(userId).push(imageUrl);

  if (userImages.get(userId).length >= 3) {
    const jobId = uuidv4();
    // Here you would typically start the art photo generation process
    // For this example, we'll just simulate it with a timeout
    setTimeout(() => generateArtPhoto(userId, jobId), 10000);
    return jobId;
  }
  return null;
}

function generateArtPhoto(userId, jobId) {
  // Simulate art photo generation
  console.log(`Generating art photo for user ${userId} with job ID ${jobId}`);
  // Here you would typically call your art generation service
  // For this example, we'll just return a placeholder URL
  const artPhotoUrl = `https://example.com/art_photo_${jobId}.jpg`;
  return artPhotoUrl;
}

module.exports = { addUserImage, generateArtPhoto };