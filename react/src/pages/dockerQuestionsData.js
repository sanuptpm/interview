// Docker interview questions, basics to advanced.
// Each item: { q, level, a, code, output }. Outputs are realistic examples
// in Docker 29 CLI format; IDs, digests and timings are shortened
// or illustrative.

export const questions = [
  {
    q: "What is Docker and why do we use it?",
    level: 'Basics',
    a: "Docker is a platform that packages an application together with its runtime, libraries and config into a portable unit called a container. The container runs the same way on my laptop, in CI and in production, which removes the 'it works on my machine' problem. I use it to give every developer an identical environment and to ship one artifact through every stage of deployment.",
    code: `# Check the client and server are installed
docker --version

# Run a tiny test container (pulls the image the first time)
docker run --rm hello-world`,
    output: `Docker version 29.8.2, build 7fc2dff
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
e6590344b1a5: Pull complete
Digest: sha256:a0dfb02aac212703bfcb339d77d47ec32c8706ff250850ecc0e19c8737b18567
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.
...`,
  },
  {
    q: "What is the difference between a container and a virtual machine?",
    level: 'Basics',
    a: "A virtual machine virtualises hardware and runs a full guest operating system with its own kernel, so it is heavy and takes minutes to boot. A container shares the host's kernel and only isolates processes using namespaces and cgroups, so it starts in milliseconds and is usually megabytes instead of gigabytes. I reach for VMs when I need strong isolation or a different OS kernel, and containers for packaging and scaling applications.",
    code: `# A container is just an isolated process on the host kernel
docker run --rm alpine uname -r       # same kernel as the host/VM

# It starts almost instantly
time docker run --rm alpine echo "started"

# Inside, it only sees its own processes
docker run --rm alpine ps`,
    output: `6.12.54-linuxkit
started

real    0m0.412s
user    0m0.031s
sys     0m0.024s
PID   USER     TIME  COMMAND
    1 root      0:00 ps`,
  },
  {
    q: "What is the difference between an image and a container?",
    level: 'Basics',
    a: "An image is a read-only template made of layers that contains the filesystem and the default command for my app. A container is a running (or stopped) instance of an image with its own thin writable layer on top. One image can start many containers, just like one class can create many objects. I keep images small by using slim base images and multi-stage builds.",
    code: `# One image...
docker pull nginx:alpine

# ...many containers from it
docker run -d --name web1 nginx:alpine
docker run -d --name web2 nginx:alpine

docker ps --format "table {{.Names}}\\t{{.Image}}\\t{{.Status}}"`,
    output: `alpine: Pulling from library/nginx
Digest: sha256:4ff102c5d78d254a6f0da062b3cf39eaf07f01eec0927fd21e219d0af8bc0591
Status: Downloaded newer image for nginx:alpine
docker.io/library/nginx:alpine
3f9c1a7b2d4e8f6a0c5b9d1e7a3f2c8b4d6e0a1f9c3b7d5e2a8f4c6b0d1e3a5f
8b2e4d6f0a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b
NAMES     IMAGE          STATUS
web2      nginx:alpine   Up 2 seconds
web1      nginx:alpine   Up 3 seconds`,
  },
  {
    q: "What are the Docker Engine, the daemon and the CLI?",
    level: 'Basics',
    a: "Docker Engine is the client-server application at the heart of Docker. The daemon, dockerd, runs in the background and actually builds images and manages containers, networks and volumes; it talks to containerd and runc underneath. The CLI, docker, is just a client that sends REST API calls to the daemon over a socket. That is why 'docker version' shows a Client and a Server section, and why the CLI fails with 'cannot connect' when the daemon is not running.",
    code: `# Client and server are separate programs
docker version --format 'Client: {{.Client.Version}}  Server: {{.Server.Version}}'

# The CLI talks to the daemon over this socket
docker context ls

# If the daemon is stopped the CLI cannot do anything
docker ps`,
    output: `Client: 29.8.2  Server: 29.8.2

NAME              DESCRIPTION                               DOCKER ENDPOINT
default           Current DOCKER_HOST based configuration   unix:///var/run/docker.sock
desktop-linux *   Docker Desktop                            unix:///Users/me/.docker/run/docker.sock

(daemon stopped)
failed to connect to the docker API at unix:///Users/me/.docker/run/docker.sock;
check if the path is correct and if the daemon is running`,
  },
  {
    q: "What is Docker Hub and what is a registry?",
    level: 'Basics',
    a: "A registry is a server that stores and distributes images, organised into repositories and tags. Docker Hub is the default public registry, so 'nginx' really means 'docker.io/library/nginx:latest'. Companies also use private registries like Amazon ECR, GitHub Container Registry or a self-hosted one. I prefer official or verified-publisher images and pin specific tags rather than trusting 'latest'.",
    code: `# Short name -> full name on Docker Hub
docker pull python:3.12-slim
#   = docker.io/library/python:3.12-slim

# An image from another registry uses its host name
docker pull ghcr.io/my-org/api:1.4.0

# Tag a local image for a private registry, then push
docker tag myapi:1.4.0 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapi:1.4.0
docker push 123456789012.dkr.ecr.us-east-1.amazonaws.com/myapi:1.4.0`,
    output: `3.12-slim: Pulling from library/python
Digest: sha256:9c4e2f7a1b3d5e6f8a0c2b4d6e8f0a1c3e5b7d9f1a3c5e7b9d1f3a5c7e9b1d3f
Status: Downloaded newer image for python:3.12-slim
docker.io/library/python:3.12-slim

1.4.0: Pulling from my-org/api
Status: Downloaded newer image for ghcr.io/my-org/api:1.4.0

The push refers to repository [123456789012.dkr.ecr.us-east-1.amazonaws.com/myapi]
5f70bf18a086: Pushed
1.4.0: digest: sha256:7d1e3a5c... size: 1572`,
  },
  {
    q: "What are the basic commands to manage images and containers?",
    level: 'Basics',
    a: "The everyday lifecycle is: docker pull to download an image, docker run to create and start a container, docker ps to list running ones (add -a for stopped ones), docker stop and docker start to stop and restart it, docker rm to delete the container and docker rmi to delete the image. A container must be stopped before rm, unless I use rm -f. I use --rm on throwaway containers so I don't collect dead ones.",
    code: `docker pull nginx:alpine          # download image
docker images nginx               # list images
docker run -d --name web nginx:alpine
docker ps                         # running containers
docker stop web                   # graceful stop (SIGTERM)
docker ps -a                      # include stopped ones
docker start web                  # start it again
docker rm -f web                  # stop + remove container
docker rmi nginx:alpine           # remove the image`,
    output: `docker.io/library/nginx:alpine
IMAGE          ID             DISK USAGE   CONTENT SIZE   EXTRA
nginx:alpine   4ff102c5d78d       81.5MB         22.6MB
a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
CONTAINER ID   IMAGE          COMMAND                  CREATED         STATUS         PORTS     NAMES
a1b2c3d4e5f6   nginx:alpine   "/docker-entrypoint.…"   5 seconds ago   Up 4 seconds   80/tcp    web
web
CONTAINER ID   IMAGE          COMMAND                  CREATED          STATUS                     PORTS     NAMES
a1b2c3d4e5f6   nginx:alpine   "/docker-entrypoint.…"   12 seconds ago   Exited (0) 2 seconds ago             web
web
web
Untagged: nginx:alpine
Deleted: sha256:4ff102c5d78d254a6f0da062b3cf39eaf07f01eec0927fd21e219d0af8bc0591`,
  },
  {
    q: "What do the common docker run flags -d, -p, --name, -e, --rm and -it do?",
    level: 'Basics',
    a: "-d runs the container detached in the background, -p HOST:CONTAINER publishes a port, and --name gives it a readable name instead of a random one. -e sets an environment variable, --rm deletes the container automatically when it exits, and -it gives me an interactive terminal (stdin + TTY) for shells. My usual pattern is -d --name -p for services and --rm -it for one-off debugging shells.",
    code: `# Background web server on localhost:8080
docker run -d --name web -p 8080:80 nginx:alpine
curl -s -o /dev/null -w "%{http_code}\\n" localhost:8080

# Env var + auto-remove on exit
docker run --rm -e GREETING=hello alpine sh -c 'echo $GREETING'

# Interactive shell, removed when I exit
docker run --rm -it python:3.12-slim bash`,
    output: `c7d9e1f3a5b7c9d1e3f5a7b9c1d3e5f7a9b1c3d5e7f9a1b3c5d7e9f1a3b5c7d9
200
hello
root@5e7f9a1b3c5d:/# python --version
Python 3.12.12
root@5e7f9a1b3c5d:/# exit`,
  },
  {
    q: "How do you use docker exec and docker logs?",
    level: 'Basics',
    a: "docker exec runs an extra command inside an already running container, which I use to open a shell or check a file or env var without restarting it. docker logs shows whatever the main process wrote to stdout and stderr. I use logs -f to follow live output, --tail to limit lines and -t for timestamps. That is also why apps in containers should log to stdout rather than to files.",
    code: `docker run -d --name web -p 8080:80 nginx:alpine
curl -s localhost:8080 > /dev/null

# Run a command inside the running container
docker exec web nginx -v
docker exec -it web sh          # interactive shell

# Last 2 log lines, then keep following
docker logs --tail 2 web
docker logs -f web              # Ctrl+C to stop following`,
    output: `nginx version: nginx/1.29.3
/ # exit
2025/11/12 09:14:02 [notice] 1#1: start worker process 31
172.17.0.1 - - [12/Nov/2025:09:14:05 +0000] "GET / HTTP/1.1" 200 615 "-" "curl/8.7.1" "-"`,
  },
  {
    q: "What are the basic Dockerfile instructions?",
    level: 'Basics',
    a: "A Dockerfile is a recipe for building an image. FROM picks the base image, WORKDIR sets and creates the working directory, COPY copies files from the build context, RUN executes a command at build time and saves the result as a layer, EXPOSE documents the port the app listens on, and CMD sets the default command when the container starts. Remember that RUN happens at build time and CMD at run time, and EXPOSE does not actually publish the port; -p does.",
    code: `# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
# RUN = build time
RUN pip install -r requirements.txt
COPY . .
# EXPOSE is documentation only (publish with -p); CMD = run time
EXPOSE 8000
CMD ["python", "app.py"]`,
    output: `$ docker build -t hello-py .
 => [2/5] WORKDIR /app                                                     0.1s
 => [3/5] COPY requirements.txt .                                          0.0s
 => [4/5] RUN pip install -r requirements.txt                              8.6s
 => [5/5] COPY . .                                                         0.0s
 => => naming to docker.io/library/hello-py:latest                         0.0s

$ docker run --rm -p 8000:8000 hello-py
Serving on http://0.0.0.0:8000`,
  },
  {
    q: "How do you build an image with docker build -t?",
    level: 'Basics',
    a: "docker build reads the Dockerfile and sends the build context (usually the current directory, the final '.') to BuildKit. -t names and tags the result as name:tag, and I can pass -t several times to give the same image more than one tag. -f picks a different Dockerfile and --no-cache forces a clean rebuild. I always keep a .dockerignore so the context stays small and builds stay fast.",
    code: `# Build from ./Dockerfile with two tags
docker build -t myapi:1.0.0 -t myapi:latest .

# Use another Dockerfile and a different context folder
docker build -f docker/Dockerfile.prod -t myapi:prod ./backend

# Ignore the cache completely
docker build --no-cache -t myapi:1.0.0 .

docker images myapi`,
    output: `[+] Building 9.8s (10/10) FINISHED                         docker:desktop-linux
 => [internal] load build context                                          0.1s
 => => transferring context: 18.42kB                                       0.0s
 ...
 => => naming to docker.io/library/myapi:1.0.0                             0.0s
 => => naming to docker.io/library/myapi:latest                            0.0s

IMAGE          ID             DISK USAGE   CONTENT SIZE   EXTRA
myapi:1.0.0    b4d6e8f0a2c4        215MB         51.3MB
myapi:latest   b4d6e8f0a2c4        215MB         51.3MB
myapi:prod     e1f3a5c7b9d1        198MB         47.9MB`,
  },
  {
    q: "What are image tags and how should you version images?",
    level: 'Basics',
    a: "A tag is a human-friendly, movable label that points to an image ID, in the form repository:tag; if I leave it out Docker uses 'latest'. 'latest' is just a default name, not automatically the newest build, so I never deploy it in production. I tag with a semantic version and the git commit SHA, and for full reproducibility I can pin a base image by its immutable digest.",
    code: `# Same image, several tags
docker build -t myapi:1.4.2 .
docker tag myapi:1.4.2 myapi:1.4
docker tag myapi:1.4.2 myapi:sha-3f9c1a7

# Pin a base image by digest in a Dockerfile
#   FROM python:3.12-slim@sha256:9c4e2f7a1b3d...

docker images myapi --format "{{.Repository}}:{{.Tag}}  {{.ID}}"`,
    output: `myapi:1.4.2  b4d6e8f0a2c4
myapi:1.4  b4d6e8f0a2c4
myapi:sha-3f9c1a7  b4d6e8f0a2c4`,
  },
  {
    q: "How do you filter and format the output of docker images and docker ps?",
    level: 'Basics',
    a: "Both commands take --filter to narrow the list, for example dangling=true for untagged leftover images, reference= for a repository pattern, or status=exited for stopped containers. --format with a Go template picks exactly the columns I want, and the 'table' prefix keeps the headers. I use -q to print only IDs, which is perfect for piping into docker rm or docker rmi in scripts.",
    code: `# Untagged leftovers from rebuilds
docker images --filter dangling=true

# Only my app images, custom columns
docker images --filter "reference=myapi:*" \\
  --format "table {{.Repository}}:{{.Tag}}\\t{{.ID}}\\t{{.Size}}"

# Stopped containers, names and status only
docker ps -a --filter status=exited --format "{{.Names}}: {{.Status}}"

# IDs only -> remove all exited containers
docker rm $(docker ps -aq --filter status=exited)`,
    output: `REPOSITORY   TAG       IMAGE ID       CREATED        SIZE
<none>       <none>    5e8a1c3b7d90   2 hours ago    162MB
REPOSITORY:TAG   IMAGE ID       SIZE
myapi:1.4.2      b4d6e8f0a2c4   162MB
myapi:1.4.1      9a7c5e3b1d2f   161MB
migrate: Exited (0) 3 hours ago
worker: Exited (137) 20 minutes ago
4c2e9a7b1f3d
8b1d5f2a6c9e`,
  },
  {
    q: "What states can a container be in, and how do you move between them?",
    level: 'Basics',
    a: "A container is created (exists but never started), running, paused (processes frozen), restarting, exited (main process ended) or dead. docker create, start, pause, unpause, stop and rm move it between those states, and docker ps -a shows all of them, not just running ones. When something looks wrong I check the state and exit code first, because an exited container keeps its filesystem and logs until I remove it.",
    code: `docker create --name web nginx:alpine
docker ps -a --filter name=web --format "{{.Names}}  {{.State}}"
docker start web
docker pause web
docker ps --filter name=web --format "{{.Names}}  {{.Status}}"
docker unpause web
docker stop web
docker inspect --format '{{.State.Status}} exit={{.State.ExitCode}}' web
docker rm web`,
    output: `3f7a9c1e5b2d8f4a6c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a
web  created
web
web
web  Up 6 seconds (Paused)
web
web
exited exit=0
web`,
  },
  {
    q: "How do you copy files between a container and the host with docker cp?",
    level: 'Basics',
    a: "docker cp copies files or folders in either direction: container:path to the host, or host path to container:path, and it works even on a stopped container. I use it to pull out a log file, a crash dump or a generated report, or to drop a config file into a container while debugging. For anything permanent I use a volume or rebuild the image instead, because copied files disappear when the container is removed.",
    code: `docker run -d --name web nginx:alpine

# Container -> host
docker cp web:/etc/nginx/conf.d/default.conf ./default.conf
head -3 default.conf

# Host -> container, then reload nginx
docker cp ./maintenance.html web:/usr/share/nginx/html/
docker exec web ls /usr/share/nginx/html
docker exec web nginx -s reload`,
    output: `Successfully copied 3.07kB to /home/dev/default.conf
server {
    listen       80;
    listen  [::]:80;
Successfully copied 2.05kB to web:/usr/share/nginx/html/
50x.html
index.html
maintenance.html
2026/11/12 10:15:02 [notice] 31#31: signal process started`,
  },
  {
    q: "How do you see live resource usage and processes of running containers?",
    level: 'Basics',
    a: "docker stats streams CPU, memory, network and disk I/O for every running container, like top for containers, and --no-stream gives a one-time snapshot. docker top shows the processes running inside one container as seen from the host. When an app is slow, I check docker stats first to see whether it is hitting its memory or CPU limit before I dig into the code.",
    code: `# One snapshot for all running containers
docker stats --no-stream

# Only the columns I care about
docker stats --no-stream --format "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemPerc}}"

# Processes inside the api container
docker top api`,
    output: `CONTAINER ID   NAME      CPU %     MEM USAGE / LIMIT     MEM %     NET I/O           BLOCK I/O        PIDS
a1b2c3d4e5f6   api       12.41%    187.3MiB / 512MiB     36.58%    2.31MB / 4.87MB   12.3MB / 0B      9
b2c3d4e5f6a7   db        1.87%     64.12MiB / 7.66GiB    0.82%     4.12MB / 1.95MB   48.1MB / 31MB    11
c3d4e5f6a7b8   web       0.00%     9.25MiB / 7.66GiB     0.12%     1.02MB / 3.4MB    0B / 4.1kB       9
NAME      CPU %     MEM %
api       12.41%    36.58%
db        1.87%     0.82%
web       0.00%     0.12%
UID     PID     PPID    C   STIME   TTY   TIME       CMD
1000    41522   41501   2   10:02   ?     00:00:09   /usr/local/bin/python /usr/local/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --workers 2
1000    41580   41522   5   10:02   ?     00:00:21   /usr/local/bin/python -c from multiprocessing.spawn import spawn_main ...
1000    41581   41522   5   10:02   ?     00:00:20   /usr/local/bin/python -c from multiprocessing.spawn import spawn_main ...`,
  },
  {
    q: "How do you see what changed inside a container and how an image was built?",
    level: 'Basics',
    a: "docker diff lists files added (A), changed (C) or deleted (D) in a container's writable layer compared to its image, which tells me if an app is writing where it shouldn't. docker history shows the layers of an image with the instruction that created each one and its size. I use history to spot the one fat layer, like a forgotten cache or a big COPY, when an image is larger than expected.",
    code: `docker run -d --name web nginx:alpine
docker exec web sh -c 'echo hi > /tmp/note.txt && rm /etc/nginx/conf.d/default.conf'
docker diff web

# Layers, newest first, with the instruction that made them
docker history --format "table {{.CreatedBy}}\\t{{.Size}}" myapi:1.4.2`,
    output: `C /etc
C /etc/nginx
C /etc/nginx/conf.d
D /etc/nginx/conf.d/default.conf
C /run
A /run/nginx.pid
C /tmp
A /tmp/note.txt
CREATED BY                                      SIZE
CMD ["uvicorn" "main:app" "--host" "0.0.0.0"…   0B
USER app                                        0B
COPY . . # buildkit                             48.2kB
RUN /bin/sh -c pip install --no-cache-dir -r…   41.3MB
COPY requirements.txt . # buildkit              92B
WORKDIR /app                                    0B
CMD ["python3"]                                 0B
RUN /bin/sh -c set -eux;  savedAptMark="$(ap…   38.9MB
...`,
  },
  {
    q: "What is the difference between CMD and ENTRYPOINT?",
    level: 'Intermediate',
    a: "ENTRYPOINT defines the executable that always runs, while CMD supplies default arguments that are easily replaced by whatever I type after the image name in docker run. When both are set, CMD is appended to ENTRYPOINT. I always use the exec (JSON array) form so my process becomes PID 1 and receives signals, and I override an ENTRYPOINT only with --entrypoint.",
    code: `# Dockerfile
FROM alpine:3.22
ENTRYPOINT ["ping", "-c", "2"]
CMD ["localhost"]

# Build and run
docker build -t pinger .
docker run --rm pinger              # ping -c 2 localhost
docker run --rm pinger 127.0.0.1    # CMD replaced
docker run --rm --entrypoint echo pinger hi`,
    output: `PING localhost (::1): 56 data bytes
64 bytes from ::1: seq=0 ttl=64 time=0.041 ms
64 bytes from ::1: seq=1 ttl=64 time=0.067 ms

--- localhost ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.041/0.054/0.067 ms
PING 127.0.0.1 (127.0.0.1): 56 data bytes
64 bytes from 127.0.0.1: seq=0 ttl=64 time=0.038 ms
64 bytes from 127.0.0.1: seq=1 ttl=64 time=0.071 ms

--- 127.0.0.1 ping statistics ---
2 packets transmitted, 2 packets received, 0% packet loss
round-trip min/avg/max = 0.038/0.054/0.071 ms
hi`,
  },
  {
    q: "What is the difference between COPY and ADD?",
    level: 'Intermediate',
    a: "Both copy files into the image, but COPY does only that: local files from the build context. ADD has extra magic: it auto-extracts local tar archives and can download from a URL or git repo. Because that magic can be surprising, I use COPY by default and only use ADD when I really want a tarball extracted. For downloads I prefer RUN curl so I can verify a checksum and clean up in the same layer.",
    code: `# Dockerfile
FROM alpine:3.22
WORKDIR /data

# Plain copy - predictable, preferred
COPY config.json .

# ADD extracts a local tar archive automatically
ADD vendor.tar.gz /opt/vendor/

RUN ls /data /opt/vendor`,
    output: ` => [4/4] RUN ls /data /opt/vendor                                         0.2s
 => => # /data:
 => => # config.json
 => => #
 => => # /opt/vendor:
 => => # lib
 => => # README.md`,
  },
  {
    q: "What is the difference between ARG and ENV?",
    level: 'Intermediate',
    a: "ARG is a build-time variable: I pass it with --build-arg and it exists only while the image is building, which is why version is empty when the container runs. ENV sets an environment variable that is baked into the image and is visible to the running container, and it can be overridden with -e at run time. I never put secrets in either, because both can be seen in docker history or docker inspect.",
    code: `# Dockerfile
FROM alpine:3.22
# ARG: build time only. ENV: build time and run time
ARG APP_VERSION=dev
ENV APP_ENV=production
RUN echo "building version $APP_VERSION"
CMD ["sh", "-c", "echo env=$APP_ENV version=$APP_VERSION"]

docker build --build-arg APP_VERSION=1.2.0 -t argenv .
docker run --rm argenv
docker run --rm -e APP_ENV=staging argenv`,
    output: ` => [2/2] RUN echo "building version 1.2.0"                                0.2s
 => => # building version 1.2.0

env=production version=
env=staging version=`,
  },
  {
    q: "What are layers and how does the build cache work?",
    level: 'Intermediate',
    a: "Each RUN, COPY and ADD instruction creates a layer, and Docker caches every layer. On a rebuild, once an instruction or the files it copies change, that layer and every layer after it are rebuilt. So I order instructions from least to most frequently changing: copy the dependency file and install dependencies first, then copy the source code. That way a code change takes seconds instead of reinstalling all packages.",
    code: `# Dockerfile - cache-friendly order
FROM node:22-alpine
WORKDIR /app
# Dependencies change rarely -> these layers stay cached
COPY package.json package-lock.json ./
RUN npm ci
# Source changes often -> only these rerun
COPY . .
RUN npm run build

docker build -t web .    # after editing src/App.jsx`,
    output: ` => CACHED [2/6] WORKDIR /app                                              0.0s
 => CACHED [3/6] COPY package.json package-lock.json ./                    0.0s
 => CACHED [4/6] RUN npm ci                                                0.0s
 => [5/6] COPY . .                                                         0.1s
 => [6/6] RUN npm run build                                                4.9s`,
  },
  {
    q: "What is a .dockerignore file?",
    level: 'Intermediate',
    a: "A .dockerignore lists files and folders that should not be sent to the daemon as the build context, using the same pattern style as .gitignore. It makes builds faster, keeps images smaller and stops secrets like .env files or the .git folder from ending up in an image through COPY . . I always exclude node_modules, build output, .git and local env files.",
    code: `# .dockerignore
node_modules
dist
.git
.env
.env.*
!.env.example
__pycache__
.venv`,
    output: `# Without .dockerignore
 => [internal] load build context                                          7.9s
 => => transferring context: 312.48MB                                      7.8s

# With .dockerignore
 => [internal] load build context                                          0.1s
 => => transferring context: 214.06kB                                      0.0s`,
  },
  {
    q: "What is a multi-stage build? Show a React app built with Node and served by Nginx.",
    level: 'Intermediate',
    a: "A multi-stage build uses several FROM stages in one Dockerfile; I build in a heavy stage that has compilers and dev dependencies, then copy only the finished artifacts into a small final stage. The final image contains no Node, no node_modules and no source code. For a React app the result is just Nginx plus static files, which shrinks the image from over a gigabyte to around 50 MB and reduces the attack surface.",
    code: `# Dockerfile
# Stage 1: build
FROM node:22-alpine AS build
WORKDIR /app
COPY . .
RUN npm ci && npm run build        # outputs /app/dist

# Stage 2: serve only the static files
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html`,
    output: `$ docker build -t react-web .
 => [build 4/4] RUN npm ci && npm run build                               18.6s
 => [stage-1 2/2] COPY --from=build /app/dist /usr/share/nginx/html        0.1s

$ docker images --format "{{.Repository}}:{{.Tag}}  {{.Size}}"
react-web:latest  82.1MB
node:22-alpine  226MB`,
  },
  {
    q: "How would you write a multi-stage build for a Python app?",
    level: 'Intermediate',
    a: "For Python I install dependencies in a builder stage into a virtual environment, because that is where build tools like gcc live when some packages need compiling. Then I copy just the virtual environment and the code into a clean slim image, so build tools never reach production. In real projects I also set PYTHONUNBUFFERED=1 so logs appear immediately.",
    code: `# Dockerfile
FROM python:3.12-slim AS builder
RUN python -m venv /venv
COPY requirements.txt .
RUN /venv/bin/pip install -r requirements.txt

FROM python:3.12-slim
COPY --from=builder /venv /venv
COPY . /app
CMD ["/venv/bin/python", "/app/main.py"]`,
    output: `$ docker images --format "table {{.Repository}}\\t{{.Size}}"
REPOSITORY       SIZE
py-single-stage  612MB
py-multi-stage   187MB`,
  },
  {
    q: "How do you reduce Docker image size?",
    level: 'Intermediate',
    a: "I start from a small base like alpine or a -slim variant, use multi-stage builds so build tools stay out of the final image, and combine related RUN commands so package-manager caches are deleted in the same layer they were created. I also use --no-cache-dir for pip, --no-install-recommends for apt, and a good .dockerignore. docker history shows me which layer is the heavy one.",
    code: `# One layer: install and clean up in the same step
FROM debian:bookworm-slim
RUN apt-get update \\
 && apt-get install -y --no-install-recommends curl \\
 && rm -rf /var/lib/apt/lists/*

# Find the heavy layers
docker history --format "{{.Size}}\\t{{.CreatedBy}}" myimage`,
    output: `0B      CMD ["bash"]
18.4MB  RUN /bin/sh -c apt-get update  && apt-get install -y --no-install-re…
74.8MB  # debian.sh --arch 'arm64' out/ 'bookworm' '@1762128000'`,
  },
  {
    q: "What is the difference between volumes, bind mounts and tmpfs mounts?",
    level: 'Intermediate',
    a: "A volume is storage managed by Docker in its own area; it survives container removal and is the preferred way to persist data. A bind mount maps a specific folder from my host into the container, which I use in development for live code reloading. A tmpfs mount lives only in memory and disappears when the container stops, which is good for temporary or sensitive files. I use --mount in scripts because it is more explicit than -v.",
    code: `# Named volume (managed by Docker)
docker volume create app-data
docker run --rm -v app-data:/data alpine sh -c 'echo saved > /data/f.txt'
docker run --rm -v app-data:/data alpine cat /data/f.txt

# Bind mount (host folder, read-only here)
docker run --rm -v "$(pwd)":/src:ro alpine ls /src

# tmpfs (memory only)
docker run --rm --mount type=tmpfs,destination=/cache alpine df -h /cache`,
    output: `app-data
saved
Dockerfile
main.py
requirements.txt
Filesystem                Size      Used Available Use% Mounted on
tmpfs                     3.8G         0      3.8G   0% /cache`,
  },
  {
    q: "How do you persist database data in Docker?",
    level: 'Intermediate',
    a: "A container's writable layer is deleted with the container, so for a database I mount a named volume at the data directory, for Postgres that is /var/lib/postgresql/data. Then I can stop, remove or upgrade the container and the data stays. For backups I don't copy the volume files while it is running; I use pg_dump through docker exec.",
    code: `docker volume create pgdata
docker run -d --name db -e POSTGRES_PASSWORD=secret \\
  -v pgdata:/var/lib/postgresql/data postgres:17-alpine
docker exec db psql -U postgres -c "CREATE TABLE t(id int); INSERT INTO t VALUES (1);"

# Remove the container, start a new one on the same volume
docker rm -f db
docker run -d --name db -e POSTGRES_PASSWORD=secret \\
  -v pgdata:/var/lib/postgresql/data postgres:17-alpine
docker exec db psql -U postgres -c "SELECT * FROM t;"`,
    output: `pgdata
d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4
INSERT 0 1
db
f1a3c5e7b9d1f3a5c7e9b1d3f5a7c9e1b3d5f7a9c1e3b5d7f9a1c3e5b7d9f1a3
 id
----
  1
(1 row)`,
  },
  {
    q: "Explain Docker networking: bridge, host, none and user-defined networks.",
    level: 'Intermediate',
    a: "By default containers join the bridge network and get a private IP, reaching the outside world through NAT. The host driver removes network isolation so the container uses the host's network stack directly, and none gives it only a loopback interface. For real apps I create a user-defined bridge network, because containers on it can reach each other by container name through Docker's built-in DNS, which the default bridge does not provide.",
    code: `docker network ls

# none: only loopback
docker run --rm --network none alpine ip -brief addr

# user-defined bridge with DNS by name
docker network create appnet
docker run -d --name api --network appnet nginx:alpine
docker run --rm --network appnet alpine ping -c 1 api`,
    output: `NETWORK ID     NAME      DRIVER    SCOPE
1a2b3c4d5e6f   bridge    bridge    local
7a8b9c0d1e2f   host      host      local
3e4f5a6b7c8d   none      null      local
lo               UNKNOWN        127.0.0.1/8 ::1/128
9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d
5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f
PING api (172.18.0.2): 56 data bytes
64 bytes from 172.18.0.2: seq=0 ttl=64 time=0.112 ms

--- api ping statistics ---
1 packets transmitted, 1 packets received, 0% packet loss
round-trip min/avg/max = 0.112/0.112/0.112 ms`,
  },
  {
    q: "How does port mapping work?",
    level: 'Intermediate',
    a: "Containers have their own network namespace, so a port the app listens on is not reachable from the host until I publish it with -p HOST:CONTAINER. I can bind to a specific host IP like 127.0.0.1 so a database isn't exposed to the whole network. Containers talking to each other on the same network don't need -p at all; they use the container port directly.",
    code: `# host 8080 -> container 80
docker run -d --name web -p 8080:80 nginx:alpine

# only reachable from this machine
docker run -d --name db -p 127.0.0.1:5432:5432 \\
  -e POSTGRES_PASSWORD=secret postgres:17-alpine

docker port web
docker port db`,
    output: `80/tcp -> 0.0.0.0:8080
80/tcp -> [::]:8080
5432/tcp -> 127.0.0.1:5432`,
  },
  {
    q: "How do you handle environment variables and secrets?",
    level: 'Intermediate',
    a: "For normal config I pass environment variables with -e or an --env-file, keeping the image the same across environments. Secrets are different: I never bake them into the image with ENV, ARG or COPY, because they stay in the layers and history. At build time I use BuildKit secret mounts, and at run time I use Compose or Swarm secrets, or the cloud provider's secret manager, which mount the value as a file.",
    code: `# Run-time config from a file (not committed to git)
docker run --rm --env-file .env alpine sh -c 'echo $DB_HOST'

# Build-time secret: only visible during this RUN, never in a layer
#   RUN --mount=type=secret,id=npm_token \\
#       NPM_TOKEN=$(cat /run/secrets/npm_token) npm ci
docker build --secret id=npm_token,src=./npm_token.txt -t web .`,
    output: `db.internal

 => [4/5] RUN --mount=type=secret,id=npm_token NPM_TOKEN=$(cat /run/secr  14.2s
 => => naming to docker.io/library/web:latest                              0.0s

$ docker history web | grep -c npm_token
0`,
  },
  {
    q: "What is Docker Compose? Show a FastAPI + PostgreSQL + React stack.",
    level: 'Intermediate',
    a: "Docker Compose lets me describe a multi-container app in one YAML file: services, networks, volumes and environment, then start everything with one command. Compose creates a network for the project automatically, so services reach each other by service name, like 'db' in the DATABASE_URL. I use depends_on to start the API after Postgres (in production with a healthcheck condition so it really waits), and a named volume for the database data.",
    code: `services:
  db:
    image: postgres:17-alpine
    environment: { POSTGRES_PASSWORD: secret }
    volumes: ["pgdata:/var/lib/postgresql/data"]
  api:
    build: ./backend
    environment: { DATABASE_URL: "postgresql://postgres:secret@db:5432/postgres" }
    depends_on: [db]
    ports: ["8000:8000"]
  web: { build: ./frontend, ports: ["3000:80"], depends_on: [api] }
volumes: { pgdata: {} }`,
    output: `$ docker compose up -d --build
[+] Running 5/5
 ✔ Network shop_default    Created                                         0.1s
 ✔ Volume shop_pgdata      Created                                         0.0s
 ✔ Container shop-db-1     Started                                         0.6s
 ✔ Container shop-api-1    Started                                         0.8s
 ✔ Container shop-web-1    Started                                         1.0s`,
  },
  {
    q: "What are the most used docker compose commands?",
    level: 'Intermediate',
    a: "docker compose up -d builds if needed and starts all services in the background, and down stops and removes the containers and the network; adding -v also removes named volumes, so I am careful with that. ps shows the services and their health, logs -f follows logs, and exec opens a shell in a running service. I use up --build after changing a Dockerfile and config to check the merged file.",
    code: `docker compose up -d            # start everything
docker compose ps               # status
docker compose logs -f --tail 3 api
docker compose exec db psql -U app -c "select 1"
docker compose restart api
docker compose down             # keep volumes
docker compose down -v          # also delete volumes!`,
    output: `NAME         IMAGE                COMMAND                  SERVICE   CREATED          STATUS                    PORTS
shop-api-1   shop-api             "uvicorn app.main:ap…"   api       12 seconds ago   Up 6 seconds              0.0.0.0:8000->8000/tcp
shop-db-1    postgres:17-alpine   "docker-entrypoint.s…"   db        12 seconds ago   Up 11 seconds (healthy)   5432/tcp
shop-web-1   shop-web             "/docker-entrypoint.…"   web       12 seconds ago   Up 6 seconds              0.0.0.0:3000->80/tcp
api-1  | INFO:     Started server process [1]
api-1  | INFO:     Application startup complete.
api-1  | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
 ?column?
----------
        1
(1 row)

[+] Running 1/1
 ✔ Container shop-api-1  Started                                           0.4s
[+] Running 4/4
 ✔ Container shop-web-1    Removed                                         0.3s
 ✔ Container shop-api-1    Removed                                         0.4s
 ✔ Container shop-db-1     Removed                                         0.3s
 ✔ Network shop_default    Removed                                         0.2s`,
  },
  {
    q: "What is a healthcheck and why use it?",
    level: 'Intermediate',
    a: "A container being 'Up' only means its process is running, not that the app actually works. A HEALTHCHECK runs a command periodically inside the container and marks it healthy or unhealthy based on the exit code. Compose can wait for service_healthy, and orchestrators use health to restart or stop routing traffic. I keep the check cheap, like hitting a /health endpoint, and give the app a start period to boot.",
    code: `# Dockerfile
FROM nginx:alpine
HEALTHCHECK --interval=10s --timeout=3s --start-period=5s --retries=3 \\
  CMD wget -qO- http://localhost/ || exit 1

# Commands
docker build -t web-hc .
docker run -d --name web web-hc
docker ps --format "{{.Names}}: {{.Status}}"
docker inspect --format '{{.State.Health.Status}}' web`,
    output: `web: Up 2 seconds (health: starting)

(15 seconds later)
web: Up 17 seconds (healthy)
healthy`,
  },
  {
    q: "What are restart policies?",
    level: 'Intermediate',
    a: "A restart policy tells the daemon what to do when a container exits. 'no' is the default; on-failure restarts only after a non-zero exit, optionally with a retry limit; always restarts it no matter what, including after a daemon restart; unless-stopped is like always but respects a manual docker stop. I use unless-stopped for simple single-host services; in Kubernetes or Swarm the orchestrator handles this instead.",
    code: `# Crashes after 1 second, retried up to 3 times
docker run -d --name flaky --restart on-failure:3 \\
  alpine sh -c 'echo crash; sleep 1; exit 1'

docker inspect --format \\
  'restarts={{.RestartCount}} status={{.State.Status}} exit={{.State.ExitCode}}' flaky
docker logs flaky

# Compose
#   services:
#     api:
#       restart: unless-stopped`,
    output: `restarts=3 status=exited exit=1
crash
crash
crash
crash`,
  },
  {
    q: "What are Compose profiles and override files?",
    level: 'Intermediate',
    a: "Profiles let me mark optional services, like Adminer or a mail catcher, so they only start when I ask for that profile with --profile. Override files let me layer config: docker compose automatically merges compose.override.yaml on top of compose.yaml, and with several -f flags later files win. I keep production-like settings in compose.yaml and put dev-only things like bind mounts and debug ports in the override, then check the merged result with docker compose config.",
    code: `# compose.yaml
services:
  api: { image: "myapi:1.4.2" }
  adminer: { image: adminer, profiles: [debug] }   # only with --profile debug

# compose.override.yaml (merged automatically)
services:
  api: { ports: ["8000:8000"] }

docker compose up -d
docker compose --profile debug up -d`,
    output: `$ docker compose up -d
[+] Running 2/2
 ✔ Network shop_default  Created    0.1s
 ✔ Container shop-api-1  Started    0.8s

$ docker compose --profile debug up -d
[+] Running 2/2
 ✔ Container shop-api-1      Running    0.0s
 ✔ Container shop-adminer-1  Started    0.4s`,
  },
  {
    q: "How do you get hot reload in development with Docker Compose?",
    level: 'Intermediate',
    a: "The classic way is a bind mount of my source folder plus a dev server with reload, like uvicorn --reload or Vite. Compose watch (the develop.watch section, started with docker compose watch or up --watch) is the newer option: sync copies changed files into the container, and rebuild rebuilds the image when files like package.json change. It avoids bind-mount performance and permission problems on Mac and Windows.",
    code: `# compose.yaml
services:
  web:
    build: .
    command: npm run dev -- --host
    ports: ["5173:5173"]
    develop:
      watch:
        - { action: sync, path: ./src, target: /app/src }   # copy changes in
        - { action: rebuild, path: package.json }           # new dependency

docker compose watch`,
    output: `Watch enabled
web-1  |   VITE v7.2.2  ready in 412 ms
Syncing service "web" after 1 changes were detected
web-1  | 10:21:44 AM [vite] (client) hmr update /src/App.jsx
Rebuilding service(s) ["web"] after changes were detected...
 ✔ Container web-web-1  Recreated    0.9s`,
  },
  {
    q: "What are BuildKit cache mounts and how do they speed up builds?",
    level: 'Intermediate',
    a: "A normal RUN layer is thrown away when its input changes, so one new dependency means downloading everything again. RUN --mount=type=cache keeps a folder, like the pip, npm or apt cache, between builds without putting it into the image. Dependency installs then only fetch what is new, and the image stays small because the cache is never part of a layer. In CI I combine it with a registry or GitHub Actions cache backend.",
    code: `# syntax=docker/dockerfile:1
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
# pip's cache survives between builds but never enters the image
RUN --mount=type=cache,target=/root/.cache/pip \\
    pip install -r requirements.txt
COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]

# Node equivalent:
#   RUN --mount=type=cache,target=/root/.npm npm ci`,
    output: `$ docker build -t myapi .           # first build
 => [4/5] RUN --mount=type=cache,target=/root/.cache/pip pip install ...   38.4s

# add one package to requirements.txt and rebuild
$ docker build -t myapi .
 => [4/5] RUN --mount=type=cache,target=/root/.cache/pip pip install ...    4.1s
Using cached fastapi-0.121.1-py3-none-any.whl
Using cached pydantic-2.12.4-py3-none-any.whl
Downloading orjson-3.11.4-cp312-cp312-manylinux_2_17_x86_64.whl (136 kB)`,
  },
  {
    q: "Alpine vs slim vs distroless base images: what are the trade-offs?",
    level: 'Intermediate',
    a: "Alpine is tiny but uses musl instead of glibc, so some Python wheels and native libraries must be compiled or behave differently. Debian slim is bigger but compatible with almost everything, and distroless has only the runtime and my app: no shell or package manager, which means a much smaller attack surface. My default is slim for the build stage and slim or distroless for the final stage; with distroless I debug through a :debug variant or an ephemeral debug container.",
    code: `FROM python:3.12-slim AS build
COPY requirements.txt .
RUN pip install --target=/deps -r requirements.txt

# Final stage: no shell, no package manager, runs as nonroot
FROM gcr.io/distroless/python3-debian12:nonroot
COPY --from=build /deps /deps
COPY main.py /app/
ENV PYTHONPATH=/deps
CMD ["/app/main.py"]`,
    output: `$ docker images --format "table {{.Repository}}:{{.Tag}}\\t{{.Size}}"
REPOSITORY:TAG                         SIZE
python:3.12-alpine                     47.1MB
python:3.12-slim                       124MB
gcr.io/distroless/python3-debian12     52.8MB
myapi:distroless                       96.4MB

$ docker exec -it api sh
OCI runtime exec failed: exec failed: unable to start container process: exec: "sh": executable file not found in $PATH: unknown`,
  },
  {
    q: "How do you build multi-architecture images with docker buildx?",
    level: 'Intermediate',
    a: "Many teams build on Apple Silicon (arm64) but deploy to x86 servers, or run cheaper ARM instances like AWS Graviton, so one tag should work on both. docker buildx build --platform linux/amd64,linux/arm64 builds both variants and pushes a manifest list, and each host pulls the right one automatically. Emulated builds with QEMU are slow, so for heavy builds I use native ARM runners or cross-compile in the build stage.",
    code: `# A builder that supports multi-platform output
docker buildx create --name multi --driver docker-container --use

docker buildx build \\
  --platform linux/amd64,linux/arm64 \\
  -t ghcr.io/acme/api:1.5.0 \\
  --push .

# One tag, two images
docker buildx imagetools inspect ghcr.io/acme/api:1.5.0`,
    output: `multi
[+] Building 96.3s (24/24) FINISHED                docker-container:multi
 => [linux/amd64 4/5] RUN pip install -r requirements.txt            21.7s
 => [linux/arm64 4/5] RUN pip install -r requirements.txt            63.2s
 => pushing manifest for ghcr.io/acme/api:1.5.0                       1.4s
Name:      ghcr.io/acme/api:1.5.0
MediaType: application/vnd.oci.image.index.v1+json
Digest:    sha256:5f2c8e1a9b7d3f6e0c4a2b8d1e7f9a3c5b0d2e4f6a8c0b2d4e6f8a0c2e4b6d8f

Manifests:
  Name:      ghcr.io/acme/api:1.5.0@sha256:1a3c5e7b9d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c
  Platform:  linux/amd64

  Name:      ghcr.io/acme/api:1.5.0@sha256:7e9a1c3e5b7d9f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a
  Platform:  linux/arm64`,
  },
  {
    q: "What is the difference between named and anonymous volumes, and how do you back up a volume?",
    level: 'Intermediate',
    a: "A named volume has a name I choose, like pgdata, so it is easy to reuse and survives docker compose down; an anonymous volume gets a random ID, often from a VOLUME line in a Dockerfile, and is easy to lose or leave behind as clutter. docker run --rm -v removes anonymous volumes with the container, but never named ones. To back up a volume I mount it read-only into a throwaway container and tar it to a bind-mounted folder, and I restore the same way in reverse (for databases, pg_dump is even safer).",
    code: `docker run -d --name db -v pgdata:/var/lib/postgresql/data postgres:17
docker run -d --name cache redis:8     # VOLUME /data -> anonymous
docker volume ls

# Backup: volume -> tar file on the host
docker run --rm -v pgdata:/data:ro -v "$PWD":/backup alpine \\
  tar czf /backup/pgdata-2026-11-12.tgz -C /data .
ls -lh pgdata-2026-11-12.tgz

# Restore into a new volume
docker run --rm -v pgdata_restored:/data -v "$PWD":/backup alpine \\
  tar xzf /backup/pgdata-2026-11-12.tgz -C /data`,
    output: `9c1e3a5b7d9f...
2b4d6f8a0c2e...
DRIVER    VOLUME NAME
local     8f3a1c5e7b9d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f0a2c4e6b8d0f2a
local     pgdata
-rw-r--r--  1 dev  staff   7.9M Nov 12 10:30 pgdata-2026-11-12.tgz`,
  },
  {
    q: "Why should containers run as a non-root user?",
    level: 'Advanced',
    a: "By default the process inside a container runs as root, and if an attacker escapes the app or the container, root makes the damage far worse. I create a dedicated user in the Dockerfile and switch with USER, after installing packages but before the CMD, and make sure the files it needs are owned by it with COPY --chown. Many official images already ship a user, like node in the node images, and I can enforce it at run time with --user.",
    code: `# Dockerfile
FROM python:3.12-slim
RUN groupadd --system app && useradd --system --gid app app
WORKDIR /app
COPY --chown=app:app . .
USER app
CMD ["python", "-c", "import os, getpass; print(getpass.getuser(), os.getuid())"]

# Commands
docker build -t nonroot .
docker run --rm nonroot
docker run --rm nonroot id`,
    output: `app 999
uid=999(app) gid=999(app) groups=999(app)`,
  },
  {
    q: "How do you scan images for vulnerabilities? What is Docker Scout?",
    level: 'Advanced',
    a: "Images contain OS packages and libraries that can have known CVEs, so I scan them before shipping. Docker Scout is Docker's built-in tool: it builds a software bill of materials (SBOM) for an image, matches it against vulnerability databases, and recommends a base image update that fixes the most issues. I run it, or an alternative like Trivy, in CI and fail the build on critical or high findings.",
    code: `# Quick overview of an image
docker scout quickview myapi:1.4.2

# Only critical and high CVEs
docker scout cves --only-severity critical,high myapi:1.4.2

# Suggested base-image upgrades
docker scout recommendations myapi:1.4.2

# Same idea with Trivy
#   trivy image --severity HIGH,CRITICAL --exit-code 1 myapi:1.4.2`,
    output: `    ✓ SBOM of image already cached, 142 packages indexed

  Target             │  myapi:1.4.2      │    0C     2H     5M    11L
    digest           │  b4d6e8f0a2c4     │
  Base image         │  python:3.12-slim │    0C     1H     3M    11L
  Updated base image │  python:3.13-slim │    0C     0H     1M     9L
                     │                   │           -1     -2     -2

What's next:
    View vulnerabilities → docker scout cves myapi:1.4.2
    View base image update recommendations → docker scout recommendations myapi:1.4.2`,
  },
  {
    q: "How do you set resource limits like --memory and --cpus?",
    level: 'Advanced',
    a: "Without limits a single container can use all the host's memory and CPU and starve everything else. --memory sets a hard memory cap, and if the process goes above it the kernel OOM-kills it; --cpus limits how many CPU cores' worth of time it gets. I set limits on every production service and check usage with docker stats; in Compose the same goes under deploy.resources.limits.",
    code: `docker run -d --name limited --memory 256m --cpus 0.5 nginx:alpine
docker stats --no-stream --format \\
  "table {{.Name}}\\t{{.CPUPerc}}\\t{{.MemUsage}}" limited

# Going over the memory limit -> OOM killed
docker run --name oom --memory 32m python:3.12-slim \\
  python -c "x = bytearray(100 * 1024 * 1024)"
docker inspect --format 'OOMKilled={{.State.OOMKilled}} exit={{.State.ExitCode}}' oom`,
    output: `NAME      CPU %     MEM USAGE / LIMIT
limited   0.00%     9.25MiB / 256MiB
OOMKilled=true exit=137`,
  },
  {
    q: "What is docker inspect used for?",
    level: 'Advanced',
    a: "docker inspect returns the full low-level JSON configuration and state of a container, image, volume or network. I use it to find a container's IP address, its mounts, environment variables, exit code, restart count or health status. The --format flag with Go templates pulls out just the field I need, which is handy in scripts.",
    code: `docker run -d --name web -e MODE=demo -p 8080:80 nginx:alpine

docker inspect --format '{{.State.Status}}' web
docker inspect --format '{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' web
docker inspect --format '{{json .HostConfig.PortBindings}}' web
docker inspect --format '{{index .Config.Env 0}}' web
docker image inspect --format '{{.Config.Cmd}}' nginx:alpine`,
    output: `running
172.17.0.2
{"80/tcp":[{"HostIp":"","HostPort":"8080"}]}
MODE=demo
[nginx -g daemon off;]`,
  },
  {
    q: "How do you clean up disk space with docker system prune?",
    level: 'Advanced',
    a: "Docker keeps stopped containers, unused images, build cache and volumes until I remove them, and over time that can eat many gigabytes. docker system df shows where space goes. docker system prune removes stopped containers, unused networks, dangling images and build cache; -a also removes every image not used by a container, and --volumes includes unused volumes, which can delete data, so I am careful there.",
    code: `docker system df

# Stopped containers, unused networks, dangling images, build cache
docker system prune -f

# Targeted cleanups
docker container prune -f
docker image prune -a -f --filter "until=168h"   # older than 7 days
docker builder prune -f
# docker volume prune   <- careful: deletes data`,
    output: `TYPE            TOTAL     ACTIVE    SIZE      RECLAIMABLE
Images          14        3         5.21GB    3.87GB (74%)
Containers      9         2         1.4MB     1.1MB (78%)
Local Volumes   5         2         812MB     341MB (41%)
Build Cache     63        0         2.94GB    2.94GB

Deleted Containers:
a1b2c3d4e5f6...
Deleted Networks:
shop_default

Total reclaimed space: 3.06GB`,
  },
  {
    q: "Explain the container lifecycle, PID 1 and graceful shutdown.",
    level: 'Advanced',
    a: "A container moves through created, running, paused, stopped (exited) and removed. docker stop sends SIGTERM to PID 1, waits 10 seconds by default, then sends SIGKILL. If my CMD uses shell form, PID 1 is /bin/sh, which does not forward signals, so the app never shuts down cleanly and always waits for the kill. I use exec form, handle SIGTERM in the app, and add --init (tini) when the process does not reap child processes.",
    code: `# Shell form: sh is PID 1 and ignores SIGTERM
docker run -d --name shellform alpine sh -c 'sleep 300'
time docker stop shellform

# Exec form + --init: signal is delivered, stops at once
docker run -d --name execform --init alpine sleep 300
time docker stop execform

# Custom grace period
docker stop -t 30 mycontainer`,
    output: `shellform

real    0m10.214s
user    0m0.020s
sys     0m0.015s
execform

real    0m0.287s
user    0m0.019s
sys     0m0.012s`,
  },
  {
    q: "What are logging drivers?",
    level: 'Advanced',
    a: "Docker captures each container's stdout and stderr and sends it to a logging driver. The default json-file driver writes to files on the host and does not rotate them unless I configure it, so logs can fill the disk; local is a more compact alternative. Others like syslog, journald, fluentd, gelf or awslogs ship logs to a central system. I always set max-size and max-file, either per container or in daemon.json.",
    code: `# Rotate logs: max 3 files of 10 MB each
docker run -d --name web \\
  --log-driver json-file \\
  --log-opt max-size=10m --log-opt max-file=3 \\
  nginx:alpine

docker inspect --format '{{.HostConfig.LogConfig.Type}} {{.HostConfig.LogConfig.Config}}' web
docker info --format '{{.LoggingDriver}}'

# /etc/docker/daemon.json (default for all containers)
# { "log-driver": "local", "log-opts": { "max-size": "10m" } }`,
    output: `a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2
json-file map[max-file:3 max-size:10m]
json-file`,
  },
  {
    q: "How do you debug a container that exits immediately?",
    level: 'Advanced',
    a: "A container lives only as long as its main process, so it exits immediately when that process crashes or simply finishes, for example a CMD that runs a script and ends. I first check docker ps -a for the exit code and docker logs for the error. Then I inspect the exit code (1 = app error, 127 = command not found, 137 = killed or OOM) and override the command with an interactive shell to look around inside the image.",
    code: `docker run -d --name broken python:3.12-slim python app.py

docker ps -a --filter name=broken --format "{{.Names}}  {{.Status}}"
docker logs broken
docker inspect --format 'exit={{.State.ExitCode}} oom={{.State.OOMKilled}}' broken

# Start a shell instead of the normal command and look around
docker run --rm -it --entrypoint sh python:3.12-slim
# ls /app ; env ; python --version`,
    output: `broken  Exited (2) 3 seconds ago
python: can't open file '//app.py': [Errno 2] No such file or directory
exit=2 oom=false
# ls /app
ls: cannot access '/app': No such file or directory`,
  },
  {
    q: "How do you Dockerize a FastAPI app?",
    level: 'Advanced',
    a: "I use python slim, install dependencies first for caching, copy the code, switch to a non-root user and run uvicorn in exec form bound to 0.0.0.0, because 127.0.0.1 inside a container is not reachable from outside. I also expose a /health endpoint for health checks. In production I'd run multiple workers or let the orchestrator scale replicas instead.",
    code: `# Dockerfile
FROM python:3.12-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY app ./app
USER nobody
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

docker build -t fastapi-app .
docker run -d --name api -p 8000:8000 fastapi-app
curl -s localhost:8000/health`,
    output: ` => => naming to docker.io/library/fastapi-app:latest                      0.0s
b6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8
{"status":"ok"}`,
  },
  {
    q: "How do you Dockerize a React (Vite) app for production, including client-side routing?",
    level: 'Advanced',
    a: "I use a multi-stage build: Node builds the static files, and Nginx serves them. Vite reads VITE_ variables at build time, so I pass them as build args, not at run time. For React Router I add an Nginx config with try_files falling back to index.html, otherwise refreshing a deep link like /users/5 returns a 404.",
    code: `FROM node:22-alpine AS build
WORKDIR /app
COPY . .
# VITE_ variables are read at build time
ARG VITE_API_URL
RUN npm ci && npm run build

FROM nginx:alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
# nginx.conf (deep links -> index.html):
#   location / { try_files $uri $uri/ /index.html; }`,
    output: `$ docker build --build-arg VITE_API_URL=https://api.example.com -t react-app .
 => [build 5/5] RUN npm ci && npm run build                               17.9s
 => [stage-1 3/3] COPY --from=build /app/dist /usr/share/nginx/html        0.1s

$ docker run -d -p 3000:80 react-app
$ curl -s -o /dev/null -w "%{http_code}\\n" localhost:3000/users/5
200`,
  },
  {
    q: "How do you use Docker in CI/CD, for example GitHub Actions build and push?",
    level: 'Advanced',
    a: "In CI I build the image once per commit and push it to a registry tagged with the commit SHA, so the exact same image is promoted to staging and production. In GitHub Actions I use the official docker actions, login and build-push-action, with registry credentials coming from secrets. In real pipelines I also run tests and a scan on the image, and turn on the GitHub Actions cache so layers are reused between runs.",
    code: `# .github/workflows/docker.yml
on: { push: { branches: [main] } }
jobs:
  build:
    runs-on: ubuntu-latest
    permissions: { packages: write }
    steps:
      - uses: docker/login-action@v3
        with: { registry: ghcr.io, username: "\${{ github.actor }}",
                password: "\${{ secrets.GITHUB_TOKEN }}" }
      - uses: docker/build-push-action@v6
        with: { push: true, tags: "ghcr.io/\${{ github.repository }}:\${{ github.sha }}" }`,
    output: `build  Set up job
build  Run docker/login-action@v3
       Login Succeeded!
build  Run docker/build-push-action@v6
       #12 pushing layers 2.1s done
       #12 pushing manifest for ghcr.io/acme/shop:3f9c1a7e... done
build  Complete job`,
  },
  {
    q: "What is the difference between Docker and Kubernetes? What does orchestration mean?",
    level: 'Advanced',
    a: "Docker builds images and runs containers on a single machine. Orchestration means managing many containers across a cluster of machines: scheduling them onto nodes, scaling replicas, restarting failed ones, rolling updates with zero downtime, service discovery and load balancing. Kubernetes is the most popular orchestrator, and it runs the same OCI images that Docker builds. So they are complementary: I build with Docker and run at scale with Kubernetes.",
    code: `# Docker: one container on one host
docker run -d --name api -p 8000:8000 myapi:1.4.2

# Kubernetes: "keep 3 copies running" across a cluster
kubectl create deployment api --image=myapi:1.4.2 --replicas=3
kubectl get pods`,
    output: `$ kubectl create deployment api --image=myapi:1.4.2 --replicas=3
deployment.apps/api created

$ kubectl get pods
NAME                   READY   STATUS    RESTARTS   AGE
api-6d4b8c9f7d-2xkqp   1/1     Running   0          12s
api-6d4b8c9f7d-8mzrt   1/1     Running   0          12s
api-6d4b8c9f7d-tq5wn   1/1     Running   0          12s`,
  },
  {
    q: "What is Docker Swarm?",
    level: 'Advanced',
    a: "Docker Swarm is Docker's built-in orchestrator: I turn one or more Docker hosts into a cluster with docker swarm init and join, then deploy services with a number of replicas, rolling updates and built-in load balancing. It reuses Compose files through docker stack deploy, so it is much simpler than Kubernetes. It is fine for small clusters, but most companies today choose Kubernetes or a managed service like ECS.",
    code: `docker swarm init

# A service with 3 replicas behind a routing mesh on port 8080
docker service create --name web --replicas 3 -p 8080:80 nginx:alpine
docker service ls

# Scale and roll out a new version
docker service scale web=5
docker service update --image nginx:1.29-alpine web

# Deploy a whole compose file as a stack
docker stack deploy -c docker-compose.yml shop`,
    output: `Swarm initialized: current node (k2v8x1qz9m3a5b7c9d1e3f5a7) is now a manager.

To add a worker to this swarm, run the following command:

    docker swarm join --token SWMTKN-1-4b2... 192.168.65.3:2377

w1x3y5z7a9b1c3d5e7f9a1b3c
overall progress: 3 out of 3 tasks
verify: Service w1x3y5z7a9b1c3d5e7f9a1b3c converged
ID             NAME      MODE         REPLICAS   IMAGE          PORTS
w1x3y5z7a9b1   web       replicated   3/3        nginx:alpine   *:8080->80/tcp
web scaled to 5`,
  },
  {
    q: "What Docker best practices do you follow?",
    level: 'Advanced',
    a: "I keep images small and reproducible: slim or alpine bases pinned to a version, multi-stage builds, a .dockerignore and cache-friendly instruction order. For security I run as non-root, never bake in secrets, scan images in CI and rebuild regularly for base image patches. At run time I use one process per container, log to stdout, add healthchecks, set resource limits and restart policies, and store state in volumes, not in the container.",
    code: `# Dockerfile checklist in practice
# Pinned, small base image
FROM python:3.12-slim
WORKDIR /app
# Dependencies first so they stay cached
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
# Non-root user and exec-form CMD (gets SIGTERM as PID 1)
USER nobody
CMD ["uvicorn", "main:app", "--host", "0.0.0.0"]`,
    output: `[x] Pinned, minimal base image
[x] Multi-stage build where there is a build step
[x] .dockerignore + cache-friendly layer order
[x] Non-root USER
[x] No secrets in ENV / ARG / layers
[x] Exec-form CMD, handles SIGTERM
[x] Logs to stdout / stderr
[x] HEALTHCHECK, resource limits, restart policy
[x] Data in volumes
[x] Image scanned (docker scout / trivy) in CI`,
  },
  {
    q: "How do you harden a container at runtime (capabilities, read-only filesystem, seccomp)?",
    level: 'Advanced',
    a: "I start from least privilege: run as a non-root user, drop all Linux capabilities with --cap-drop ALL and add back only what is needed, like NET_BIND_SERVICE, and set no-new-privileges so setuid binaries can't escalate. --read-only makes the root filesystem immutable, with a tmpfs for the few folders the app must write to. Docker's default seccomp profile already blocks dangerous syscalls, so I never run with --privileged or seccomp=unconfined in production.",
    code: `docker run -d --name api \\
  --user 1000:1000 \\
  --cap-drop ALL \\
  --security-opt no-new-privileges \\
  --read-only \\
  --tmpfs /tmp \\
  -p 8000:8000 myapi:1.4.2

docker exec api touch /app/hack.txt
docker exec api sh -c 'touch /tmp/ok.txt && echo tmp ok'`,
    output: `6d8f0a2c4e6b8d0f2a4c6e8b0d2f4a6c8e0b2d4f6a8c0e2b4d6f8a0c2e4b6d8f
touch: cannot touch '/app/hack.txt': Read-only file system
tmp ok`,
  },
  {
    q: "What is rootless Docker and why would you use it?",
    level: 'Advanced',
    a: "Normally the Docker daemon runs as root, so anyone who can talk to the Docker socket is effectively root on the host. Rootless mode runs the daemon and containers as a normal user inside a user namespace, so even a container escape only gets that user's permissions. The trade-offs are that ports below 1024 and some storage and networking features need extra setup, so I use it on shared CI runners and developer servers where the security gain matters most.",
    code: `# As a normal user (not root)
dockerd-rootless-setuptool.sh install
export DOCKER_HOST=unix://$XDG_RUNTIME_DIR/docker.sock

docker info --format '{{.SecurityOptions}}'

# "root" inside the container is my user on the host
docker run -d --name sleeper alpine sleep 300
ps -o user,pid,cmd -C sleep`,
    output: `[INFO] Creating /home/dev/.config/systemd/user/docker.service
[INFO] Installed docker.service successfully.
[INFO] To control docker.service, run: \`systemctl --user (start|stop|restart) docker.service\`
[INFO] Make sure the following environment variable(s) are set (or add them to ~/.bashrc):
export DOCKER_HOST=unix:///run/user/1000/docker.sock
[name=seccomp,profile=builtin name=rootless name=cgroupns]
USER       PID CMD
dev      52817 sleep 300`,
  },
  {
    q: "What are image signing and SBOMs, and why do they matter?",
    level: 'Advanced',
    a: "An SBOM (software bill of materials) is a list of every package and version inside an image, so when a new CVE appears I can quickly find which images are affected; BuildKit can attach one at build time with --sbom=true and docker scout or syft can read it. Signing, for example with Sigstore cosign, proves the image was built by our pipeline and not changed afterwards. In a mature setup CI signs every image by digest, and the cluster's admission policy refuses unsigned images.",
    code: `# Build with SBOM and provenance attestations attached
docker buildx build --sbom=true --provenance=mode=max \\
  -t ghcr.io/acme/api:1.5.0 --push .

# Read the SBOM
docker scout sbom --format list ghcr.io/acme/api:1.5.0 | head -6

# Sign by digest (keyless, using the CI's OIDC identity) and verify
cosign sign --yes ghcr.io/acme/api@sha256:5f2c8e1a...
cosign verify ghcr.io/acme/api:1.5.0 \\
  --certificate-identity-regexp 'https://github.com/acme/api/' \\
  --certificate-oidc-issuer https://token.actions.githubusercontent.com`,
    output: `           Name               Version            Type
──────────────────────────────────────────────────────────
  fastapi                   0.121.1         pypi
  openssl                   3.5.4-1~deb13u1 deb
  pydantic                  2.12.4          pypi
  uvicorn                   0.38.0          pypi

Verification for ghcr.io/acme/api:1.5.0 --
The following checks were performed on each of these signatures:
  - The cosign claims were validated
  - Existence of the claims in the transparency log was verified offline
  - The code-signing certificate was verified using trusted certificate authority certificates`,
  },
  {
    q: "How do you debug networking between two containers?",
    level: 'Advanced',
    a: "First I check that both containers are on the same user-defined network, because only there do they resolve each other by name; the default bridge has no DNS. Then I test from inside: DNS lookup, then the port, using a tools image like nicolaka/netshoot attached to the target's network namespace so I don't have to install tools into my app image. The classic bugs are using localhost (which means the container itself), the host port instead of the container port, or an app listening only on 127.0.0.1 instead of 0.0.0.0.",
    code: `docker network inspect shop_default \\
  --format '{{range .Containers}}{{.Name}} {{.IPv4Address}}{{"\\n"}}{{end}}'

# Borrow the api container's network namespace with a tools image
docker run --rm --network container:shop-api-1 nicolaka/netshoot \\
  sh -c 'nslookup db; nc -zv db 5432; nc -zv localhost 5432'

# Is the app listening on 0.0.0.0 or only 127.0.0.1?
docker run --rm --network container:shop-api-1 nicolaka/netshoot ss -tlnp`,
    output: `shop-db-1 172.19.0.2/16
shop-api-1 172.19.0.3/16

Server:		127.0.0.11
Address:	127.0.0.11#53

Non-authoritative answer:
Name:	db
Address: 172.19.0.2

Connection to db (172.19.0.2) 5432 port [tcp/postgresql] succeeded!
nc: connect to localhost (127.0.0.1) port 5432 (tcp) failed: Connection refused
State   Recv-Q  Send-Q   Local Address:Port   Peer Address:Port  Process
LISTEN  0       2048         127.0.0.1:8000        0.0.0.0:*
LISTEN  0       4096        127.0.0.11:41237       0.0.0.0:*
# api listens on 127.0.0.1 only -> fix: uvicorn --host 0.0.0.0`,
  },
  {
    q: "As a Docker user, what are the Kubernetes basics: Pods, Deployments and Services?",
    level: 'Advanced',
    a: "A Pod is the smallest unit in Kubernetes, one or more containers that share a network, roughly like one docker run. A Deployment keeps a number of identical Pods running and rolls out new image versions, and a Service gives those Pods one stable DNS name and load-balances across them, like a Compose service name. The commands map nicely: kubectl logs, exec and port-forward are the Kubernetes versions of docker logs, exec and -p, and I always set readiness probes and resource requests.",
    code: `# service.yaml: one stable name for the Deployment's Pods (app: api)
apiVersion: v1
kind: Service
metadata: { name: api, labels: { app: api } }
spec:
  selector: { app: api }
  ports: [{ port: 80, targetPort: 8000 }]

kubectl apply -f service.yaml
kubectl get pods,svc -l app=api
kubectl port-forward svc/api 8080:80`,
    output: `service/api created
NAME                       READY   STATUS    RESTARTS   AGE
pod/api-6d4b8c9f7d-2xkqp   1/1     Running   0          15s
pod/api-6d4b8c9f7d-8mzrt   1/1     Running   0          15s
pod/api-6d4b8c9f7d-tq5wn   1/1     Running   0          15s

NAME          TYPE        CLUSTER-IP     EXTERNAL-IP   PORT(S)   AGE
service/api   ClusterIP   10.96.142.17   <none>        80/TCP    15s
Forwarding from 127.0.0.1:8080 -> 8000
Forwarding from [::1]:8080 -> 8000`,
  },
]
