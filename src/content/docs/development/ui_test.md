---
title: UI tests
description: Instructions on running the staff (SUI) and public (PUI) interface feature specs, which drive a real browser with Capybara and Selenium WebDriver.
---

The staff interface (SUI) and the public interface (PUI) are both Rails applications with RSpec test suites. Their _feature specs_ (`frontend/spec/features` and `public/spec/features`) drive a real browser using [Capybara](https://github.com/teamcapybara/capybara) and [Selenium WebDriver](https://www.selenium.dev/documentation/webdriver/), either [Firefox via geckodriver](https://firefox-source-docs.mozilla.org/testing/geckodriver/geckodriver/index.html) (the default) or [Chrome via ChromeDriver](https://developer.chrome.com/docs/chromedriver). Both run headless unless you ask for a visible browser.

Feature specs are run by the same build tasks as the rest of each application's specs:

- `./build/run frontend:test` — staff interface specs
- `./build/run public:test` — public interface specs

Note: all example commands assume you are running from the root of your ArchivesSpace project directory.

## Before running

1. Set up your development environment as described in [Running a development version of ArchivesSpace](/development/dev). In particular, the **test** MySQL (`127.0.0.1:3307`) and **test** Solr (`127.0.0.1:8984`) instances must be running — the `docker-compose-dev.yml` stack starts them as `as_test_db` and `as_test_solr` alongside the development ones.
2. Install JRuby and all dependencies:

   ```bash
   ./build/run bootstrap
   ```

3. Install Firefox or Chrome (see below). The specs start their own backend, indexer and Rails server, so you do not need the development servers running to run them.

## Browser and driver setup

### Firefox (default)

Firefox is the default and is what our [CI workflows](https://github.com/archivesspace/archivesspace/actions) use.

`selenium-webdriver` ships with [Selenium Manager](https://www.selenium.dev/documentation/selenium_manager/), which downloads a matching geckodriver automatically when one is not already on your `PATH`. If you prefer to manage the driver yourself, check the [compatibility table](https://firefox-source-docs.mozilla.org/testing/geckodriver/Support.html) against your Firefox version (`firefox --version`) and download the matching [geckodriver release](https://github.com/mozilla/geckodriver/releases). On macOS: `brew install geckodriver`.

On Ubuntu 22.04 or later, the Firefox deb package is a transition package that actually installs Firefox through [snap](https://snapcraft.io/). Snap has security restrictions that do not work with automated testing without additional configuration. To uninstall the snap package and install Firefox as a traditional deb package:

```bash
# remove old snap firefox package (if installed)
sudo snap remove firefox

# create a keyring directory (if not existing)
sudo install -d -m 0755 /etc/apt/keyrings

# download mozilla key and add it to the keyring
wget -q https://packages.mozilla.org/apt/repo-signing-key.gpg -O- | sudo tee /etc/apt/keyrings/packages.mozilla.org.asc > /dev/null

# set high priority for the mozilla packages
echo "deb [signed-by=/etc/apt/keyrings/packages.mozilla.org.asc] https://packages.mozilla.org/apt mozilla main" | sudo tee -a /etc/apt/sources.list.d/mozilla.list > /dev/null
echo '
Package: *
Pin: origin packages.mozilla.org
Pin-Priority: 1000
' | sudo tee /etc/apt/preferences.d/mozilla

# install firefox
sudo apt update && sudo apt install firefox
```

### Chrome

Set `SELENIUM_CHROME=true` to use Chrome instead of Firefox. As with geckodriver, Selenium Manager will fetch a matching [ChromeDriver](https://developer.chrome.com/docs/chromedriver/downloads) if one is not on your `PATH`; macOS users with Homebrew can also install it with `brew install --cask chromedriver`.

**You must have either Firefox or Chrome installed to run these tests.** If you manage drivers yourself, consult the [Firefox WebDriver](https://developer.mozilla.org/en-US/docs/Web/WebDriver) or [ChromeDriver](https://developer.chrome.com/docs/chromedriver) documentation to ensure your Selenium, driver, browser and OS versions all support each other.

## Running the tests

```bash
# Staff interface (SUI)
./build/run frontend:test                                  # Firefox, headless
FIREFOX_OPTS= ./build/run frontend:test                    # Firefox, visible browser
SELENIUM_CHROME=true ./build/run frontend:test             # Chrome, headless
SELENIUM_CHROME=true CHROME_OPTS= ./build/run frontend:test # Chrome, visible browser

# Public interface (PUI)
./build/run public:test                                    # Firefox, headless
FIREFOX_OPTS= ./build/run public:test                      # Firefox, visible browser
SELENIUM_CHROME=true ./build/run public:test               # Chrome, headless
SELENIUM_CHROME=true CHROME_OPTS= ./build/run public:test  # Chrome, visible browser
```

`FIREFOX_OPTS` and `CHROME_OPTS` replace the default browser arguments, which include the headless flag; setting them to an empty value therefore gives you a visible browser. They can also be used to pass any other browser arguments, for example `FIREFOX_OPTS='--width=1280 --height=1024'`.

Both tasks run the whole spec suite for the application — the feature specs plus the model, controller and helper specs. Use the options below to run only what you need.

_Note: the old `frontend:selenium` task no longer exists. The Selenium specs were ported to Capybara and now run as part of `frontend:test`._

### Running a subset of specs

| Option       | Maps to                     | Notes                                                                                       |
| ------------ | --------------------------- | ------------------------------------------------------------------------------------------- |
| `-Dspec=`    | the rspec file/dir argument | Relative to the application's `spec` directory. A single file, a directory, or `file:line`. |
| `-Dpattern=` | `rspec --pattern`           | Glob(s) relative to the application directory, comma separated for more than one.           |
| `-Dexample=` | `rspec -e`                  | Runs examples whose full description matches the string.                                    |
| `-Dtag=`     | `rspec --tag`               | Defaults to `~db`.                                                                          |

Quote any value containing spaces, as in the examples below. Without quotes your shell splits the value and the remaining words are passed to the build as target names, so the run ends in `Target "the" does not exist in the project "ArchivesSpace"` after the specs have already finished.

```bash
# a single spec file
./build/run frontend:test -Dspec='features/accessions_spec.rb'
./build/run public:test -Dspec='features/search_spec.rb'

# a single example, by line number
./build/run frontend:test -Dspec='features/accessions_spec.rb:42'

# all examples whose description contains "can spawn"
./build/run frontend:test -Dspec='features/accessions_spec.rb' -Dexample='can spawn'

# a group of files, as the CI workflows do
./build/run frontend:test -Dpattern='spec/features/[b-h]*_spec.rb'
./build/run frontend:test -Dpattern='spec/models/*_spec.rb,spec/controllers/*_spec.rb'

# with a visible Chrome window
SELENIUM_CHROME=true CHROME_OPTS= ./build/run public:test -Dspec='features/search_spec.rb'
```

Note that some specs depend on a sequence of ordered steps and may not always run cleanly in isolation. In that case more than the example you asked for may need to be run, and unexpected failures may result.

### Running against a backend you started

By default each run starts a backend of its own on a free port from 3636 and shuts it down afterwards. Set `ASPACE_TEST_BACKEND_URL` to point the specs at a backend that is already running instead, which saves the startup wait on every run. It works the same way for both suites:

```bash
ASPACE_TEST_BACKEND_URL='http://localhost:4567' ./build/run frontend:test -Dspec='features/accessions_spec.rb'
ASPACE_TEST_BACKEND_URL='http://localhost:4567' ./build/run public:test -Dspec='features/search_spec.rb'
```

The specs report which backend they are using at the start of the run — `Running tests against http://localhost:4567` rather than `Starting backend ...`. Port 4567 is the development backend, which you can start along with the other development servers as described in [Running a development version of ArchivesSpace](/development/dev).

### Saved pages on spec failures

When a feature spec fails, a screenshot and an HTML copy of the page are saved to the `ci_logs` directory at the root of your project directory, together with the application and test logs for the run. On CI, a zip of that directory is attached to each failed job under Summary -> Artifacts.

To load the assets when viewing a saved HTML page (rather than seeing unstyled HTML), run a development server on the port the application expects: 3000 for staff interface pages and 3001 for public interface pages. See [Running a development version of ArchivesSpace](/development/dev).

## Keeping the test database up to date

When you run `./build/run frontend:test` or `./build/run public:test`, the following steps happen before the specs run:

- All tables of the test database are dropped: `./build/run db:nuke:test`
- `frontend/spec/fixtures/archivesspace-test.sql` is loaded into the test database: `./build/run db:load:test`
- Any not-yet-applied migrations are run: `./build/run db:migrate:test`
- The test Solr index is emptied: `./build/run solr:reset:test`

### Updating the test database dump

If migrations are being applied whenever you run the specs, it means the test database dump `frontend/spec/fixtures/archivesspace-test.sql` has fallen behind. A new dump can be created by running:

```bash
./build/run db:nuke:test
./build/run db:load:test
./build/run db:migrate:test
./build/run db:dump:test
```

An updated `frontend/spec/fixtures/archivesspace-test.sql` will be created that can be committed and pushed to a pull request.

`db:dump:test` uses your locally installed `mysqldump`, so check the diff before committing it. The dump is written by the client, not by the server in the container, and a client from a different MySQL series will rewrite parts of the file that have nothing to do with your migration — for example a `mysqldump` 8.4 client adds an explicit `COLLATE` clause to every column that declares a `CHARACTER SET`, producing thousands of unrelated changed lines. The changes you want to see are the `schema_info` version, the new or altered tables, and any rows your migration adds.

## End-to-end tests

The feature specs described here are separate from the ArchivesSpace end-to-end test suite, which runs against a deployed instance. See [ArchivesSpace End-to-End Test Suite](/development/e2e_tests).
