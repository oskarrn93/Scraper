export NODE_ENV=production

rm -rf ./build
rm -rf ./dist

mkdir ./build
mkdir ./dist

npx tsc

yarn install
yarn autoclean --force

zip ./dist/calendar.zip -r ./build -r ./node_modules

export NODE_ENV=development
yarn install
