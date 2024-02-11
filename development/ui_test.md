# UI test suites

ArchivesSpace's staff and public interfaces use [Selenium](http://docs.seleniumhq.org/) to run automated browser tests. These tests can be run using [Firefox via geckodriver](https://firefox-source-docs.mozilla.org/testing/geckodriver/geckodriver/index.html) and [Chrome](https://sites.google.com/a/chromium.org/chromedriver/home) (either regular Chrome or headless).

Firefox is the default used in our [CI workflows](https://github.com/archivesspace/archivesspace/actions).

On Ubuntu 22.04 or later, the included Firefox deb package is a transition package that actually installs Firefox through [snap](https://snapcraft.io/). Snap has security restrictions that do not work with automated testing without additional configuration.

To uninstall the Firefox snap package and reinstall it as a traditional deb package on Ubuntu use:

```bash
# remove old snap firefox package (if installed)
sudo snap remove firefox

# create a keyring directory (if not existing)
sudo install -d -m 0755 /etc/apt/keyrings

# download mozilla key and add it to the keyring
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null

# set high priority for the mozilla pakcages
echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null
echo '
Package: *
Pin: origin packages.mozilla.org
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla

# install firefox and geckdriver as a standard deb package
sudo apt update && sudo apt install firefox firefox-geckodriver
```

On Mac you can use: `brew install geckodriver`.

To run using Chrome, you must first download the appropriate [ChromeDriver
executable](https://sites.google.com/a/chromium.org/chromedriver/downloads)
and place it somewhere in your OS system path.  Mac users with Homebrew may accomplish this via `brew cask install chromedriver`.

**Please note, you must have either Firefox or Chrome installed on your system to
run these tests. Consult the [Firefox WebDriver](https://developer.mozilla.org/en-US/docs/Mozilla/QA/Marionette/WebDriver)
or [ChromeDriver](https://sites.google.com/a/chromium.org/chromedriver/home)
documentation to ensure your Selenium, driver, browser, and OS versions all match
and support each other.**

## Before running:

Run the bootstrap build task to configure JRuby and all required dependencies:

     $ cd ..
     $ build/run bootstrap

Note: all example code assumes you are running from your ArchivesSpace project directory.

## Running the tests:

```bash
#Frontend tests
./build/run frontend:selenium # Firefox, headless
FIREFOX_OPTS= ./build/run frontend:selenium # Firefox, no-opts = heady

SELENIUM_CHROME=true ./build/run frontend:selenium # Chrome, headless
SELENIUM_CHROME=true CHROME_OPTS= ./build/run frontend:selenium # Chrome, no-opts = heady

#Public tests
./build/run public:test # Firefox, headless
FIREFOX_OPTS= ./build/run public:test # Firefox, no-opts = heady

SELENIUM_CHROME=true ./build/run public:test # Chrome, headless
SELENIUM_CHROME=true CHROME_OPTS= ./build/run public:test # Chrome, no-opts = heady
```

Tests can be scoped to specific files or groups:

```bash
./build/run .. -Dspec='path/to/spec/from/spec/directory' # single file
./build/run .. -Dexample='[description from it block]' # specific block

#EXAMPLES
./build/run frontend:selenium -Dexample='Repository model'
FIREFOX_OPTS= ./build/run frontend:selenium -Dexample='Repository model'# Firefox, heady

./build/run public:test -Dspec='features/accessibility_spec.rb'
SELENIUM_CHROME=true CHROME_OPTS= ./build/run public:test -Dspec='features/accessibility_spec.rb' # Chrome, heady
```

Test require a backend and a frontend service to be running. To ovoid the overhead of starting and stopping them while developing, you can run tests against a dev backend:

```
# start mysql and solr containers:
docker-compose -f docker-compose-dev.yml up

# start services:
 supervisord -c supervisord/archivesspace.conf

# run a spec using the started backend:
ASPACE_TEST_BACKEND_URL='http://localhost:4567' ./build/run frontend:test -Dpattern="./features/events_spec.rb"

# run all examples that contain "can spawn" in their description:
./build/run frontend:test -Dpattern="./features/accessions_spec.rb" -Dexample="can spawn"
```

Note, however, that some tests are dependent on a sequence of ordered steps and may not always run cleanly in isolation.  In this case, more than the example provided may be run, and/or unexpected fails may result.
