npm install
nvm use 10

yarn dev
yarn dev --port 3001
./ngrok http 3001

for `TypeError: _gracefulFs(...).realpathSync.native is not a function` use `nvm use 10`