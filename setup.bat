@echo off 
echo "Installing..."

pnpm install
prisma db push
prisma migrate dev

