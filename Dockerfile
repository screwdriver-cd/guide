FROM ruby:2.7.6-alpine

# Create our application directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install guide
RUN set -x \
  && apk update \
  # Missing https for some magical reason; need build tools for jekyll install
  && apk add --no-cache --update ca-certificates build-base \
  # You know you're using a lean image when you need to install wget
  && apk add --no-cache --virtual ca-certificates wget \
  # Fetch the latest Guide release
  && wget -q -O - https://api.github.com/repos/screwdriver-cd/guide/releases/latest \
      | egrep -o '/screwdriver-cd/guide/releases/download/v[0-9.]*/guide.tgz' \
      | wget --base=http://github.com/ -i - -O guide.tgz \
  && tar -zxvf guide.tgz \
  # General clean-up
  && rm -rf guide.tgz \
  # Need jekyll to serve the pages
  && gem install public_suffix:4.0.7 jekyll

EXPOSE 4000

CMD ["jekyll", "serve", "--force_polling", "-H", "0.0.0.0", "-P", "4000"]
