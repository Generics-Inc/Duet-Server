docker compose down
docker rmi duet-api
docker compose --env-file ".env" up -d

docker exec -d duet-api npm run db:push
