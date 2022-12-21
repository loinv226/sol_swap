# Guide run script or web ui

## Script

- Run cmd: require nodejs, yarn installed

```
yarn install
cd ./app/script
# copy and edit env
cp .env.example .env
npx ts-node index.ts
```

## Web ui - link: https://tmm.koolab.io/

- Run localhost:

```
cd ./app/swap_ui
# copy and edit .env
cp .env.example .env
yarn install
yarn dev
```
