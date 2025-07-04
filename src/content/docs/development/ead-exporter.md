---
title: Repository EAD Exporter
description: A guide to export all published resources' EAD within a specified repository into a single zip archive.
---

Exports all published resource record EAD XML files associated with a single
repository into a zip archive. This zip file will be saved in the ArchivesSpace
data directory (as defined in `config.rb`) and include the repository id in the
filename.

## Usage

```sh
./scripts/ead_export.sh user password repository_id
```

A best practice would be to put the password in a hidden file such as:

```sh
touch ~/.aspace_password
chmod 0600 ~/.aspace_password
vi ~/.aspace_password # enter your password
```

Then call the script like:

```sh
./scripts/ead_export.sh user $(cat /home/user/.aspace_password) repository_id
```

This way you avoid directly exposing it on the command line or in crontab etc.
