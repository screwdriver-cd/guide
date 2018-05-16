---
layout: main
title: FAQ
category: Cluster Management
menu: menu
toc:
- title: Frequently Asked Questions
  url: "#frequently-asked-questions"
  active: true
- title: How do I post announcements on the UI?
  url: "#how-do-i-post-announcements-on-the-ui"

---

# Frequently Asked Questions

## How do I post announcements on the UI?

You might want to let Screwdriver users know about upcoming maintenance or downtime they might experience or let them know the cluster maintainers are investigating a problem if there's an issue with the cluster.

![Banner](./assets/banners.png)

You can use banners to make these announcements through the [API](../user-guide/api). To create, update, or delete banners, you must be a Screwdriver admin (see `SECRET_ADMINS` environment variable in the [configuring the API docs](./configure-api)).
