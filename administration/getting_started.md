# Getting started with ArchivesSpace

## System requirements

* Java 8 or 11 only.
* At least 1024 MB RAM allocated to the application; at least 2 GB for optimal performance.

ArchivesSpace has been tested on Ubuntu Linux, Mac OS X, and Windows.

While ArchivesSpace does include an embedded database, MySQL is required for production use. 
MariaDB is another relational database currently in use by community members so there is some community support for version 10.4.10 only.

**The embedded database is for testing purposes only. You should use MySQL or MariaDB for any data intended for production, including data in a test instance that you intend to move over to a production instance.**

## Version 3.2 And Above

From any ArchivesSpace version > 3.1.0 external Solr is required (previous
versions provided an embedded Solr v4 instance, which was removed due to
being old and unsupported, with very limited scope for enhancements over
time).

[Running ArchivesSpace with external Solr](../provisioning/solr.md) (Version 3.2+)

## Getting started

The quickest way to get ArchivesSpace up and running is to download
the latest distribution `.zip` file from the following URL:

  https://github.com/archivesspace/archivesspace/releases

You will need to have Java 1.8 installed on your machine.
You can check your Java version by running the command:

     java -version

If you are running an earlier version of java upgrade to 1.8 (not the newest version). If you are running a newer version of Java you should revert back to 1.8 or force your machine to use 1.8 for ArchivesSpace.

When you extract the `.zip` file, it will create a directory called
`archivesspace`. Next, follow the instructions for setting up
[MySQL](../provisioning/mysql.md), and for version 3.2 and above, [Solr](../provisioning/solr.md).

**Do not proceed until MySQL and Solr are running.**

To run the system, just execute the appropriate
startup script for your platform.  On Linux and OSX:

     cd /path/to/archivesspace
     ./archivesspace.sh

and for Windows:

     cd \path\to\archivesspace
     archivesspace.bat

This will start ArchivesSpace running in foreground mode (so it will
shut down when you close your terminal window).  Log output will be
written to the file `logs/archivesspace.out` (by default).

**Note:** If you're running Windows and you get an error message like
`unable to resolve type 'size_t'` or `no such file to load -- bundler`,
make sure that there are no spaces in any part of the path name in which the
ArchivesSpace directory is located.

### Start ArchivesSpace

The first time it starts, the system will take a minute or so to start
up.  Once it is ready, confirm that ArchivesSpace is running correctly by
accessing the following URLs in your browser:

  - http://localhost:8089/ -- the backend
  - http://localhost:8080/ -- the staff interface
  - http://localhost:8081/ -- the public interface
  - http://localhost:8082/ -- the OAI-PMH server
  - http://localhost:8090/ -- the Solr admin console


To start using the Staff interface application, log in using the adminstrator
account:

* Username: `admin`
* Password: `admin`

Then, you can create a new repository by selecting "System" -> "Manage
repositories" at the top right hand side of the screen.  From the
"System" menu, you can perform a variety of administrative tasks, such
as creating and modifying user accounts.  **Be sure to change the
"admin" user's password at this time.**
