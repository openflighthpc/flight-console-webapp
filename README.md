# Flight Console Webapp

A web app to provide browser access to an interactive terminal console.

## Overview

Flight Console Webapp is a web application that in conjunction with [Flight
Console WebAPI](https://github.com/openflighthpc/flight-console-webapi)
provides browser access to an interactive terminal console session within HPC
environments.

## Installation

### From source

Flight Console Webapp requires a recent version of Node and `yarn`.

The following will install from source using `git`:

```
git clone https://github.com/openflighthpc/flight-console-webapp.git
cd flight-console-webapp
yarn install
yarn run build
```

Flight Console Webapp has been built into `build/`.  It can be served by any
webserver configured to serve static files from that directory.  By default,
Flight Console Webapp expects to be served from a path of `/console`.  If that
does not suit your needs, see the configuration section below for details on
how to configure it.

### Installing with Flight Runway

Flight Runway provides a Ruby environment and command-line helpers for
running openflightHPC tools.  Flight Desktop Webapp integrates with Flight
Runway to provide easier installation and configuration.

To install Flight Runway, see the [Flight Runway installation
docs](https://github.com/openflighthpc/flight-runway#installation).

The installation of Flight Console Webapp and the Flight Web Suite is
documented in [the OpenFlight
Documentation](https://use.openflighthpc.org/installing-web-suite/install.html#installing-flight-web-suite).

## Configuration

The default configuration for Flight Console Webapp will work out-of the box
for most cluster setups.  If you have an unusual cluster setup, you can
configure Flight Desktop Webapp by editing the file `build/config.json` and
changing the following:

**apiRootUrl**: Set this to the root URL for the Flight Console Rest API for
the cluster that is being managed.

Additionally, when installing from source, you may also
configure the path at which the built application is to be mounted.

**Mount point**

By default, the built web application expects to be mounted at the path
`/console`.  This setting can be changed by editing three settings across two
files.

First, edit the file `.env` and change the settings for `REACT_APP_MOUNT_PATH`
and `REACT_APP_CONFIG_FILE` to contain the desired mount path.

Second, edit the file `package.json` and change the setting in `homepage` to
contain the desired mount path.

## Operation

Open your browser and visit the URL for your cluster with path `/console`.
E.g., if you have installed on a machine called `my.cluster.com` visit the URL
https://my.cluster.com/console.

Enter your username and password for the cluster.  You will then be presented
with an interactive terminal console session.


# Contributing

Fork the project. Make your feature addition or bug fix. Send a pull
request. Bonus points for topic branches.

Read [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

# Copyright and License

Eclipse Public License 2.0, see [LICENSE.txt](LICENSE.txt) for details.

Copyright (C) 2019-present Alces Flight Ltd.

This program and the accompanying materials are made available under
the terms of the Eclipse Public License 2.0 which is available at
[https://www.eclipse.org/legal/epl-2.0](https://www.eclipse.org/legal/epl-2.0),
or alternative license terms made available by Alces Flight Ltd -
please direct inquiries about licensing to
[licensing@alces-flight.com](mailto:licensing@alces-flight.com).

Flight Console Webapp is distributed in the hope that it will be
useful, but WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, EITHER
EXPRESS OR IMPLIED INCLUDING, WITHOUT LIMITATION, ANY WARRANTIES OR
CONDITIONS OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY OR FITNESS FOR
A PARTICULAR PURPOSE. See the [Eclipse Public License 2.0](https://opensource.org/licenses/EPL-2.0) for more
details.
