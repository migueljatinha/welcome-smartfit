# Dockerizing a NGINX for test

## Using PT version to test

Windows
```bash
docker run --rm -p 80:80 -v /${PWD}/pt:/usr/share/nginx/html:ro nginx
```

UNIX
```bash
docker run --rm -p 80:80 -v `pwd`/pt:/usr/share/nginx/html:ro nginx
```