# Quinoa watch issue with Qute templates

This project uses Quarkus, the Supersonic Subatomic Java Framework (and Quinoa
and Qute, obviously :) ).

If you want to learn more about Quarkus, please visit its website:
https://quarkus.io/

Quinoa: https://quarkiverse.github.io/quarkiverse-docs/quarkus-quinoa/dev/
Qute: https://quarkus.io/guides/qute


This repository shows two things:

1. A simple way of using Quinoa as a trigger for building UI bundles
   for non-SPA apps (like classic multi-page applications).
2. An issue that emerges for such a configuration: with HTML being in
   a separate directory, Quinoa won't launch rebuilding when HTML changes. 

The issue itself is a problem that shows itself when using Quinoa with assets
from locations outside the UI directory. This sample uses a fairly standard
Webpack config to bundle a simple CSS file and purge any unused styles using
the PurgeCSS plugin. Quinoa's task is to trigger the build each time any of
the UI assets changes. That however is not possible for assets that are still
considered part of the UI, but are outside the UI directory.

In this case it's the Qute `index.html` template file. It's observed for changes
by Quarkus' DEV mode, but not by Quinoa (being outside the UI directory).

This is not a major issue by any means and can be worked around in multiple
ways, e.g.:

- restaring the Quarkus' DEV mode (which triggers Quinoa's build process)
- disable PurgeCSS plugin in DEV mode (the config passes the mode from Quarkus
  to Webpack via CLI parameters, see `src/main/webui/package.json`)


## Prerequisites

- a version of OpenJDK installed (assumed 11+) and available on the path
- a version of Node.js installed (LTS will do) and available on the path


## Running the application in dev mode

First of, go to the `src/main/webui` directory and install the needed dependencies:
```shell script
npm install
```

You can run your application in dev mode that enables live coding using:
```shell script
./gradlew quarkusDev
```

## Recreating the watch issue

1. Run the app (in dev mode or otherwise).
2. Open the page in the browser (http://localhost:8080 by default).
3. The page will display a red box ("Red") and a non-colored one ("Green").
4. Go to the `src/main/resources/templates/index.html` file and add the "green"
   class to the second div (the one with only the "box" class).
5. Refresh the page in the browser.

In the page's source you'll see the style added, but the `main.css` file
(located in `build/quinoa-build` directory) is still missing it, due to Quinoa
not detecting a change in the `index.html` file, which is outside
the `src/main/webui` directory. This prevents Quinoa from doing a UI rebuild,
when the HTML changes.

After shutting down the application and starting it again, the page with
display the boxes properly this time (red and green - the styles won't be
stripped as a new launch triggers Quinoa to run the UI build).

At this point you can remove the "green" class from the `index.html` file
and refresh the page. While it will look properly this time, the `main.css`
file will feature an unused ".green" class, which is also an unwanted
behaviour.


## Potential solution

Add a Quinoa configuration option that allows specifying additional locations
to monitor for changes (like the Qute's templates directory).
