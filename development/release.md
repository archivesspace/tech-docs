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

This assumes you will be building a release from master. To build from a tag you
 will need to additionally check out the tag, like this:

```shell
git checkout [tag-name]
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
[Slate](https://github.com/tripit/slate) site (for REST API documentation), and
the Ruby [YARD](http://yardoc.org/) documentation.  Additional Technical
Documentation (including this document) are maintained and served separately by
the Technical Documentation sub-team at
[https://github.com/archivesspace/tech-docs](https://github.com/archivesspace/tech-docs).

**Note** that these steps assume you're using a standard Ruby, not jRuby.

1.  Check out a new branch from master
    ```shell
    git checkout -b $version # $version = release tag to build (i.e. v2.8.0-RC1)
    ```

2.  If you didn’t already bootstrap above, do so now
    ```shell
    build/run bootstrap
    ```

3.  Run the documentation spec file to generate examples for the API docs
    ```shell
    build/run backend:test -Dspec='documentation_spec.rb'
    ```

    This runs through all the endpoints, generates factory bot fixture json, and spits it into a json file (endpoint_examples.json).

4.  Run the documentation Ant Task to generate the Yard documentation, create
    the API.md index file, and rename the YARD index file. Optionally override
    the version set in asconstants with an environment variable.
    ```shell
    ARCHIVESSPACE_VERSION=X.Y.Z build/run doc:build
    ```

5.  Build the Slate/API docs (using a standard Ruby)
    *Note*: At present, middleman requires a bundler version < 2.0 so the docs have been updated to reflect this.
    ```shell
    cd docs/slate
    gem install bundler --version '< 2.0'
    bundle install --binstubs # if this fails, you may need to bundle update
    ./bin/middleman build
    ./bin/middleman server # optional if you want to have a look at the API docs only
    rm -r ../api
    mv build ../api
    ```

6.  Preview the docs (optional)
    ```shell
    cd .. # return to docs dir
    ./bin/jekyll serve # to update bind-address add: -H 0.0.0.0
    ```

    - http://localhost:4000/archivesspace/api/ # api docs
    - http://localhost:4000/archivesspace/doc/ # yard docs

7.  Commit the updates to git
    ```shell
    cd ../ # go to top of the working tree
    git add # all files related to the docs that just got created/updated (eg. docs/*, common/asconstants.rb, etc.)
    #the following warning, if received, can be ignored:
    #The following paths are ignored by one of your .gitignore files:
    #docs/_site
    #Use -f if you really want to add them.
    git commit -m "Updating to vX.X.X"
    ```

8. Push docs to the `gh-pages` branch (do not do this with release candidates)
    ```shell
    #SKIP THIS PUSH STEP FOR RELEASE CANDIDATES
    git subtree push --prefix docs origin gh-pages
    #or, if you get a FF error
    git push origin `git subtree split --prefix docs master`:gh-pages --force
    ```


## <a name="release"></a>Building a release

1.  Building the actual release is very simple. Run the following:
    ```shell
    ./scripts/build_release vX.X.X
    ```

    Replace X.X.X with the version number. This will build and package a release
    in a zip file.

2.  Merge the updates back into master by creating and merging a PR. This
    does not require a PR review (only in this case).

3.  Check out the master branch, pull, prune and tag it
    ```shell
    git checkout master
    git pull --prune
    git tag vX.X.X
    git push --tags
    ```

4.  Delete the clone of ArchivesSpace used to build the release (though be sure
    to retain the zip file you created above if you intend to continue to the
    following section). This step is optional but recommended.


## <a name="notes"></a>Create the Release with Notes

### Review Milestone Assignments

The release announcement needs to have all the tickets that make up the code
changes/contributions included in the release. These changes are identified by
the Github Milestone associated to each Pull Request.  Therefore, you first
need to insure:

1. That all PRs with the current milestone are closed.  The following search on
GitHub's Pull Request page should return no results:
```
is:open is:pr milestone:[current-milestone]
```
2. That no recently merged Pull Requests were merged without having the current
milestone applied.  The following search should only return old (before 11/2020)
or other "back of house" pull requests:
```
is:pr no:milestone state:closed is:merged
```

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
