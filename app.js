// Replace with your YouTube Data API key
const API_KEY = 'AIzaSyCIxUU90zQnP9YBUWc77oARXUD9qZsx0vo';

// Function to fetch top channels
async function fetchTopChannels() {
  const channelRequest = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&maxResults=100&order=viewCount&key=${API_KEY}`);
  const channelData = await channelRequest.json();
  return channelData.items;
}

// Function to fetch recent videos from a channel
async function fetchRecentVideos(channelId) {
  const currentDate = new Date();
  const sevenDaysAgo = new Date(currentDate.setDate(currentDate.getDate() - 7)).toISOString();
  
  const videoRequest = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&publishedAfter=${sevenDaysAgo}&order=date&type=video&key=${API_KEY}`);
  const videoData = await videoRequest.json();
  return videoData.items;
}

// Function to fetch video statistics (view count)
async function fetchVideoStats(videoId) {
  const statsRequest = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${API_KEY}`);
  const statsData = await statsRequest.json();
  return statsData.items[0].statistics.viewCount;
}

// Main function to load data into the table
async function loadChannelData() {
  const channels = await fetchTopChannels();
  const tableBody = document.querySelector('#channelTable tbody');

  for (const channel of channels) {
    const channelId = channel.id;
    const channelName = channel.snippet.title;

    // Fetch recent videos from each channel
    const recentVideos = await fetchRecentVideos(channelId);

    for (const video of recentVideos) {
      const videoTitle = video.snippet.title;
      const videoId = video.id.videoId;
      const videoLink = `https://www.youtube.com/watch?v=${videoId}`;
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
}

// Call the main function when the page loads
loadChannelData();
