---
title: Backup and recovery
---

## Using the docker configuration package

### Database backups

The [Docker configuration package](/administration/docker) includes a mechanism that performs periodic backups of your MySQL database,
using: [databacker/mysql-backup](https://github.com/databacker/mysql-backup). It is by default configured to perform
a dump every two hours. See [configuration](https://github.com/databacker/mysql-backup/blob/master/docs/configuration.md) for more options.

The automatically created backups are located in the [`backups` directory](/administration/docker/) of the docker configuration package.

You can explicitly create a dump of your dockerized database while the docker containers are running using the command:

```
docker exec mysql mysqldump -u root -p123456 archivesspace | gzip > /tmp/db.$(date +%F.%H%M%S).sql.gz
```

## Managing your own backups

Performing regular backups of your MySQL database is critical. ArchivesSpace stores
all of your records data in the database, so as long as you have backups of your
database then you can always recover from errors and failures.

If you are running MySQL, the `mysqldump` utility can dump the database
schema and data to a file. It's a good idea to run this with the
`--single-transaction` option to avoid locking your database tables
while your backups run. It is also essential to use the `--routines`
flag, which will include functions and stored procedures in the
backup. The `mysqldump` utility is widely used, and there are many tutorials
available. As an example, something like this in your `crontab` would backup your
database twice daily:

      # Dump archivesspace database 6am and 6pm
     30 06,18 * * * mysqldump -u as -pas123 archivesspace | gzip > ~/backups/db.$(date +%F.%H%M%S).sql.gz

You should store backups in a safe location.

If you are running with the demo database (NEVER run the demo database in production),
you can create periodic database snapshots using the following configuration settings:

     # In this example, we create a snapshot at 4am each day and keep
     # 7 days' worth of backups
     #
     # Database snapshots are written to 'data/demo_db_backups' by
     # default.
     AppConfig[:demo_db_backup_schedule] = "0 4 \* \* \*"
     AppConfig[:demo\_db\_backup\_number\_to\_keep] = 7

Solr indexes can always be [recreated](administration/indexes/) from the contents of the
database. For large sites, where recreating the indexes would take too long, it is possible to [backup and restore solr indexes](https://solr.apache.org/guide/solr/latest/deployment-guide/backup-restore.html).
In that case, you also need to backup and restore the files used by the indexers to mark which part of the data is already indexed:

    docker cp archivesspace:/archivesspace/data/indexer_state /tmp/indexer_state
    docker cp archivesspace:/archivesspace/data/indexer_pui_state /tmp/indexer_pui_state

## Creating backups of your database using the provided script

ArchivesSpace provides simple scripts for windows and unix-like systems for backing up a the database to a `.zip` file.

### When using the embedded demo database

Note: _NEVER use the demo database in production._. You can run:

     scripts/backup.sh --output /path/to/backup-yyyymmdd.zip

and the script will generate a file containing a snapshot of the demo database.

### When using MySQL

If you are running against MySQL and have `mysqldump` installed, you
can provide the `--mysqldump` option. This will read the
database settings from your configuration file and add a dump of your
MySQL database to the resulting `.zip` file.

     scripts/backup.sh --mysqldump --output ~/backups/backup-yyyymmdd.zip

## Recovering from backup

When recovering an ArchivesSpace installation from backup, you will
need to restore your database (either the demo database or MySQL).

After restoring your database, it is recommended to [recreate your solr indexes](administration/indexes/)

### Recovering your database

#### When managing your own MySQL

If you are using MySQL, recovering your database just requires loading
your `mysqldump` backup into an empty database. If you are using the
`scripts/backup.sh` script (described above), this dump file is named
`mysqldump.sql` in your backup `.zip` file.

To load a MySQL dump file, follow the directions in _Set up your MySQL
database_ to create an empty database with the appropriate
permissions. Then, populate the database from your backup file using
the MySQL client:

    `mysql -uas -p archivesspace < mysqldump.sql`, where
      `as` is the user name
      `archivesspace` is the database name
      `mysqldump.sql` is the mysqldump filename

You will be prompted for the password of the user.

#### When using the demo database

If you are using the demo database, your backup `.zip` file will
contain a directory called `demo_db_backups`. Each subdirectory of
`demo_db_backups` contains a backup of the demo database. To
restore from a backup, copy its `archivesspace_demo_db` directory back
to your ArchivesSpace data directory. For example:

     cp -a /unpacked/zip/demo_db_backups/demo_db_backup_1373323208_25926/archivesspace_demo_db \
           /path/to/archivesspace/data/

#### When running on Docker

If you are using the Docker configuration package to run ArchivesSpace you can restore a database dump onto your `archivesspace` MySQL database with the following command:

```
docker exec mysql mysql -uas -pas123 archivesspace < /tmp/db.2025-02-26.164907.sql
```
