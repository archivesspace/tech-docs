---
title: Running ArchivesSpace against MySQL
---

Out of the box, the ArchivesSpace distribution runs against an
embedded database, but this is only suitable for demonstration
purposes. When you are ready to starting using ArchivesSpace with
real users and data, you should switch to using MySQL. MySQL offers
significantly better performance when multiple people are using the
system, and will ensure that your data is kept safe.

ArchivesSpace is currently able to run on MySQL version 5.x & 8.x.

## Download MySQL Connector

ArchivesSpace requires the
[MySQL Connector for Java](http://dev.mysql.com/downloads/connector/j/),
which must be downloaded separately because of its licensing agreement.
Download the Connector and place it in a location where ArchivesSpace can
find it on its classpath:

         $ cd lib
         $ curl -Oq https://repo1.maven.org/maven2/com/mysql/mysql-connector-j/8.0.33/mysql-connector-j-8.0.33.jar

Note that the version of the MySQL connector may be different by the
time you read this.

## Set up your MySQL database

Next, create an empty database in MySQL and grant access to a dedicated
ArchivesSpace user. The following example uses username `as`
and password `as123`.

**NOTE: WHEN CREATING THE DATABASE, YOU MUST SET THE DEFAULT CHARACTER
ENCODING FOR THE DATABASE TO BE `utf8`.** This is particularly important
if you use a MySQL client to create the database (e.g. Navicat, MySQL
Workbench, phpMyAdmin, etc.).

<!-- This is also true of MySQL 8 in general... -->

**NOTE: If using AWS RDS MySQL databases, binary logging is not enabled by default and updates will fail.** To enable binary logging, you must create a custom db parameter group for the database and set the `log_bin_trust_function_creators = 1`. See [Working with DB Parameter Groups](https://docs.aws.amazon.com/AmazonRDS/latest/UserGuide/USER_WorkingWithParamGroups.html) for information about RDS parameter groups. Within a MySQL session you can also try `SET GLOBAL log_bin_trust_function_creators = 1;`

         $ mysql -uroot -p

         mysql> create database archivesspace default character set utf8mb4;
         Query OK, 1 row affected (0.08 sec)

If using MySQL 5.7 and below:

         mysql> grant all on archivesspace.* to 'as'@'localhost' identified by 'as123';
         Query OK, 0 rows affected (0.21 sec)

If using MySQL 8+:

         mysql> create user 'as'@'localhost' identified by 'as123';
         Query OK, 0 rows affected (0.08 sec)

         mysql> grant all privileges on archivesspace.* to 'as'@'localhost';
         Query OK, 0 rows affected (0.21 sec)

Then, modify your `config/config.rb` file to refer to your MySQL
database. When you modify your configuration file, **MAKE SURE THAT YOU
SPECIFY THAT THE CHARACTER ENCODING FOR THE DATABASE TO BE `UTF-8`** as shown
below:

     AppConfig[:db_url] = "jdbc:mysql://localhost:3306/archivesspace?user=as&password=as123&useUnicode=true&characterEncoding=UTF-8"

There is a database setup script that will create all the tables that
ArchivesSpace requires. Run this with:

    scripts/setup-database.sh  # or setup-database.bat under Windows

You can now follow the instructions in the "Getting Started" section to start
your ArchivesSpace application.

\*\*NOTE: For MySQL 8. MySQL 8 uses a new method (caching_sha2_password) as the default authentication plugin instead of the old mysql_native_password that MySQL 5.7 and older used. This may require starting a MySQL 8 server with the `--default-authentication-plugin=mysql_native_password` option. You may also be able to change the auth mechanism on a per user basis by logging into mysql and running `ALTER USER 'as'@'localhost' IDENTIFIED WITH mysql_native_password BY 'as123';`. Also be sure to have the LATEST [MySQL Connector for Java](http://dev.mysql.com/downloads/connector/j/) from MySQL in your /lib/ directory for ArchivesSpace.
