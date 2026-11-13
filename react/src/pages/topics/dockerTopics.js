// Sub-topic order for the docker page: related questions are shown together.
// Each question title appears in exactly one topic, in the order shown on the page.
export default [
  {
    topic: 'Docker basics',
    questions: [
      'What is Docker and why do we use it?',
      'What is the difference between a container and a virtual machine?',
      'What is the difference between an image and a container?',
      'What are the Docker Engine, the daemon and the CLI?',
      'What is Docker Hub and what is a registry?',
    ],
  },
  {
    topic: 'Images & containers',
    questions: [
      'What are the basic commands to manage images and containers?',
      'What is the difference between docker rm and docker rmi?',
      'What do the common docker run flags -d, -p, --name, -e, --rm and -it do?',
      'How do you use docker exec and docker logs?',
      'What are image tags and how should you version images?',
      'How do you push an image to a registry with docker login, docker tag and docker push?',
      'How do you filter and format the output of docker images and docker ps?',
      'What states can a container be in, and how do you move between them?',
      'What is the difference between docker stop, docker kill and docker restart?',
      'How do you copy files between a container and the host with docker cp?',
    ],
  },
  {
    topic: 'Dockerfile',
    questions: [
      'What are the basic Dockerfile instructions?',
      'What is the difference between RUN and CMD?',
      'What does WORKDIR do, and why not use RUN cd?',
      'How do you build an image with docker build -t?',
      'What is the difference between CMD and ENTRYPOINT?',
      'What is the difference between the exec form and the shell form?',
      'What is the difference between COPY and ADD?',
      'What is the difference between ARG and ENV?',
      'What does the LABEL instruction do?',
      'What is a .dockerignore file?',
      'What do the STOPSIGNAL, SHELL and ONBUILD instructions do?',
    ],
  },
  {
    topic: 'Builds & image size',
    questions: [
      'What are layers and how does the build cache work?',
      'What is a multi-stage build? Show a React app built with Node and served by Nginx.',
      'How would you write a multi-stage build for a Python app?',
      'How do you reduce Docker image size?',
      'What are BuildKit cache mounts and how do they speed up builds?',
      'Alpine vs slim vs distroless base images: what are the trade-offs?',
      'How do you build multi-architecture images with docker buildx?',
    ],
  },
  {
    topic: 'Volumes & data',
    questions: [
      'What is the difference between volumes, bind mounts and tmpfs mounts?',
      'How do you manage volumes with docker volume create, ls, inspect and rm?',
      'How do you persist database data in Docker?',
      'What is the difference between named and anonymous volumes, and how do you back up a volume?',
      'What does the VOLUME instruction do in a Dockerfile?',
    ],
  },
  {
    topic: 'Networking',
    questions: [
      'How does port mapping work?',
      'Does EXPOSE publish a port? What is the difference between EXPOSE and -p?',
      'Explain Docker networking: bridge, host, none and user-defined networks.',
      'How do you create and manage networks with docker network create, connect and inspect?',
      'How do you debug networking between two containers?',
    ],
  },
  {
    topic: 'Configuration & runtime',
    questions: [
      'How do you handle environment variables and secrets?',
      'What are restart policies?',
      'What is a healthcheck and why use it?',
      'How do you set resource limits like --memory and --cpus?',
      'Explain the container lifecycle, PID 1 and graceful shutdown.',
    ],
  },
  {
    topic: 'Docker Compose',
    questions: [
      'What is Docker Compose? Show a FastAPI + PostgreSQL + React stack.',
      'What are the most used docker compose commands?',
      'What are Compose profiles and override files?',
      'How do you get hot reload in development with Docker Compose?',
    ],
  },
  {
    topic: 'Debugging & operations',
    questions: [
      'How do you see live resource usage and processes of running containers?',
      'How do you see what changed inside a container and how an image was built?',
      'What does docker commit do, and why use a Dockerfile instead?',
      'What is the difference between docker save/load and docker export/import?',
      'What is docker inspect used for?',
      'How do you debug a container that exits immediately?',
      'What are logging drivers?',
      'How do you clean up disk space with docker system prune?',
    ],
  },
  {
    topic: 'Security',
    questions: [
      'Why should containers run as a non-root user?',
      'How do you scan images for vulnerabilities? What is Docker Scout?',
      'How do you harden a container at runtime (capabilities, read-only filesystem, seccomp)?',
      'What is rootless Docker and why would you use it?',
      'What are image signing and SBOMs, and why do they matter?',
    ],
  },
  {
    topic: 'Real-world apps & best practices',
    questions: [
      'How do you Dockerize a FastAPI app?',
      'How do you Dockerize a React (Vite) app for production, including client-side routing?',
      'What Docker best practices do you follow?',
    ],
  },
  {
    topic: 'CI/CD & orchestration',
    questions: [
      'How do you use Docker in CI/CD, for example GitHub Actions build and push?',
      'What is the difference between Docker and Kubernetes? What does orchestration mean?',
      'What is Docker Swarm?',
      'As a Docker user, what are the Kubernetes basics: Pods, Deployments and Services?',
    ],
  },
]
