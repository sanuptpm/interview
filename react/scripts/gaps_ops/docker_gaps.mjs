// New Docker gap questions. Outputs are realistic written examples (the Docker daemon is not run).
// after = the existing (or earlier new) title this one is placed after, in the data file and in its sub-topic.
const r = String.raw
export const ITEMS = [
  {
    q: 'What is the difference between RUN and CMD?',
    level: 'Basics',
    after: 'What are the basic Dockerfile instructions?',
    a: "RUN executes a command while the image is being built and saves the result as a new layer, so I use it to install packages. CMD doesn't run anything at build time; it only sets the default command a container runs when it starts, and if there are several CMD lines only the last one counts. Anything I put after the image name in docker run replaces CMD. An easy way to remember it: RUN builds the image, CMD runs the container.",
    code: r`# Dockerfile
FROM alpine:3.20
# build time: runs once, result saved in the image
RUN echo "built on $(date +%F)" > /built.txt
# run time: runs every time a container starts
CMD ["cat", "/built.txt"]

# docker build -t run-vs-cmd .
# docker run --rm run-vs-cmd
# docker run --rm run-vs-cmd echo "CMD replaced"`,
    output: r`$ docker run --rm run-vs-cmd
built on 2026-11-10

$ docker run --rm run-vs-cmd echo "CMD replaced"
CMD replaced`,
  },
  {
    q: 'What does WORKDIR do, and why not use RUN cd?',
    level: 'Basics',
    after: 'What is the difference between RUN and CMD?',
    a: "WORKDIR sets the current directory for every instruction after it, like RUN, COPY, CMD and ENTRYPOINT, and creates the directory if it doesn't exist. RUN cd /app doesn't carry over, because every RUN starts a fresh shell, so the next line is back in the old directory. A relative WORKDIR builds on the previous one. I set WORKDIR /app near the top instead of copying files into /, and that's also where docker exec opens a shell.",
    code: r`# Dockerfile
FROM alpine:3.20
RUN cd /tmp
RUN pwd
WORKDIR /app
RUN pwd
WORKDIR src
RUN pwd
CMD ["pwd"]`,
    output: r`$ docker build --progress=plain -t workdir-demo .
#6 [3/7] RUN pwd
#6 0.112 /
#8 [5/7] RUN pwd
#8 0.098 /app
#10 [7/7] RUN pwd
#10 0.101 /app/src

$ docker run --rm workdir-demo
/app/src`,
  },
  {
    q: 'What is the difference between the exec form and the shell form?',
    level: 'Intermediate',
    after: 'What is the difference between CMD and ENTRYPOINT?',
    a: "Exec form is a JSON array, like CMD [\"python\", \"app.py\"]: Docker starts the program directly, so it runs as PID 1 and receives the SIGTERM from docker stop. Shell form, like CMD python app.py, is wrapped in /bin/sh -c, so I get shell features like $VAR expansion and &&, but the shell may not pass signals on and the container can end up being killed after the stop timeout. I use exec form for CMD and ENTRYPOINT, and shell form is fine for RUN. If I need a variable in exec form, I call sh -c myself or use an entrypoint script that ends with exec.",
    code: r`# Dockerfile.exec  (exec form: no shell, $HOME is not expanded)
FROM alpine:3.20
CMD ["echo", "home is $HOME"]

# Dockerfile.shell (shell form: wrapped in /bin/sh -c)
FROM alpine:3.20
CMD echo "home is $HOME"

# docker run --rm exec-form ; docker run --rm shell-form
# docker inspect --format '{{json .Config.Cmd}}' shell-form`,
    output: r`$ docker run --rm exec-form
home is $HOME

$ docker run --rm shell-form
home is /root

$ docker inspect --format '{{json .Config.Cmd}}' shell-form
["/bin/sh","-c","echo \"home is $HOME\""]`,
  },
  {
    q: 'What does the LABEL instruction do?',
    level: 'Basics',
    after: 'What is the difference between ARG and ENV?',
    a: "LABEL adds key-value metadata to an image, like its version, source repository or owning team, and it doesn't change how the container runs. I use the standard org.opencontainers.image.* keys, so registries like GitHub can show the source link and tools can read them. Labels also help with filtering, for example docker images --filter label=team=payments. In CI I fill the version and commit in from build args.",
    code: r`# Dockerfile
FROM python:3.12-slim
ARG VERSION=dev
LABEL org.opencontainers.image.version=$VERSION \
      org.opencontainers.image.source="https://github.com/example/shop-api" \
      team="payments"

# docker build --build-arg VERSION=1.4.0 -t shop-api:1.4.0 .
# docker inspect --format '{{json .Config.Labels}}' shop-api:1.4.0
# docker images --filter label=team=payments`,
    output: r`$ docker inspect --format '{{json .Config.Labels}}' shop-api:1.4.0
{"org.opencontainers.image.source":"https://github.com/example/shop-api","org.opencontainers.image.version":"1.4.0","team":"payments"}

$ docker images --filter label=team=payments
IMAGE            ID             DISK USAGE   CONTENT SIZE   EXTRA
shop-api:1.4.0   8d2c4f7a1b3e        187MB         49.6MB`,
  },
  {
    q: 'What do the STOPSIGNAL, SHELL and ONBUILD instructions do?',
    level: 'Advanced',
    after: 'What is a .dockerignore file?',
    a: "These are less common, but they do come up. STOPSIGNAL changes the signal docker stop sends, for example SIGQUIT so Nginx finishes open requests before exiting. SHELL changes the shell used by shell-form instructions, for example adding -o pipefail so a failing command inside a pipe fails the build. ONBUILD stores an instruction that only runs later, when another Dockerfile uses this image in FROM; I mostly avoid it because it hides build steps from whoever uses the base image.",
    code: r`# Dockerfile
FROM nginx:alpine
STOPSIGNAL SIGQUIT
SHELL ["/bin/sh", "-o", "pipefail", "-c"]
RUN cat /etc/os-release | grep -q Alpine
ONBUILD COPY ./site /usr/share/nginx/html

# docker build -t my-nginx-base .
# docker inspect --format '{{.Config.StopSignal}} {{json .Config.OnBuild}}' my-nginx-base`,
    output: r`$ docker inspect --format '{{.Config.StopSignal}} {{json .Config.OnBuild}}' my-nginx-base
SIGQUIT ["COPY ./site /usr/share/nginx/html"]`,
  },
  {
    q: 'What is the difference between docker rm and docker rmi?',
    level: 'Basics',
    after: 'What are the basic commands to manage images and containers?',
    a: "docker rm deletes a container and docker rmi deletes an image. A running container has to be stopped first, or removed with rm -f, and an image can't be deleted while any container, even a stopped one, still uses it. So the usual order is stop, rm the container, then rmi the image. For bulk cleanup I use docker container prune and docker image prune instead of deleting one by one.",
    code: r`docker run -d --name web nginx:alpine
docker rmi nginx:alpine     # fails: a container uses it
docker rm web               # fails: it is still running
docker rm -f web            # stop + remove the container
docker rmi nginx:alpine     # now the image can go`,
    output: r`8c1f3a5e7b9d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a
Error response from daemon: conflict: unable to delete nginx:alpine (cannot be forced) - image is being used by running container 8c1f3a5e7b9d
Error response from daemon: cannot remove container "/web": container is running: stop the container before removing or force remove
web
Untagged: nginx:alpine
Deleted: sha256:4ff102c5d78d254a6f0da062b3cf39eaf07f01eec0927fd21e219d0af8bc0591`,
  },
  {
    q: 'What is the difference between docker stop, docker kill and docker restart?',
    level: 'Basics',
    after: 'What states can a container be in, and how do you move between them?',
    a: "docker stop sends SIGTERM so the app can shut down cleanly, and if it's still running after 10 seconds (change it with -t) Docker sends SIGKILL. docker kill sends SIGKILL right away, or any signal I pick with -s, like SIGHUP to reload config. docker restart is just stop followed by start, and the container keeps its ID, files and settings. I use stop normally and kill only for a hung container; exit code 137 tells me a container was SIGKILLed.",
    code: r`docker run -d --name web nginx:alpine
docker stop web
docker inspect --format '{{.State.ExitCode}}' web
docker start web
docker kill web
docker inspect --format '{{.State.ExitCode}}' web
docker restart web
docker ps --filter name=web --format "{{.Names}}  {{.Status}}"`,
    output: r`5b8e2d4f6a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b
web
0
web
web
137
web
web  Up 1 second`,
  },
  {
    q: 'How do you push an image to a registry with docker login, docker tag and docker push?',
    level: 'Basics',
    after: 'What are image tags and how should you version images?',
    a: "First I log in with docker login, then I tag the local image with the full repository name, which on Docker Hub is username/repo:tag, and then docker push uploads only the layers the registry doesn't already have. Anyone with access can then docker pull it. In CI I never type a password: I pipe an access token into --password-stdin, or use the registry's own login, like aws ecr get-login-password for ECR. I push an exact version tag so deployments can pin it.",
    code: r`echo "$DOCKERHUB_TOKEN" | docker login -u exampleuser --password-stdin
docker tag shop-api:1.4.0 exampleuser/shop-api:1.4.0
docker push exampleuser/shop-api:1.4.0

# on another machine
docker pull exampleuser/shop-api:1.4.0`,
    output: r`Login Succeeded

The push refers to repository [docker.io/exampleuser/shop-api]
5f70bf18a086: Pushed
a3c2e4b6d8f0: Pushed
9b1d3f5a7c9e: Mounted from library/python
1.4.0: digest: sha256:7d1e3a5c9b2f4d6e8a0c1b3d5f7e9a2c4b6d8f0e1a3c5b7d9f1e3a5c7b9d1f3e size: 1785

1.4.0: Pulling from exampleuser/shop-api
Digest: sha256:7d1e3a5c9b2f4d6e8a0c1b3d5f7e9a2c4b6d8f0e1a3c5b7d9f1e3a5c7b9d1f3e
Status: Downloaded newer image for exampleuser/shop-api:1.4.0
docker.io/exampleuser/shop-api:1.4.0`,
  },
  {
    q: 'How do you manage volumes with docker volume create, ls, inspect and rm?',
    level: 'Basics',
    after: 'What is the difference between volumes, bind mounts and tmpfs mounts?',
    a: "docker volume create makes a named volume, docker volume ls lists them, docker volume inspect shows the driver and where it lives on the host, and docker volume rm deletes one. A volume can't be removed while any container, even a stopped one, still uses it. docker volume prune cleans up unused volumes, and in recent Docker versions it only removes anonymous ones unless I add --all. I double-check before deleting a volume, because that data is gone for good.",
    code: r`docker volume create pgdata
docker volume ls
docker volume inspect --format '{{.Driver}} {{.Mountpoint}}' pgdata
docker run -d --name db -e POSTGRES_PASSWORD=secret \
    -v pgdata:/var/lib/postgresql/data postgres:16-alpine
docker volume rm pgdata                       # fails: in use
docker rm -f db && docker volume rm pgdata`,
    output: r`pgdata
DRIVER    VOLUME NAME
local     pgdata
local /var/lib/docker/volumes/pgdata/_data
7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e
Error response from daemon: remove pgdata: volume is in use - [7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e]
db
pgdata`,
  },
  {
    q: 'What does the VOLUME instruction do in a Dockerfile?',
    level: 'Intermediate',
    after: 'What is the difference between named and anonymous volumes, and how do you back up a volume?',
    a: "VOLUME /data marks a path as a mount point, so if I don't mount anything there, every new container automatically gets an anonymous volume at that path. The data survives the container, but the volume has a random name, so it's easy to lose track of and leaves dangling volumes behind. Also, anything a later RUN step writes into that path is thrown away during the build. I usually leave VOLUME out and mount a named volume with -v at run time, which is clearer.",
    code: r`# Dockerfile
#   FROM alpine:3.20
#   VOLUME /data
#   CMD ["sh", "-c", "date > /data/started.txt"]
docker build -t vol-demo .
docker run --name v1 vol-demo
docker inspect --format '{{range .Mounts}}{{.Type}} {{.Name}} -> {{.Destination}}{{end}}' v1
docker volume ls`,
    output: r`$ docker inspect --format '{{range .Mounts}}{{.Type}} {{.Name}} -> {{.Destination}}{{end}}' v1
volume 3f1c9a7e5b2d8f4a6c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a -> /data

$ docker volume ls
DRIVER    VOLUME NAME
local     3f1c9a7e5b2d8f4a6c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a`,
  },
  {
    q: 'Does EXPOSE publish a port? What is the difference between EXPOSE and -p?',
    level: 'Basics',
    after: 'How does port mapping work?',
    a: "No. EXPOSE only documents which port the app listens on inside the container; it's metadata stored in the image. -p 8080:80 is what actually publishes it, by mapping a host port to the container port, and -P publishes every EXPOSEd port to a random high host port. Containers on the same user-defined network can reach each other's ports without either. I still write EXPOSE, because it tells other people and tools which port the app uses.",
    code: r`# Dockerfile:  FROM nginx:alpine  +  EXPOSE 80
docker build -t my-nginx .
docker run -d --name a my-nginx              # exposed only
docker run -d --name b -p 8080:80 my-nginx   # host 8080 -> container 80
docker run -d --name c -P my-nginx           # random host port
docker ps --format "{{.Names}}  {{.Ports}}"
curl -s -o /dev/null -w "%{http_code}\n" localhost:8080`,
    output: r`$ docker ps --format "{{.Names}}  {{.Ports}}"
c  0.0.0.0:32768->80/tcp, [::]:32768->80/tcp
b  0.0.0.0:8080->80/tcp, [::]:8080->80/tcp
a  80/tcp

$ curl -s -o /dev/null -w "%{http_code}\n" localhost:8080
200`,
  },
  {
    q: 'How do you create and manage networks with docker network create, connect and inspect?',
    level: 'Intermediate',
    after: 'Explain Docker networking: bridge, host, none and user-defined networks.',
    a: "docker network create makes a user-defined bridge network, where containers can reach each other by name through Docker's built-in DNS. I attach a container with --network on docker run, or later with docker network connect, and detach it with disconnect. docker network inspect shows which containers are on the network and their IPs, and docker network ls and rm list and delete networks. I create one network per app stack instead of using the default bridge, which has no DNS by container name.",
    code: r`docker network create shop-net
docker run -d --name cache --network shop-net redis:7-alpine
docker run -d --name api nginx:alpine
docker network connect shop-net api
docker exec api ping -c 1 cache
docker network inspect --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}  {{end}}' shop-net
docker network ls --filter name=shop`,
    output: r`f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4
1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3c
4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d
PING cache (172.20.0.2): 56 data bytes
64 bytes from 172.20.0.2: seq=0 ttl=64 time=0.112 ms

--- cache ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss
round-trip min/avg/max = 0.112/0.112/0.112 ms
cache 172.20.0.2/16  api 172.20.0.3/16
NETWORK ID     NAME       DRIVER    SCOPE
f2a4c6e8b0d2   shop-net   bridge    local`,
  },
  {
    q: 'What does docker commit do, and why use a Dockerfile instead?',
    level: 'Intermediate',
    after: 'How do you see what changed inside a container and how an image was built?',
    a: "docker commit saves a container's current filesystem as a new image, so changes I made by hand inside it become part of an image. It's useful for debugging, for example to keep the state of a broken container and look at it later. I don't build real images this way, because nobody can see or repeat the steps: docker history just shows one opaque layer. Anything I ship goes into a Dockerfile.",
    code: r`docker run -d --name web nginx:alpine
docker exec web sh -c 'echo hotfix > /usr/share/nginx/html/index.html'
docker commit -m "manual hotfix" web web:hotfix
docker history --format "{{.Comment}}  {{.Size}}" web:hotfix | head -2`,
    output: r`2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b
sha256:9a7c5e3b1d9f7a5c3e1b9d7f5a3c1e9b7d5f3a1c9e7b5d3f1a9c7e5b3d1f9a7c
manual hotfix  12.3kB
buildkit.dockerfile.v0  0B`,
  },
  {
    q: 'What is the difference between docker save/load and docker export/import?',
    level: 'Intermediate',
    after: 'What does docker commit do, and why use a Dockerfile instead?',
    a: "docker save writes an image to a tar file with all its layers, tags and settings like CMD and ENV, and docker load restores it exactly. docker export dumps a container's filesystem as one flat tar with no history or settings, and docker import turns that into a new single-layer image, so I have to set CMD again with --change. I use save and load to move images to a server without registry access, like an air-gapped machine. export and import are rarely needed, mostly to flatten or inspect a filesystem.",
    code: r`docker save -o api.tar shop-api:1.4.0     # image: layers + metadata
docker load -i api.tar

docker export -o fs.tar web               # container filesystem only
docker import --change 'CMD ["nginx", "-g", "daemon off;"]' fs.tar web-flat:1
docker history --format "{{.CreatedBy}}" web-flat:1`,
    output: r`$ docker load -i api.tar
Loaded image: shop-api:1.4.0

$ docker import --change 'CMD ["nginx", "-g", "daemon off;"]' fs.tar web-flat:1
sha256:6c4e2a0b8d6f4a2c0e8b6d4f2a0c8e6b4d2f0a8c6e4b2d0f8a6c4e2b0d8f6a4c

$ docker history --format "{{.CreatedBy}}" web-flat:1
Imported from -`,
  },
]
