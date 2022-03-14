# Building an ArchivesSpace release

- [Pre-Release Steps](#prerelease)
- [Build the Docs](#docs)
- [Build the Release](#release)
- [Post the Release with Release Notes](#notes)
- [Post-Release Steps](#postrelease)

## Clone the git repository

When building a release it is important to start from a clean repository. The
safest way of ensuring this is to clone the repo:

```shell
git clone https://github.com/archivesspace/archivesspace.git
```

## Checkout the release branch

If you are building a major or minor version (see [https://semver.org])(semver.org)),
start by creating a branch for the release and all future patch releases:

``` shell
git checkout -b release-v1.0.x
git tag v1.0.0
```
If you are building a patch version, just check out the existing branch and see below:

``` shell
git checkout release-v1.0.x
```

Patch versions typically arise because a regression or critical bug has arisen since
the last major or minor release. If the "hotfix" has been merged to the release branch,
it will need to be cherry-picked back to the master branch. If it has been merged to the
master branch (more likely given current code review / QA workflow), it (they) will
need to be cherry-picked to the release branch.

Consider the following scenario. The current production release is v1.0.0 and a critical
bug has been discovered. In the time since v1.0.0 was released, new features have been
added to the master branch, intended for release in v1.1.0:

``` shell
git checkout master
git checkout -b oh-no-some-migration-corrupts-some-data
( fixes problem )
git commit -m "fix bad migration and add a migration to repair corrupted data"
gh pr create --web
( PR is reviewed and approved on Github, QA'd, then merged to master)
git pull master
git checkout release-v1.0.x
git cherry-pick [SHA of hotfix commit]
git push origin release-v1.0.x
git tag v1.0.1
```

## <a name="prerelease"></a>Pre-Release Steps

### Try to tie up any loose ends

Before doing the release, it's a good idea to try and make sure nothing is left
hanging. Check JIRA for any tickets with the status of “Pull Request Submitted”
or “Rejected” and confirm there are no open Pull Requests in Github with the
current milestone.

### Run the ArchivesSpace rake tasks to check for issues

Before proceeding further, it’s a good idea to check that there aren’t missing
translations or multiple gem versions.

1.  Bootstrap your current development environment on the latest master branch
    by downloading all dependencies--JRuby, Gems, Solr, etc.
    ```shell
    build/run bootstrap
    ```

2.  From the root aspace directory (requires Ruby and Bundler)
    ```shell
    bundle
    bundle exec rake check:locales
    bundle exec rake check:multiple_gem_versions
    ```

3.  Missing locales do not need to be addressed for a Release Candidate, but
    should be noted and provided prior to a full release.  If multiple gem
    versions are reported, that should be addressed prior to moving on.


## <a name="docs"></a>Build the API and Yard Docs

This documentation is maintained on a separate
[https://github.com/archivesspace/archivesspace/tree/gh-pages](gh-pages) branch
in the ArchivesSpace repository, and consists of a
[Slate](https://github.com/archivesspace/slate) site (for REST API documentation), and
the Ruby [YARD](http://yardoc.org/) documentation.  Additional Technical
Documentation (including this document) are maintained and served separately by
the Technical Documentation sub-team at
[https://github.com/archivesspace/tech-docs](https://github.com/archivesspace/tech-docs).

**Note** that these steps assume you're using a standard Ruby, not jRuby.

1.  Check out a new branch from master
    ```shell
    # if 1.0.0 has already been released:
    git checkout release-v1.0.x

    # if 1.0.0 has not yet been released:
    git checkout -b release-v1.0.x
    ```
    At this point you probably want to remove the gems in the `build` directory and
    run bootstrap:
    ```shell
    ./build/run bootstrap
    ```

2.  Run the doc:build task to generate Slate API and Yard documentation. (Note: the
    API generation requires a DB connection with standard enumeration values.)
    ```shell
    ARCHIVESSPACE_VERSION=X.Y.Z APPCONFIG_DB_URL=$APPCONFIG_DB_URL build/run doc:build
    ```
    This generates `docs/slate/source/index.html.md` (Slate source document) and `docs/doc/*` (Yard).


3.  (Optional) Run a docker container to preview API and Yard docs (you can do this as you develop as well).
    ```shell
    docker-compose -f docker-compose-docs.yml up
    ```
    Visit `http://localhost:4568/api` to see the preview server render the api docs.
    Visit `http://localhost:4568/doc` to see the preview server render the Yard docs.

4.  Deploy the documentation. This will push `docs/slate/build` to [the gh-pages branch](https://github.com/archivesspace/archivesspace/tree/gh-pages).
    ```shell
    ./docs/slate/deploy.sh --push-only
    ```
    Published documents should appear a short while later at:
    [http://archivesspace.github.io/archivesspace/api](http://archivesspace.github.io/archivesspace/api)
    [http://archivesspace.github.io/archivesspace/doc](http://archivesspace.github.io/archivesspace/doc)


## <a name="release"></a>Building a release

1.  Building the actual release is very simple. Run the following:
    ```shell
    ./scripts/build_release vX.X.X
    ```

    Replace X.X.X with the version number. This will build and package a release
    in a zip file.

## <a name="notes"></a>Create the Release with Notes

### Build the release notes

After reviewing the above, build the release notes:

```shell
# Set ENV["REL_NOTES_TOKEN"] using a GitHub personal access token
# See: https://docs.github.com/en/free-pro-team@latest/github/authenticating-to-github/creating-a-personal-access-token )
# The token only needs to have the following scope: public_repo, repo:status

export REL_NOTES_TOKEN="github-user-name:personal-access-token"
#example:
export REL_NOTES_TOKEN="lorawoodford:12345"

bundle exec rake release_notes:generate[$current_milestone,$previous_milestone,style]
#example:
bundle exec rake release_notes:generate[2.8.1,2.8.0]
```

### Create the draft release page
Make a release page on Github: https://github.com/archivesspace/archivesspace/releases/new

Use the new tag for the release version. Upload the zip package and paste in
the release note markdown file content.

There are some placeholder sections in the release notes that need to be
updated:

#### Review the Notes

Many of the automatically generated sections (especially the config changes)
will require some manual review/copy-editing.

#### Other considerations

If there are any special considerations add them here. Special considerations
might include changes that will require 3rd party plugins to be updated or a
that a full reindex is required.

Example content:

```md
This release requires a **full reindex** of ArchivesSpace for all functionality to work
correctly. Please follow the [instructions for reindexing](https://archivesspace.github.io/tech-docs/administration/indexes.html)
before starting ArchivesSpace with the new version.
```

### Save the draft

When the placeholder sections have been updated or removed save the draft and
share with the team.


## <a name="postrelease"></a>Post release updates

After a release has been put out it's time for some maintenance before the next
cycle of development clicks into full gear:

### Branches

Delete merged and stale branches in Github as appropriate.

### Milestones

Close the just-released Milestone, adding a due date of today's date.  Create a
new Milestone for the anticipated next release (this can be changed later if the
version numbering is changed for some reason).

### Test Servers

Review existing test servers, and request the removal of any that are no longer
needed (e.g. feature branches that have been merged for the release).

### GitHub Issues

Review existing opening GH issues and close any that have been resolved by
the new release (linking to a specific PR if possible).  For the remaining open
issues, review if they are still a problem, apply labels, link to known JIRA
issues, and add comments as necessary/relevant.

### Accessibility Scan

Run accessibility scans for both the public and staff sites and file a ticket
for any new and ongoing accessibility errors.

### PR Assignments

Begin assigning queued PRs to members of the Core Committers group, making
sure to include the appropriate milestone for the anticipated next release.

### Dependencies

#### Gems

Take a look at all the Gemfile.lock files ( in backend, frontend, public,
etc ) and review the gem versions. Pay close attention to the Rails & Friends
( ActiveSupport, ActionPack, etc ), Rack, and Sinatra versions and make sure
there have not been any security patch versions. There usually are, especially
since Rails sends fix updates rather frequently.

To update the gems, update the version in Gemfile, delete the Gemfile.lock, and
run ./build/run bootstrap to download everything. Then make sure your test
suite passes.

Once everything passes, commit your Gemfiles and Gemfile.lock files.
