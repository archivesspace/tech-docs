---
title: Building a release
---

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

## Checkout the release branch and create release tag

If you are building a major or minor version (see [https://semver.org](https://semver.org)),
start by creating a branch for the release and all future patch releases:

```shell
git checkout -b release-v1.0.x
git tag v1.0.0
```

If you are building a patch version, just check out the existing branch and see below:

```shell
git checkout release-v1.0.x
```

Patch versions typically arise because a regression or critical bug has arisen since
the last major or minor release. We try to ensure that the "hotfix" is merged into both
master and the release branch without the need to cherry-pick commits from one branch to
the other. The reason is that cherry-picking creates a new commit (with a new commit id)
that contains identical changes, which is not optimal for the repository history.

It is therefore preferable to start from the release branch when creating a "hotfix"
that needs to be merged into both the release branch and master. The Pull Request should
then be based on the release branch. After that Pull Request has been through Code review,
QA and merged, a second Pull Request should be created to merge the updated release branch
to master.

Consider the following scenario. The current production release is v1.0.0 and a critical
bug has been discovered. In the time since v1.0.0 was released, new features have been
added to the master branch, intended for release in v1.1.0:

```shell
git checkout -b oh-no-some-migration-corrupts-some-data origin/release-v1.0.0
( fixes problem )
git commit -m "fix bad migration and add a migration to repair corrupted data"
gh pr create -B release-v1.0.x --web
( PR is reviewed and merged to the release branch)
git checkout release-v1.0.x
git pull
git tag v1.0.1
gh pr create -B master --web
( PR is reviewed and merged to the master branch)
```

## <a name="prerelease"></a>Pre-Release Steps

### Run the ArchivesSpace rake tasks to check for issues

Before proceeding further, it’s a good idea to check that there aren’t missing
translations or multiple gem versions.

1.  Bootstrap your current development environment on the latest master branch
    by downloading all dependencies--JRuby, Gems, Solr, etc.

    ```shell
    build/run bootstrap
    ```

2.  Run the following checks (recommended):

    ```shell
    build/run rake -Dtask=check:locales
    build/run rake -Dtask=check:multiple_gem_versions
    ```

3.  Missing locales do not need to be addressed for a Release Candidate, but
    should be noted and provided prior to a full release. If multiple gem
    versions are reported, that should be addressed prior to moving on.

## <a name="docs"></a>Build and Publish the API and Yard Docs

API docs are built using the submodule in `docs/slate` and Docker.
YARD docs are built using the YARD gem. At this time, they cover a small
percentage of the code and are not especially useful.

### Build the API docs

1.  API documentation depends on the [archivesspace/slate](https://github.com/archivesspace/slate) submodule
    and on Docker. Slate cannot run on JRuby.

    ```shell
    git submodule init
    git submodule update
    ```

2.  Run the `doc:api` task to generate Slate API and Yard documentation. (Note: the
    API generation requires a DB connection with standard enumeration values.)

    ```shell
    ARCHIVESSPACE_VERSION=X.Y.Z APPCONFIG_DB_URL=$APPCONFIG_DB_URL build/run doc:api
    ```

    This generates `docs/slate/source/index.html.md` (Slate source document).

3.  (Optional) Run a docker container to preview API docs.

    ```shell
    docker-compose -f docker-compose-docs.yml up
    ```

    Visit `http://localhost:4568` to preview the api docs.

4.  Build the static api files. The api markdown document should already be in `docs/slate/source` (step 2 above).
    The api markdown will be rendered to html and moved to `docs/build/api`.
    ```shell
    docker run --rm --name slate -v $(pwd)/docs/build/api:/srv/slate/build -v $(pwd)/docs/slate/source:/srv/slate/source slatedocs/slate build
    ```

### Build the YARD docs

1.  Build the YARD docs in the `docs/build/doc` directory:


    ```shell
    ./build/run doc:yardoc
    ```

### Commit built docs and push to Github pages

1.  Double check that you are on a release branch (we don't need this stuff in master) and
    commit the newly built documentation:

    ```shell
    git add docs/build
    git commit -m "release-vx.y.z api and yard documentation"
    ```

    Use `git subtree` to push the documentation to the `gh-pages` branch:

    ```shell
    git subtree push --prefix docs/build origin gh-pages
    ```

    Published documents should appear a short while later at:
    [http://archivesspace.github.io/archivesspace/api](http://archivesspace.github.io/archivesspace/api)
    [http://archivesspace.github.io/archivesspace/doc](http://archivesspace.github.io/archivesspace/doc)

    Note: if the push command fails you may need to delete `gh-pages` in the remote repo:

    ```shell
    git push origin :gh-pages
    ```

## <a name="release"></a>Building a release yourself

1.  Building the actual release is very simple. Run the following:

    ```shell
    ./scripts/build_release vX.X.X
    ```

    Replace X.X.X with the version number. This will build and package a release
    in a zip file.

## <a name="release"></a>Building a release on Github

1.  There is no need to build the release yourself. Just push your tag to Github
    and trigger the `release` workflow:
    ```shell
    git push vX.X.X
    ```
    Replace X.X.X with the version number. You can set the resulting release page to
    "draft" using the Github API.

## <a name="notes"></a>Create the Release with Notes

### Build the release notes

**As of v3.4.0, it should no longer necessary to build release notes manually.**

To manually generate release notes:

```shell
export GITHUB_TOKEN={YOUR DEPLOYMENT TOKEN ON GITHUB}
./build/run doc:release_notes -Dcurrent_tag=v3.4.0 -Doutfile=RELEASE_NOTES.md -Dtoken=$GITHUB_TOKEN
```

#### Edit Release Page As Neccessary

If there are any special considerations add them to the release page manually. Special considerations
might include changes that will require 3rd party plugins to be updated or a
that a full reindex is required.

Example content:

```md
This release requires a **full reindex** of ArchivesSpace for all functionality to work
correctly. Please follow the [instructions for reindexing](https://archivesspace.github.io/tech-docs/administration/indexes.html)
before starting ArchivesSpace with the new version.
```

## <a name="postrelease"></a>Post release updates

After a release has been put out it's time for some maintenance before the next
cycle of development clicks into full gear. Consider the following, depending on
current team consensus:

### Branches

Delete merged and stale branches in Github as appropriate.

### Milestones

Close the just-released Milestone, adding a due date of today's date. Create a
new Milestone for the anticipated next release (this can be changed later if the
version numbering is changed for some reason).

### Test Servers

Review existing test servers, and request the removal of any that are no longer
needed (e.g. feature branches that have been merged for the release).

### GitHub Issues

Review existing opening GH issues and close any that have been resolved by
the new release (linking to a specific PR if possible). For the remaining open
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
