// Replace with your YouTube Data API key
const API_KEY = 'AIzaSyCIxUU90zQnP9YBUWc77oARXUD9qZsx0vo';

const corsProxy = "https://cors-anywhere.herokuapp.com/";
const apiUrl = `${corsProxy}https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=100&type=video&order=viewCount&publishedAfter=2023-09-12T00:00:00Z&key=${API_KEY}`;

// Fetch popular videos uploaded in the last 7 days, restricted to the United States
async function fetchPopularVideos() {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=50&type=video&order=viewCount&publishedAfter=2023-09-12T00:00:00Z&regionCode=US&key=${API_KEY}`);
  const data = await response.json();
  return data.items;
}

// Fetch detailed channel info using channelId
async function fetchChannelDetails(channelId) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`);
  const data = await response.json();
  return data.items[0];
}

// Fetch video statistics (view count)
async function fetchVideoStats(videoId) {
  const response = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
  const data = await response.json();
  return data.items[0].statistics.viewCount;
}

// Main function to load video and channel data into the table
async function loadChannelData() {
  const videos = await fetchPopularVideos();
  const tableBody = document.querySelector('#channelTable tbody');

  for (const video of videos) {
    const channelId = video.snippet.channelId;
    const videoTitle = video.snippet.title;
    const videoId = video.id.videoId;
    const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Fetch channel details
    const channel = await fetchChannelDetails(channelId);
    const channelName = channel.snippet.title;
    const viewCount = await fetchVideoStats(videoId);

    // Create a new row in the table
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${channelName}</td>
      <td>${videoTitle}</td>
      <td><a href="${videoLink}" target="_blank">Watch</a></td>
      <td>${viewCount}</td>
    `;
    tableBody.appendChild(row);
  }
}

// Initialize the table data
loadChannelData();
