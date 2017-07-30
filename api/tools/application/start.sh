echo 'Installing dependencies';
npm install

echo 'Starting API';
pm2-docker process.yml