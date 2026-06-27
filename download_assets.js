import fs from 'fs';
import https from 'https';
import path from 'path';

const assetsDir = path.join(process.cwd(), 'public', 'assets');
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

function downloadFile(url, dest, callback) {
  const file = fs.createWriteStream(dest);
  console.log(`Downloading ${url} to ${dest}...`);
  
  https.get(url, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      // Follow redirect
      console.log(`Redirecting to: ${response.headers.location}`);
      downloadFile(response.headers.location, dest, callback);
      return;
    }

    if (response.statusCode !== 200) {
      console.error(`Failed to download ${url}. Status code: ${response.statusCode}`);
      file.close();
      fs.unlinkSync(dest); // Delete partial file
      if (callback) callback(new Error(`Status code ${response.statusCode}`));
      return;
    }

    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log(`Finished downloading ${dest}`);
      if (callback) callback(null);
    });
  }).on('error', (err) => {
    fs.unlinkSync(dest);
    console.error(`Error downloading ${url}: ${err.message}`);
    if (callback) callback(err);
  });
}

// Media URLs
const musicUrl = 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Nocturne_in_E_flat_major%2C_Op._9_no._2.mp3';
const videoUrl = 'https://assets.mixkit.co/videos/preview/mixkit-golden-particles-sparkling-in-the-air-42616-large.mp4';

const musicDest = path.join(assetsDir, 'piano_theme.mp3');
const videoDest = path.join(assetsDir, 'cinematic_particles.mp4');

// Fallback music if Wikimedia fails
const fallbackMusicUrl = 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3';

downloadFile(musicUrl, musicDest, (err) => {
  if (err) {
    console.log('Primary music failed, downloading fallback...');
    downloadFile(fallbackMusicUrl, musicDest);
  }
});

downloadFile(videoUrl, videoDest, (err) => {
  if (err) {
    console.log('Video download failed. We will generate a beautiful Canvas background as a fallback.');
  }
});
