# Running Locally
You can run Screwdriver locally by using our sd-in-a-box tool.

## SD-in-a-Box
This handy feature will bring up an entire Screwdriver instance (UI, API, and log store) locally for you to play with.

### Requires:
 - Mac OSX 10.10+
 - [Docker for Mac][docker]
 - [Docker Compose 1.8.1+][docker-compose]

Run the below command in your terminal to bring up a Screwdriver cluster locally.
```bash
$ python <(curl https://raw.githubusercontent.com/screwdriver-cd/screwdriver/master/in-a-box.py)
```

You will be prompted to enter your Client ID and Client Secret. Afterwards, type `y` to launch Screwdriver!

![SD-in-a-box](assets/sd-in-a-box.png)

[docker]: https://www.docker.com/products/docker
[docker-compose]: https://www.docker.com/products/docker-compose
