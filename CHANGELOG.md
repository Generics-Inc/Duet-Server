# Changelog


## v0.0.3


### 🚀 Enhancements

- Add auth work with sessions ([f29688b](https://github.com/Generics-Inc/Duet-Server/commit/f29688b))
- Dockerfile run script ([6225157](https://github.com/Generics-Inc/Duet-Server/commit/6225157))
- Add funny secret ([45eb716](https://github.com/Generics-Inc/Duet-Server/commit/45eb716))
- Add files uploading ([d34549a](https://github.com/Generics-Inc/Duet-Server/commit/d34549a))
- Add auth with vk accessToken ([ece86fc](https://github.com/Generics-Inc/Duet-Server/commit/ece86fc))
- Add uploading files with sync creation records in db ([5c602fe](https://github.com/Generics-Inc/Duet-Server/commit/5c602fe))
- Add requests to join to group ([a898316](https://github.com/Generics-Inc/Duet-Server/commit/a898316))
- Add user status with watch to partner ([943b8c0](https://github.com/Generics-Inc/Duet-Server/commit/943b8c0))
- New statuses; deleting group requests ([573834c](https://github.com/Generics-Inc/Duet-Server/commit/573834c))
- Add refresh invite code and kick secondary partner ([35e8949](https://github.com/Generics-Inc/Duet-Server/commit/35e8949))
- Add deleting groups, when it is not have users, with cleaning S3 Minio storage ([2d14772](https://github.com/Generics-Inc/Duet-Server/commit/2d14772))
- Add rules to write/read files in storage ([6e9027a](https://github.com/Generics-Inc/Duet-Server/commit/6e9027a))
- Prisma movie structure ([5e6af36](https://github.com/Generics-Inc/Duet-Server/commit/5e6af36))
- Add ci cd github files ([6bde639](https://github.com/Generics-Inc/Duet-Server/commit/6bde639))
- Update ci cd script ([b4e4ed3](https://github.com/Generics-Inc/Duet-Server/commit/b4e4ed3))
- Update ci cd script ([c085f2a](https://github.com/Generics-Inc/Duet-Server/commit/c085f2a))
- Update ci cd script ([cf8d335](https://github.com/Generics-Inc/Duet-Server/commit/cf8d335))
- Update ci cd script ([36404e7](https://github.com/Generics-Inc/Duet-Server/commit/36404e7))
- Update ci cd script ([dacb7e8](https://github.com/Generics-Inc/Duet-Server/commit/dacb7e8))
- Update ci cd script ([fba74a0](https://github.com/Generics-Inc/Duet-Server/commit/fba74a0))
- Add saving vk profile photo in S3 Minio storage with rules protect ([9a63a6d](https://github.com/Generics-Inc/Duet-Server/commit/9a63a6d))
- Add sessions cookies protect and storaging sessions locations ([39c8943](https://github.com/Generics-Inc/Duet-Server/commit/39c8943))
- Init movie structure ([5736284](https://github.com/Generics-Inc/Duet-Server/commit/5736284))
- Add creation movie records ([4467960](https://github.com/Generics-Inc/Duet-Server/commit/4467960))
- Add additional info to the profile id ([32c8dde](https://github.com/Generics-Inc/Duet-Server/commit/32c8dde))
- Add minimal management connected accounts to the user modal ([b0895d4](https://github.com/Generics-Inc/Duet-Server/commit/b0895d4))
- Start write hdRezka parser. Ready search movies ([dc61b15](https://github.com/Generics-Inc/Duet-Server/commit/dc61b15))
- End dev hdrezka parser ([36ac292](https://github.com/Generics-Inc/Duet-Server/commit/36ac292))
- Add info about partner to the archive record ([306828f](https://github.com/Generics-Inc/Duet-Server/commit/306828f))

### 🩹 Fixes

- Add api prefix ([a726344](https://github.com/Generics-Inc/Duet-Server/commit/a726344))
- Package-lock.json relations ([5c0d08c](https://github.com/Generics-Inc/Duet-Server/commit/5c0d08c))
- Nullable groupId in profile info ([bc4827f](https://github.com/Generics-Inc/Duet-Server/commit/bc4827f))
- Status partner type ([212cef7](https://github.com/Generics-Inc/Duet-Server/commit/212cef7))
- Seed db && refresh token ([40b63a4](https://github.com/Generics-Inc/Duet-Server/commit/40b63a4))
- Returned profile me body data. Delete info about user ([75c99b8](https://github.com/Generics-Inc/Duet-Server/commit/75c99b8))
- Deleting archive record from secondary user, when deleting group ([d214236](https://github.com/Generics-Inc/Duet-Server/commit/d214236))
- Start fix rules to right files ([cfdfc50](https://github.com/Generics-Inc/Duet-Server/commit/cfdfc50))
- File rights checking ([f22fcce](https://github.com/Generics-Inc/Duet-Server/commit/f22fcce))
- Remove origin from link path ([d222920](https://github.com/Generics-Inc/Duet-Server/commit/d222920))
- Add loses routes and invalid check access ([e923616](https://github.com/Generics-Inc/Duet-Server/commit/e923616))
- Session data secure ([a570e7c](https://github.com/Generics-Inc/Duet-Server/commit/a570e7c))
- Delete const ip ([c629aad](https://github.com/Generics-Inc/Duet-Server/commit/c629aad))
- Cookie auth validate with deleted session ([6ca7551](https://github.com/Generics-Inc/Duet-Server/commit/6ca7551))
- Cookie is turnoff ([698a98f](https://github.com/Generics-Inc/Duet-Server/commit/698a98f))
- Add queue required import ([9ce5a07](https://github.com/Generics-Inc/Duet-Server/commit/9ce5a07))
- Bug with undefined groupId in guard ([da58cff](https://github.com/Generics-Inc/Duet-Server/commit/da58cff))
- Mirror updating and add types for movie ([3c230a8](https://github.com/Generics-Inc/Duet-Server/commit/3c230a8))

### 💅 Refactors

- The project has been postponed ([4b34885](https://github.com/Generics-Inc/Duet-Server/commit/4b34885))
- Remove global prefix and remove api prefix from swagger ([8cab969](https://github.com/Generics-Inc/Duet-Server/commit/8cab969))
- Add new statuses to the status request ([9a76f98](https://github.com/Generics-Inc/Duet-Server/commit/9a76f98))
- Big refactor project ([8b1f2b2](https://github.com/Generics-Inc/Duet-Server/commit/8b1f2b2))
- Big refactor project ([729c9fb](https://github.com/Generics-Inc/Duet-Server/commit/729c9fb))
- Big refactor project ([efbb8c1](https://github.com/Generics-Inc/Duet-Server/commit/efbb8c1))
- Rewrite all modules with prisma models ([bef0aa7](https://github.com/Generics-Inc/Duet-Server/commit/bef0aa7))
- End project refactoring ([d745c45](https://github.com/Generics-Inc/Duet-Server/commit/d745c45))
- Big refactor dto's structure ([9455894](https://github.com/Generics-Inc/Duet-Server/commit/9455894))

### 📖 Documentation

- All the old routes in swagger are described ([33569ff](https://github.com/Generics-Inc/Duet-Server/commit/33569ff))
- Secret security swagger name ([7a53703](https://github.com/Generics-Inc/Duet-Server/commit/7a53703))
- Write doc for all swagger ([5f59264](https://github.com/Generics-Inc/Duet-Server/commit/5f59264))
- Add ci cd badge to readme ([752c424](https://github.com/Generics-Inc/Duet-Server/commit/752c424))

### 🏡 Chore

- Remove migrations ([3732c20](https://github.com/Generics-Inc/Duet-Server/commit/3732c20))
- Delete erd ([050b910](https://github.com/Generics-Inc/Duet-Server/commit/050b910))
- Fix db scripts ([c526be5](https://github.com/Generics-Inc/Duet-Server/commit/c526be5))
- Update ci cd script ([82be8b9](https://github.com/Generics-Inc/Duet-Server/commit/82be8b9))
- Test ci cd script ([6df6a18](https://github.com/Generics-Inc/Duet-Server/commit/6df6a18))
- Update context ([2e6a031](https://github.com/Generics-Inc/Duet-Server/commit/2e6a031))
- Return data before test ([240884b](https://github.com/Generics-Inc/Duet-Server/commit/240884b))
- Test ci cd branch protect ([b9fa895](https://github.com/Generics-Inc/Duet-Server/commit/b9fa895))
- Test merge pull request ([cbdc3ce](https://github.com/Generics-Inc/Duet-Server/commit/cbdc3ce))
- Test ci cd branch protect ([3847a0a](https://github.com/Generics-Inc/Duet-Server/commit/3847a0a))
- Merge dev with return changes before test ([46b7480](https://github.com/Generics-Inc/Duet-Server/commit/46b7480))
- Replace minio origin to https ([4122192](https://github.com/Generics-Inc/Duet-Server/commit/4122192))
- Test ci cd script ([f1eed4f](https://github.com/Generics-Inc/Duet-Server/commit/f1eed4f))
- Test ci cd script ([34a0ea3](https://github.com/Generics-Inc/Duet-Server/commit/34a0ea3))
- Test ci cd script ([651e9d5](https://github.com/Generics-Inc/Duet-Server/commit/651e9d5))

### ❤️ Contributors

- LorexIQ <i@liq-mail.ru>
- Dmitry Murashko <i@liq-mail.ru>

## v0.0.2


### 🚀 Enhancements

- Add auth work with sessions ([f29688b](https://github.com/Generics-Inc/Duet-Server/commit/f29688b))
- Dockerfile run script ([6225157](https://github.com/Generics-Inc/Duet-Server/commit/6225157))

### 🩹 Fixes

- Add api prefix ([a726344](https://github.com/Generics-Inc/Duet-Server/commit/a726344))

### 💅 Refactors

- The project has been postponed ([4b34885](https://github.com/Generics-Inc/Duet-Server/commit/4b34885))
- Remove global prefix and remove api prefix from swagger ([8cab969](https://github.com/Generics-Inc/Duet-Server/commit/8cab969))

### 📖 Documentation

- All the old routes in swagger are described ([33569ff](https://github.com/Generics-Inc/Duet-Server/commit/33569ff))

### ❤️ Contributors

- LorexIQ <i@liq-mail.ru>

