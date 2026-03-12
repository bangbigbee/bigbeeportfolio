const https = require('https');

const folders = [
  'bg', 'food', 'sports', 'wedding', 'wedding1', 'wedding2', 'wedding3', 
  'wedding4', 'wedding5', 'wedding6', 'interior', 'profile', 'event', 
  'realestate', 'commercial', 'lifestyle'
];

const fetchFolder = (folder) => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: `/repos/portbigbee/portfolio-photo/contents/${folder}`,
      headers: { 'User-Agent': 'Node.js' }
    };

    https.get(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (Array.isArray(json)) {
            resolve({ folder, files: json.map(f => f.name) });
          } else {
            resolve({ folder, files: [] });
          }
        } catch (e) {
          resolve({ folder, files: [] });
        }
      });
    }).on('error', reject);
  });
};

Promise.all(folders.map(fetchFolder)).then(results => {
  const output = {};
  results.forEach(r => {
    output[r.folder] = r.files;
  });
  console.log(JSON.stringify(output, null, 2));
});
