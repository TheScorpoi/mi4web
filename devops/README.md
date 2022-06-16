# DevOps Documentation

## Prequisites
 
- Yarn
- 

## How to run the application

If you want to run run the application, you need to enter on [Viewers-master](/Viewers-master/) directory and run the following command:

```bash
yarn install
yarn start
```

To to put database up, you will need to run the docker-compose file in the root of the repository: 
```bash
docker-compose up
```

Run the authentication protocol, and the nodeJS APIS:

Go to the [authentication](/authentication/) directory and run the following command:
```bash
docker-compose up
```

## How we deploy the application on the VMs:

The deploy process will be explain to deploy on linux virtual machines, if you are using azure, aws… the process will be diferente. Consult the [Deployment | OHIF](https://v3-docs.ohif.org/deployment/index/) to see more information.

To deploy the dockers on VM some adjusts have to be done, in the dockers compose or in the configurations of the connection to the servides.

### Deploy the Server

First thing to do, is put the server up. The server will be on a docker container, as the following: 



```bash
version: '3.5'

services:
  orthanc:
    image: jodogne/orthanc-plugins:1.9.7
    hostname: orthanc
    volumes:
      # Nginx config
      - ./config/nginx.conf:/usr/local/openresty/nginx/conf/nginx.conf:ro
      # Config
      - ./config/orthanc.json:/etc/orthanc/orthanc.json:ro
      # Persist data
      - ./volumes/orthanc-db/:/var/lib/orthanc/db/
    ports:
      - '8082:4242' # DICOM
      - '8083:8042' # Web
    restart: unless-stopped
    networks:
      - all

networks:
  all:
    ipam:
      driver: default
      config:f        - subnet: 10.1.0.0/16
```


In our server machine, we only have 10 ports open to the network, because of that in our docker-compose file we configure the orthanc server ports to be 8082, and 8083, that are mapped to 8762 to 8769 in mednat network.
Because of virtual machines configuration the last 7 lines of the docker-compose file are required, as well as the following configuration on the /etc/docker/daemon.json file:


```bash
{ "bip": "10.2.0.1/16” }
```

After this, we are able to run the docker-compose file, and have the Orthanc Server online. 
The server is accessed from outside through http://mednat.ieeta.pt:8763, on UA network, as explained before.
 
The next step is do add DICOM images to the server, for that we used the Welcome to The Cancer Imaging Archive - The Cancer Imaging Archive (TCIA) to download some studies to put on our server. 
 
In order to resolve, CORS problems that eventually happen, it is important to have a nginx configuration file that give Cross-Origin Resource Sharing. So we install nginx on virtual machine, and put the following nginx configuration file. And then the CORS problem may be resolved.
 

```bash
server {
    listen 8085;

    # CORS Magic
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow_Credentials' 'true';
    add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Range';
    add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';

    location / {

        if ($request_method = 'OPTIONS') {
            add_header 'Access-Control-Allow-Origin' '*';
            add_header 'Access-Control-Allow_Credentials' 'true';
            add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range>
            add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';
            add_header 'Access-Control-Max-Age' 1728000;
            add_header 'Content-Type' 'text/plain charset=UTF-8';
            add_header 'Content-Length' 0;
            return 204;
        }

        proxy_pass         http://127.0.0.1:8083;
        proxy_set_header   Host $host;
        proxy_set_header   X-Real-IP $remote_addr;
        proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Host $server_name;

        # CORS Magic
        add_header 'Access-Control-Allow-Origin' '*';
        add_header 'Access-Control-Allow_Credentials' 'true';
        add_header 'Access-Control-Allow-Headers' 'Authorization,Accept,Origin,DNT,X-CustomHeader,Keep-Alive,User-Agent,X-Requested-With,If-Modified-Since,Cache-Control,Content-Type,Content-Range,Ran>
        add_header 'Access-Control-Allow-Methods' 'GET,POST,OPTIONS,PUT,DELETE,PATCH';
    }
}
```
 
### Deploy the Viewer

To deploy the Viewer on the virtual machine, there are some steps to take:
Configure connection to Server, at platform/viewer/public/config/docker_openresty-orthanc.js 
Run the docker-compose file, at platform/viewer/.recipes/OpenResty-Orthanc/docker-compose.yml.

As explained before, we have our server running on http://mednat.ieeta.pt:8765, so the Viewer needs to know where is suppose to query the studies. As said before, at platform/viewer/public/config/
docker_openresty-orthanc.js, configuration file should look like this:

```bash
window.config = {
  routerBasename: '/',
  showStudyList: true,
  servers: {
    // This is an array, but we'll only use the first entry for now
    dicomWeb: [
      {
        name: 'Orthanc',
        wadoUriRoot: 'http://mednat.ieeta.pt:8765/wado',
         qidoRoot: 'http://mednat.ieeta.pt:8765/dicom-web',
         wadoRoot: 'http://mednat.ieeta.pt:8765/dicom-web',
        qidoSupportsIncludeField: false,
        imageRendering: 'wadors',
        thumbnailRendering: 'wadors',
        // requestOptions: {
        // undefined to use JWT + Bearer auth
        // auth: 'orthanc:orthanc',
        // },
      },
    ],
  },
};
```

After this, we are able to see our docker-compose file, firstly we build the React application with a Dockerfile, and then using nginx put it on 8084 port, which in mednat means 8754 port.

```bash
version: '3.5'

services:
  # Exposed server that's handling incoming web requests
  # Underlying image: openresty/openresty:alpine-fat
  ohif_viewer:
    build:
      # Project root
      context: ./../../../../
      # Relative to context
      dockerfile: ./platform/viewer/.recipes/OpenResty-Orthanc/dockerfile
    image: webapp:latest
    container_name: webapp
    volumes:
      # Nginx config
      - ./config/nginx.conf:/usr/local/openresty/nginx/conf/nginx.conf:ro
      # Logs
      - ./logs/nginx:/var/logs/nginx
    ports:
      - '8083:443' # SSL
      - '8084:80' # Web
    restart: on-failure
    networks:
      - all

networks:
 all:
  ipam:
   driver: default
   config:
    - subnet: 10.1.0.0/16
```

 
The docker-compose is supported by a Dockerfile, in the same path, that will build the application.

```bash
# Stage 1: Build the application

FROM node:lts-slim as builder

RUN mkdir /usr/src/app
WORKDIR /usr/src/app

ENV APP_CONFIG=config/docker_openresty-orthanc.js
ENV PATH /usr/src/app/node_modules/.bin:$PATH

COPY package.json /usr/src/app/package.json
COPY yarn.lock /usr/src/app/yarn.lock

ADD . /usr/src/app/
RUN yarn install
RUN yarn run build

# Stage 2: Bundle the built application into a Docker container
# which runs openresty (nginx) using Alpine Linux
# LINK: https://hub.docker.com/r/openresty/openresty
FROM openresty/openresty:1.19.9.1-4-alpine-fat

RUN mkdir /var/log/nginx
RUN apk add --no-cache openssl
RUN apk add --no-cache openssl-dev
RUN apk add --no-cache git
RUN apk add --no-cache gcc

RUN luarocks install lua-resty-openidc

RUN luarocks install lua-resty-jwt
RUN luarocks install lua-resty-session
RUN luarocks install lua-resty-http

# Copy build output to image
COPY --from=builder /usr/src/app/platform/viewer/dist /var/www/html

ENTRYPOINT ["/usr/local/openresty/nginx/sbin/nginx", "-g", "daemon off;"]
```


The nginx file is the following:
```bash
worker_processes 2;
error_log   /var/logs/nginx/mydomain.error.log;
pid /var/run/nginx.pid;
include /usr/share/nginx/modules/*.conf; # See /usr/share/doc/nginx/README.dynamic.

events {
    worker_connections 1024; ## Default: 1024
    use epoll; # http://nginx.org/en/docs/events.html
    multi_accept on; # http://nginx.org/en/docs/ngx_core_module.html#multi_accept
}

# Core Modules Docs:
# http://nginx.org/en/docs/http/ngx_http_core_module.html
http {
    include    '/usr/local/openresty/nginx/conf/mime.types';
    default_type application/octet-stream;

    keepalive_timeout 65;
    keepalive_requests 100000;
    tcp_nopush on;
    tcp_nodelay on;

    # lua_ settings
    #
    lua_package_path '/usr/local/openresty/lualib/?.lua;;';
    lua_shared_dict discovery 1m; # cache for discovery metadata documents
    lua_shared_dict jwks 1m;      # cache for JWKs
    # lua_ssl_trusted_certificate /etc/ssl/certs/ca-certificates.crt;

    variables_hash_max_size 2048;
    server_names_hash_bucket_size 128;
    server_tokens off;

    resolver 8.8.8.8 valid=30s ipv6=off;
    resolver_timeout 11s;

    log_format  main  '$remote_addr - $remote_user [$time_local] "$request" '
                      '$status $body_bytes_sent "$http_referer" '
                      '"$http_user_agent" "$http_x_forwarded_for"';

    # Nginx `listener` block
    server {
        listen [::]:80 default_server;
        listen 80;
        # listen      443 ssl;
        access_log  /var/logs/nginx/mydomain.access.log;

        # Domain to protect
        server_name 127.0.0.1 localhost; # mydomain.com;
        proxy_intercept_errors off;
        # ssl_certificate /etc/letsencrypt/live/mydomain.co.uk/fullchain.pem;
        # ssl_certificate_key /etc/letsencrypt/live/mydomain.co.uk/privkey.pem;
        gzip on;
        gzip_types text/css application/javascript application/json image/svg+xml;
        gzip_comp_level 9;
        etag on;

        # https://github.com/bungle/lua-resty-session/issues/15
        set $session_check_ssi off;
        lua_code_cache on;
        set $session_secret Eeko7aeb6iu5Wohch9Loo1aitha0ahd1;
        set $session_storage cookie;

        server_tokens off; # Hides server version num

        # Reverse Proxy for `orthanc` admin
        #
        location /pacs-admin/ {

          proxy_http_version 1.1;

          proxy_set_header Host               $host;
          proxy_set_header X-Real-IP          $remote_addr;
          proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto  $scheme;

          expires           0;
          add_header        Cache-Control private;

          proxy_pass        http://mednat.ieeta.pt:8765;
        }

        # Reverse Proxy for `orthanc` APIs (including DICOMWeb)
        #
        location /pacs/ {

          proxy_http_version 1.1;

          proxy_set_header Host               $host;
          proxy_set_header X-Real-IP          $remote_addr;
          proxy_set_header X-Forwarded-For    $proxy_add_x_forwarded_for;
          proxy_set_header X-Forwarded-Proto  $scheme;

          expires           0;
          add_header        Cache-Control private;

          proxy_pass        http://mednat.ieeta.pt:8765/;

          # By default, this endpoint is protected by CORS (cross-origin-resource-sharing)
          # You can add headers to allow other domains to request this resource.
          # See the "Updating CORS Settings" example below
        }

        # Do not cache sw.js, required for offline-first updates.
        location /sw.js {
          add_header Cache-Control "no-cache";
          proxy_cache_bypass $http_pragma;
          proxy_cache_revalidate on;
          expires off;
          access_log off;
        }

        # Single Page App
        # Try files, fallback to index.html
        #
        location / {
          alias  /var/www/html/;
          index index.html;
          try_files $uri $uri/ /index.html;
          add_header Cache-Control "no-store, no-cache, must-revalidate";
        }

        # EXAMPLE: Redirect server error pages to the static page /40x.html
        #
        # error_page 404 /404.html;
        #     location = /40x.html {
        # }

        # EXAMPLE: Redirect server error pages to the static page /50x.html
        #
        # error_page 500 502 503 504 /50x.html;
        #    location = /50x.html {
        # }
    }
}
```

 
Now, we are able to run docker-compose file, and after that the Viewer will be accessed from http://mednat.ieeta.pt/8754.

