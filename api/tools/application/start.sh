echo 'Installing dependencies';
npm install

cd ..
echo 'Starting API';
pm2-docker process.yml