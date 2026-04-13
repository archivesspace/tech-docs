---
title: Configuration
description: Lists all available configuration options available within the config/config.rb file, including configuration names, values, and suggestions for setup.
---

The primary configuration for ArchivesSpace is done in the config/config.rb
file. By default, this file contains the default settings, which are indicated
by commented out lines ( indicated by the "#" in the file ). You can adjust these
settings by adding new lines that change the default and restarting
ArchivesSpace. Be sure that your new settings are not commented out
( i.e. do NOT start with a "#" ), otherwise the settings will not take effect.

## Commonly changed settings

### Database config

#### :db_url

Set your database name and credentials. The default specifies that the embedded database should be used.
It is recommended to use a MySQL database instead of the embedded database.
For more info, see [Using MySQL](/provisioning/mysql)

This is an example of specifying MySQL credentials:

`AppConfig[:db_url] = "jdbc:mysql://127.0.0.1:3306/aspace?useUnicode=true&characterEncoding=UTF-8&user=as&password=as123"`

#### :db_max_connections

Set the maximum number of database connections used by the application.
Default is derived from the number of indexer threads.

`AppConfig[:db_max_connections] = proc { 20 + (AppConfig[:indexer_thread_count] * 2) }`

### URLs for ArchivesSpace components

Set the ArchivesSpace backend port. The backend listens on port 8089 by default.

`AppConfig[:backend_url] = "http://localhost:8089"`

Set the ArchivesSpace staff interface (frontend) port. The staff interface listens on port 8080 by default.

`AppConfig[:frontend_url] = "http://localhost:8080"`

Set the ArchivesSpace public interface port. The public interface listens on port 8081 by default.

`AppConfig[:public_url] = "http://localhost:8081"`

Set the ArchivesSpace OAI server port. The OAI server listens on port 8082 by default.

`AppConfig[:oai_url] = "http://localhost:8082"`

Set the ArchivesSpace Solr index port. The Solr server listens on port 8090 by default.

`AppConfig[:solr_url] = "http://localhost:8090"`

Set the ArchivesSpace indexer port. The indexer listens on port 8091 by default.

`AppConfig[:indexer_url] = "http://localhost:8091"`

Set the ArchivesSpace API documentation port. The API documentation listens on port 8888 by default.

`AppConfig[:docs_url] = "http://localhost:8888"`

### Enabling ArchivesSpace components

Enable or disable specific componenets by setting the following settings to true or false (defaults to true):

```ruby
AppConfig[:enable_backend] = true
AppConfig[:enable_frontend] = true
AppConfig[:enable_public] = true
AppConfig[:enable_solr] = true
AppConfig[:enable_indexer] = true
AppConfig[:enable_docs] = true
AppConfig[:enable_oai] = true
```

### Application logging

By default, all logging will be output on the screen while the archivesspace command
is running. When running as a daemon/service, this is put into a file in
`logs/archivesspace.out`. You can route log output to a different file per component by changing the log value to
a filepath that archivesspace has write access to.

You can also set the logging level for each component. Valid values are:

- `debug` (everything)
- `info`
- `warn`
- `error`
- `fatal` (severe only)

#### `AppConfig[:frontend_log]`

File for log output for the frontend (staff interface). Set to "default" to
route log output to archivesspace.out.

#### `#AppConfig[:frontend_log_level]`

Logging level for the frontend.

#### `AppConfig[:backend_log]`

File for log output for the backend. Set to "default" to
route log output to archivesspace.out.

#### `#AppConfig[:backend_log_level]`

Logging level for the backend.

#### `AppConfig[:pui_log]`

File for log output for the public UI. Set to "default" to
route log output to archivesspace.out.

#### `#AppConfig[:pui_log_level]`

Logging level for the public UI.

#### `AppConfig[:indexer_log]`

File for log output for the indexer. Set to "default" to
route log output to archivesspace.out.

#### `#AppConfig[:indexer_log_level]`

Logging level for the indexer.

### Database logging

#### `AppConfig[:db_debug_log]`

Set to true to log all SQL statements.
Note that this will have a performance impact!

`AppConfig[:db_debug_log] = false`

#### `AppConfig[:mysql_binlog]`

Set to true if you have enabled MySQL binary logging.

`AppConfig[:mysql_binlog] = false`

### Solr backups

#### `AppConfig[:solr_backup_schedule]`

Set Solr back up schedule. By default, Solr backups will run at midnight. See https://crontab.guru/ for
information about the schedule syntax.

`AppConfig[:solr_backup_schedule] = "0 * * * *"`

#### `AppConfig[:solr_backup_number_to_keep]`

Number of Solr backups to keep (default = 1)

`AppConfig[:solr_backup_number_to_keep] = 1`

#### `AppConfig[:solr_backup_directory]`

Directory to store Solr backups.

`AppConfig[:solr_backup_directory] = proc { File.join(AppConfig[:data_directory], "solr_backups") }`

### Default Solr params

#### `AppConfig[:solr_params]`

Add default solr params.

A simple example: use AND for search:

`AppConfig[:solr_params] = { "q.op" => "AND" }`

A more complex example: set the boost query value (bq) to boost the relevancy
for the query string in the title, set the phrase fields parameter (pf) to boost
the relevancy for the title when the query terms are in close proximity to each
other, and set the phrase slop (ps) parameter for the pf parameter to indicate
how close the proximity should be:

```ruby
AppConfig[:solr_params] = {
  "bq" => proc { "title:\"#{@query_string}\"*" },
  "pf" => 'title^10',
  "ps" => 0,
}
```

### Language

#### `AppConfig[:locale]`

Set the application's language (see the .yml files in
https://github.com/archivesspace/archivesspace/tree/master/common/locales
for a list of available locale codes). Default is English (:en):

`AppConfig[:locale] = :en`

### Plugin registration

#### `AppConfig[:plugins]`

Plug-ins to load. They will load in the order specified.

`AppConfig[:plugins] = ['local',  'lcnaf']`

### Thread count

#### `AppConfig[:job_thread_count]`

The number of concurrent threads available to run background jobs.
Introduced because long running jobs were blocking the queue.
Resist the urge to set this to a big number!

`AppConfig[:job_thread_count] = 2`

### OAI configuration options

**NOTE: As of version 2.5.2, the following parameters (oai_repository_name, oai_record_prefix, and oai_admin_email) have been deprecated. They should be set in the Staff User Interface. To set them, select the System menu in the Staff User Interface and then select Manage OAI-PMH Settings. These three settings are at the top of the page in the General Settings section. These settings will be completely removed from the config file when version 2.6.0 is released.**

#### `AppConfig[:oai_repository_name]`

`AppConfig[:oai_repository_name] = 'ArchivesSpace OAI Provider'`

#### `AppConfig[:oai_record_prefix]`

`AppConfig[:oai_record_prefix] = 'oai:archivesspace'`

#### `AppConfig[:oai_admin_email]`

`AppConfig[:oai_admin_email] = 'admin@example.com'`

#### `AppConfig[:oai_sets]`

In addition to the sets based on level of description, you can define OAI Sets
based on repository codes and/or sponsors as follows:

```ruby
AppConfig[:oai_sets] = {
  'repository_set' => {
    :repo_codes => ['hello626'],
    :description => "A set of one or more repositories",
  },

  'sponsor_set' => {
    :sponsors => ['The_Sponsor'],
    :description => "A set of one or more sponsors",
  },
}
```

## Other less commonly changed settings

### Default admin password

#### `AppConfig[:default_admin_password]`

Set default admin password. Default password is "admin".

`#AppConfig[:default_admin_password] = "admin"`

### Data directories

#### `AppConfig[:data_directory]`

If you run ArchivesSpace using the standard scripts (archivesspace.sh,
archivesspace.bat or as a Windows service), the value of :data_directory is
automatically set to be the "data" directory of your ArchivesSpace
distribution. You don't need to change this value unless you specifically
want ArchivesSpace to put its data files elsewhere.

`AppConfig[:data_directory] = File.join(Dir.home, "ArchivesSpace")`

#### `AppConfig[:backup_directory]`

Directory to store automated backups when using the embedded demo database (Apache Derby instead of MySQL). This defaults to `demo_db_backups` within the `data` directory.

`AppConfig[:backup_directory] = proc { File.join(AppConfig[:data_directory], "demo_db_backups") }`

### Solr defaults

#### `AppConfig[:solr_indexing_frequency_seconds]`

The number of seconds between each run of the SUI and PUI indexers. The indexers will perform and indexing cycle every configured number of seconds.

`AppConfig[:solr_indexing_frequency_seconds] = 30`

#### `AppConfig[:solr_facet_limit]`

The maximum number of distinct facet terms Solr will include in the response for a given field.

`AppConfig[:solr_facet_limit] = 100`

#### `AppConfig[:default_page_size]`

The number of records included in each page in all paginated backend api responses.
`AppConfig[:default_page_size] = 10`

#### `AppConfig[:max_page_size]`

Requests to the backend api can define a custom page_size param. This is the maximum allowed page size.
`AppConfig[:max_page_size] = 250`

### Cookie prefix

#### `AppConfig[:cookie_prefix]`

A prefix added to cookies used by the application.
Change this if you're running more than one instance of ArchivesSpace on the
same hostname (i.e. multiple instances on different ports).
Default is "archivesspace".

`AppConfig[:cookie_prefix] = "archivesspace"`

### SUI Indexer settings

The size of each batch of records passed to each indexer worker-thread to process and push to solr.
The periodic indexer can run using multiple threads to take advantage of
multiple CPU cores. By setting these two options, you can control how many
CPU cores are used, and the amount of memory that will be consumed by the
indexing process (more cores and/or more records per thread means more memory used).

#### `AppConfig[:indexer_records_per_thread]`

The size of each batch of records passed to each indexer worker-thread to process and push to solr. More records per thread means that more memory will be used by the indexer process.
`AppConfig[:indexer_records_per_thread] = 25`

#### `AppConfig[:indexer_thread_count]`

The number of worker-thread to be used by the SUI indexer. More worker-threads means that more CPU cores will be used.
`AppConfig[:indexer_thread_count] = 4`

#### `AppConfig[:indexer_solr_timeout_seconds]`

The indexer is making requests to solr in order to push updated records to the solr index. This is the maximum number of seconds that the indexer will wait for solr to respond to a request.

`AppConfig[:indexer_solr_timeout_seconds] = 300`

### PUI Indexer Settings

#### `AppConfig[:pui_indexer_enabled]`

If false no pui indexer is started. Set to false if not using the PUI at all.
`AppConfig[:pui_indexer_enabled] = true`

#### `AppConfig[:pui_indexing_frequency_seconds]`

The number of seconds between each run of the PUI indexer. The indexer will perform and indexing cycle every configured number of seconds.
`AppConfig[:pui_indexing_frequency_seconds] = 30`

#### `AppConfig[:pui_indexer_records_per_thread]`

The size of each batch of records passed to each indexer worker-thread to process and push to solr.
The PUI indexer can run using multiple threads to take advantage of
multiple CPU cores. By setting these two options, you can control how many
CPU cores are used, and the amount of memory that will be consumed by the
indexing process (more cores and/or more records per thread means more memory used).

`AppConfig[:pui_indexer_records_per_thread] = 25`

#### `AppConfig[:pui_indexer_thread_count]`

The number of worker-thread to be used by the PUI indexer. More worker-threads means that more CPU cores will be used.
`AppConfig[:pui_indexer_thread_count] = 1`

### Index state

#### `AppConfig[:index_state_class]`

The indexer needs a place to store it's state (keep track of which records have already been indexed).
Set to 'IndexState' (default) to store the state in the local `data` directory.
Set to 'IndexStateS3' (optional) to store the state in an AWS S3 bucket in the Amazon Cloud.

`AppConfig[:index_state_class] = 'IndexState'`

#### `AppConfig[:index_state_s3]` - Relevant only when using S3 storage for the indexer state

If using S3 storage for the indexer state in amazon s3 (optional), you need to configure the access to S3.

NOTE: S3 charges for read / update requests and the pui indexer is continually
writing to state files so you may want to increase `pui_indexing_frequency_seconds` and `solr_indexing_frequency_seconds`

##### Configuring S3 access using environment variables (default)

By default, the S3 configuration is fetched from the following shell environment variables:

- `AWS_REGION`
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `AWS_ASPACE_BUCKET`

It is using the `:cookie_prefix` configuration as a prefix for the state files stored in the bucket - usefull when using the same bucket to store indexer state of multiple archivesspace instances.

##### Configuring S3 access using AppConfig variable in the `config.rb` file

```ruby
AppConfig[:index_state_s3] = {
  region: "us-east-1",
  aws_access_key_id: "ASIAXXXXEXAMPLEID",
  aws_secret_access_key: "xXxxXXxxXX/XXXXXX/XXXXXXXEXAMPLEKEY",
  bucket: ENV.fetch("my-as-test-bucket"),
  prefix: proc { "#{AppConfig[:cookie_prefix]}_" },
}
```

You can use `prefix: "some random string"` instead of the above code that used the `:cookie_prefix` AppConfig variable.

### Misc. database options

#### `AppConfig[:allow_other_unmapped]`

Allow assigning the special enumeration value `other_unmapped` for dynamic enum (controlled value) fields. When set to `true` `other_unmapped` is treated as a valid value for all enumeration (controlled value) fields. The `other_unmapped` value is added as a possible value for all controlled value lists.
This feature is designed for handling unmapped or unknown enumeration values, eventually useful during data migrations where source data may have values not yet defined in controlled value lists, or generally importing external data that uses values that are not already defined in a controlled value list.

`AppConfig[:allow_other_unmapped] = false`

#### `AppConfig[:db_url_redacted]`

This is how the database url (which includes the database username and password) will appear in the logs. The default replaces the username and password with `REDACTED`, so that:
`"user=john&password=secret123"`
becomes
`"user=[REDACTED]&password=[REDACTED]"`

`AppConfig[:db_url_redacted] = proc { AppConfig[:db_url].gsub(/(user|password)=(.*?)(&|$)/, '\1=[REDACTED]\3') }`

#### `AppConfig[:demo_db_backup_schedule]`

When using the embedded demo database (Apache Derby instead of MySQL) this is the schedule of the automated backups, in cron format. By default, it is at 4AM every day.

`AppConfig[:demo_db_backup_schedule] = "0 4 * * *"`

#### `AppConfig[:demo_db_backup_number_to_keep] = 7`

How many backups to keep available when using the embedded demo database

`AppConfig[:demo_db_backup_number_to_keep] = 7`

#### `AppConfig[:allow_unsupported_database]`

Set this to true if you are determined to use a database other than MySQL or the embedded demo database based on Apache Derby (not-recommended!).

`AppConfig[:allow_unsupported_database] = false`

#### `AppConfig[:allow_non_utf8_mysql_database]`

Set this to true to skip the standard validation of the character encoding of MySQL tables being set to UTF8 (not-recommended!).

`AppConfig[:allow_non_utf8_mysql_database] = false`

### Proxy URLs

If you are serving user-facing applications via proxy
(i.e., another domain or port, or via https, or for a prefix) it is
recommended that you record those URLs in your configuration

#### `AppConfig[:frontend_proxy_url] = proc { AppConfig[:frontend_url] }`

Proxy URL for the frontend (staff interface)

`AppConfig[:frontend_proxy_url] = proc { AppConfig[:frontend_url] }`

#### `AppConfig[:public_proxy_url]`

Proxy URL for the public interface

`AppConfig[:public_proxy_url] = proc { AppConfig[:public_url] }`

#### `AppConfig[:oai_proxy_url]`

Proxy URL for the oai service (if exposed, see OAI section)

`AppConfig[:oai_proxy_url] = 'http://your-public-oai-url.example.com'`

#### `AppConfig[:frontend_proxy_prefix]`

Don't override this setting unless you know what you're doing

`AppConfig[:frontend_proxy_prefix] = proc { "#{URI(AppConfig[:frontend_proxy_url]).path}/".gsub(%r{/+$}, "/") }`

#### `AppConfig[:public_proxy_prefix]`

Don't override this setting unless you know what you're doing

`AppConfig[:public_proxy_prefix] = proc { "#{URI(AppConfig[:public_proxy_url]).path}/".gsub(%r{/+$}, "/") }`

### Enable component applications

Setting any of these false will prevent the associated applications from starting.
Temporarily disabling the frontend and public UIs and/or the indexer may help users
who are running into memory-related issues during migration.

#### `AppConfig[:enable_backend]`

`AppConfig[:enable_backend] = true`

#### `AppConfig[:enable_frontend]`

`AppConfig[:enable_frontend] = true`

#### `AppConfig[:enable_public]`

`AppConfig[:enable_public] = true`

#### `AppConfig[:enable_solr]`

`AppConfig[:enable_solr] = true`

#### `AppConfig[:enable_indexer]`

`AppConfig[:enable_indexer] = true`

#### `AppConfig[:enable_docs]`

`AppConfig[:enable_docs] = true`

#### `AppConfig[:enable_oai]`

`AppConfig[:enable_oai] = true`

### Jetty shutdown

Some use cases want the ability to shutdown the Jetty service using Jetty's
ShutdownHandler, which allows a POST request to a specific URI to signal
server shutdown. The prefix for this URI path is set to `/xkcd` to reduce the
possibility of a collision in the path configuration. So, full path would be

`/xkcd/shutdown?token={randomly generated password}`

The launcher creates a password to use this, which is stored
in the data directory. This is not turned on by default.

#### `AppConfig[:use_jetty_shutdown_handler]`

`AppConfig[:use_jetty_shutdown_handler] = false`

#### `AppConfig[:jetty_shutdown_path]`

`AppConfig[:jetty_shutdown_path] = "/xkcd"`

### Managing multile backend instances

If you have multiple instances of the backend running behind a load
balancer, list the URL of each backend instance here. This is used by the
real-time indexing, which needs to connect directly to each running
instance.

By default we assume you're not using a load balancer, so we just connect
to the regular backend URL.

#### `AppConfig[:backend_instance_urls]`

`AppConfig[:backend_instance_urls] = proc { [AppConfig[:backend_url]] }`

### Theme

For theming customization, see https://docs.archivesspace.org/customization/theming/

#### `AppConfig[:frontend_theme]`

Name of the theme to use on the Staff UI

`AppConfig[:frontend_theme] = "default"`

#### `AppConfig[:public_theme]`

Name of the theme to use on the Public UI

`AppConfig[:public_theme] = "default"`

### Session expiration

#### `AppConfig[:session_expire_after_seconds]`

Sessions marked as expirable will timeout after this number of seconds of inactivity

`AppConfig[:session_expire_after_seconds] = 3600`

#### `AppConfig[:session_nonexpirable_force_expire_after_seconds]`

Sessions marked as non-expirable will eventually expire too, but after a longer period.

`AppConfig[:session_nonexpirable_force_expire_after_seconds] = 604800`

### System usernames

Hidden (not viewable on the Staff UI User management) system users are automatically created to be used by the indexer, the PUI and the Staff UI in order to access the backend API.

#### `AppConfig[:search_username]`

The user name of the hidden system user that the indexer uses to access the backend API
`AppConfig[:search_username] = "search_indexer"`

#### `AppConfig[:public_username]`

The user name of the hidden system user that the PUI uses to access the backend API

`AppConfig[:public_username] = "public_anonymous"`

#### `AppConfig[:staff_username]`

The user name of the hidden system user that the Staff UI uses to access the backend API

`AppConfig[:staff_username] = "staff_system"`

### Authentication sources

ArchivesSpace comes with its own user management functionality but can also be configured to authenticate against one or more [LDAP directories](/customization/ldap/). Oauth authentication is available using the [aspace-oauth plugin](https://github.com/lyrasis/aspace-oauth)

`AppConfig[:authentication_sources] = []`

### Misc. backlog and snapshot settings

#### `AppConfig[:realtime_index_backlog_ms]`

> TODO - Needs more documentation

`AppConfig[:realtime_index_backlog_ms] = 60000`

### Notifications configuration

An internal notification mechanism is used to keep user preferences, enumeration (controlled value list) values, repository information etc. up to date within the UI while minimizing requests to the backend API.

#### `AppConfig[:notifications_backlog_ms]`

Notifications older that this amount of miliseconds are considered expired and will not be announced anymore.

`AppConfig[:notifications_backlog_ms] = 60000`

#### `AppConfig[:notifications_poll_frequency_ms]`

How often should notifications be announced.

`AppConfig[:notifications_poll_frequency_ms] = 1000`

#### `AppConfig[:max_usernames_per_source]`

> TODO - Needs more documentation

`AppConfig[:max_usernames_per_source] = 50`

#### `AppConfig[:demodb_snapshot_flag]`

> TODO - Needs more documentation

`AppConfig[:demodb_snapshot_flag] = proc { File.join(AppConfig[:data_directory], "create_demodb_snapshot.txt") }`

### Report Configuration

#### `AppConfig[:report_page_layout]`

Uses valid values for the CSS3 @page directive's size property:
http://www.w3.org/TR/css3-page/#page-size-prop

`AppConfig[:report_page_layout] = "letter"`

#### `AppConfig[:report_pdf_font_paths]`

> TODO - Needs more documentation

`AppConfig[:report_pdf_font_paths] = proc { ["#{AppConfig[:backend_url]}/reports/static/fonts/dejavu/DejaVuSans.ttf"] }`

#### `AppConfig[:report_pdf_font_family]`

> TODO - Needs more documentation

`AppConfig[:report_pdf_font_family] = "\"DejaVu Sans\", sans-serif"`

### Plugins directory

#### `AppConfig[:plugins_directory]`

By default, the plugins directory will be in your ASpace Home.
If you want to override that, update this with an absolute path

`AppConfig[:plugins_directory] = "plugins"`

### Feedback

#### `AppConfig[:feedback_url]`

URL to direct the feedback link.
You can remove this from the footer by making the value blank.

`AppConfig[:feedback_url] = "http://archivesspace.org/contact"`

### User registration

#### `AppConfig[:allow_user_registration]`

Allow an unauthenticated user to create an account

`AppConfig[:allow_user_registration] = true`

### Help Configuration

#### `AppConfig[:help_enabled]`

> TODO - Needs more documentation

`AppConfig[:help_enabled] = true`

#### `AppConfig[:help_url]`

> TODO - Needs more documentation

`AppConfig[:help_url] = "https://archivesspace.atlassian.net/wiki/spaces/ArchivesSpaceUserManual/overview"``

#### `AppConfig[:help_topic_base_url]`

> TODO - Needs more documentation

`AppConfig[:help_topic_base_url] = "https://archivesspace.atlassian.net/wiki/spaces/ArchivesSpaceUserManual/pages/"``

### Shared storage

#### `AppConfig[:shared_storage]`

`AppConfig[:shared_storage] = proc { File.join(AppConfig[:data_directory], "shared") }`

### Background jobs

#### `AppConfig[:job_file_path]`

Formerly known as :import_job_path

> TODO - Needs more documentation

`AppConfig[:job_file_path] = proc { AppConfig.has_key?(:import_job_path) ? AppConfig[:import_job_path] : File.join(AppConfig[:shared_storage], "job_files") }`

#### `AppConfig[:job_poll_seconds]`

> TODO - Needs more documentation

`AppConfig[:job_poll_seconds] = proc { AppConfig.has_key?(:import_poll_seconds) ? AppConfig[:import_poll_seconds] : 5 }`

#### `AppConfig[:job_timeout_seconds]`

> TODO - Needs more documentation

`AppConfig[:job_timeout_seconds] = proc { AppConfig.has_key?(:import_timeout_seconds) ? AppConfig[:import_timeout_seconds] : 300 }`

#### `AppConfig[:jobs_cancelable]`

By default, only allow jobs to be cancelled if we're running against MySQL (since we can rollback)

`AppConfig[:jobs_cancelable] = proc { (AppConfig[:db_url] != AppConfig.demo_db_url).to_s }`

### Locations

#### `AppConfig[:max_location_range]`

> TODO - Needs more documentation

`AppConfig[:max_location_range] = 1000`

### Schema Info check

#### `AppConfig[:ignore_schema_info_check]`

ASpace backend will not start if the db's schema_info version is not set
correctly for this version of ASPACE. This is to ensure that all the
migrations have run and completed before starting the app. You can override
this check here. Do so at your own peril.

`AppConfig[:ignore_schema_info_check] = false`

### Demo data

#### `AppConfig[:demo_data_url]`

This is a URL that points to some demo data that can be used for testing,
teaching, etc. To use this, set an OS environment variable of ASPACE_DEMO = true

`AppConfig[:demo_data_url] = "https://s3-us-west-2.amazonaws.com/archivesspacedemo/latest-demo-data.zip"`

### External IDs

#### `AppConfig[:show_external_ids]`

Expose external ids in the frontend

`AppConfig[:show_external_ids] = false`

### Jetty request/response buffer

Set the allowed size of the request/response header that Jetty will accept
(anything bigger gets a 403 error). Note if you want to jack this size up,
you will also have to configure your Nginx/Apache as well if you're using that

#### `AppConfig[:jetty_response_buffer_size_bytes]`

`AppConfig[:jetty_response_buffer_size_bytes] = 64 * 1024`

#### `AppConfig[:jetty_request_buffer_size_bytes]`

`AppConfig[:jetty_request_buffer_size_bytes] = 64 * 1024`

### Container management configuration fields

#### `AppConfig[:container_management_barcode_length]`

Defines global and repo-level barcode validations (validating on length only).
Barcodes that have either no value, or a value between :min and :max, will validate on save.
Set global constraints via :system_default, and use the repo_code value for repository-level constraints.
Note that :system_default will always inherit down its values when possible.

`AppConfig[:container_management_barcode_length] = {:system_default => {:min => 5, :max => 10}, 'repo' => {:min => 9, :max => 12}, 'other_repo' => {:min => 9, :max => 9} }`

#### `AppConfig[:container_management_extent_calculator]`

Globally defines the behavior of the exent calculator.
Use :report_volume (true/false) to define whether space should be reported in cubic
or linear dimensions.
Use :unit (:feet, :inches, :meters, :centimeters) to define the unit which the calculator
reports extents in.
Use :decimal_places to define how many decimal places the calculator should return.

Example:

`AppConfig[:container_management_extent_calculator] = { :report_volume => true, :unit => :feet, :decimal_places => 3 }`

### Record inheritance in public interface

#### `AppConfig[:record_inheritance]`

Define the fields for a record type that are inherited from ancestors
if they don't have a value in the record itself.
This is used in common/record_inheritance.rb and was developed to support
the new public UI application.
Note - any changes to record_inheritance config will require a reindex of pui
records to take affect. To do this remove files from indexer_pui_state

```ruby
AppConfig[:record_inheritance] = {
  :archival_object => {
    :inherited_fields => [
      {
        :property => 'title',
        :inherit_directly => true
      },
      {
        :property => 'component_id',
        :inherit_directly => false
      },
      {
        :property => 'language',
        :inherit_directly => true
      },
      {
        :property => 'dates',
        :inherit_directly => true
      },
      {
        :property => 'extents',
        :inherit_directly => false
      },
      {
        :property => 'linked_agents',
        :inherit_if => proc {|json| json.select {|j| j['role'] == 'creator'} },
        :inherit_directly => false
      },
      {
        :property => 'notes',
        :inherit_if => proc {|json| json.select {|j| j['type'] == 'accessrestrict'} },
        :inherit_directly => true
      },
      {
        :property => 'notes',
        :inherit_if => proc {|json| json.select {|j| j['type'] == 'scopecontent'} },
        :inherit_directly => false
      },
      {
        :property => 'notes',
        :inherit_if => proc {|json| json.select {|j| j['type'] == 'langmaterial'} },
        :inherit_directly => false
      },
    ]
  }
}
```

To enable composite identifiers - added to the merged record in a property
`\_composite_identifier`

The values for `:include_level` and `:identifier_delimiter` shown here are the defaults

If `:include_level` is set to true then level values (eg Series) will be included in `\_composite_identifier`

The `:identifier_delimiter` is used when joining the four part identifier for resources

```ruby
AppConfig[:record_inheritance][:archival_object][:composite_identifiers] = {
  :include_level => false,
  :identifier_delimiter => ' '
}
```

To configure additional elements to be inherited use this pattern in your config

```ruby
AppConfig[:record_inheritance][:archival_object][:inherited_fields] <<
  {
    :property => 'linked_agents',
    :inherit_if => proc {|json| json.select {|j| j['role'] == 'subject'} },
    :inherit_directly => true
  }
```

... or use this pattern to add many new elements at once

```ruby
AppConfig[:record_inheritance][:archival_object][:inherited_fields].concat(
  [
    {
      :property => 'subjects',
      :inherit_if => proc {|json|
        json.select {|j|
          ! j['_resolved']['terms'].select { |t| t['term_type'] == 'topical'}.empty? }
        },
      :inherit_directly => true
    },
    {
      :property => 'external_documents',
      :inherit_directly => false
    },
    {
      :property => 'rights_statements',
      :inherit_directly => false
    },
    {
      :property => 'instances',
      :inherit_directly => false
    },
  ])
```

If you want to modify any of the default rules, the safest approach is to uncomment
the entire default record_inheritance config and make your changes.
For example, to stop scopecontent notes from being inherited into file or item records
uncomment the entire record_inheritance default config above, and add a skip_if
clause to the scopecontent rule, like this:

```ruby
  {
    :property => 'notes',
    :skip_if => proc {|json| ['file', 'item'].include?(json['level']) },
    :inherit_if => proc {|json| json.select {|j| j['type'] == 'scopecontent'} },
    :inherit_directly => false
  },
```

### PUI Configurations

#### `AppConfig[:pui_search_results_page_size]`

`AppConfig[:pui_search_results_page_size] = 10`

#### `AppConfig[:pui_branding_img]`

`AppConfig[:pui_branding_img] = 'archivesspace.small.png'`

#### `AppConfig[:pui_block_referrer]`

`AppConfig[:pui_block_referrer] = true # patron privacy; blocks full 'referer' when going outside the domain`

#### `AppConfig[:pui_max_concurrent_pdfs]`

The number of PDFs we'll generate (in the background) at the same time.

PDF generation can be a little memory intensive for large collections, so we
set this fairly low out of the box.

`AppConfig[:pui_max_concurrent_pdfs] = 2`

#### `AppConfig[:pui_pdf_timeout]`

You can set this to nil or zero to prevent a timeout

`AppConfig[:pui_pdf_timeout] = 600`

#### `AppConfig[:pui_hide]`

`AppConfig[:pui_hide] = {}`

The following determine which 'tabs' are on the main horizontal menu:

```ruby
AppConfig[:pui_hide][:repositories] = false
AppConfig[:pui_hide][:resources] = false
AppConfig[:pui_hide][:digital_objects] = false
AppConfig[:pui_hide][:accessions] = false
AppConfig[:pui_hide][:subjects] = false
AppConfig[:pui_hide][:agents] = false
AppConfig[:pui_hide][:classifications] = false
AppConfig[:pui_hide][:search_tab] = false
```

The following determine globally whether the various "badges" appear on the Repository page
can be overriden at repository level below (e.g.:
`AppConfig[:repos][{repo_code}][:hide][:counts] = true`

```ruby
AppConfig[:pui_hide][:resource_badge] = false
AppConfig[:pui_hide][:record_badge] = true # hide by default
AppConfig[:pui_hide][:digital_object_badge] = false
AppConfig[:pui_hide][:accession_badge] = false
AppConfig[:pui_hide][:subject_badge] = false
AppConfig[:pui_hide][:agent_badge] = false
AppConfig[:pui_hide][:classification_badge] = false
AppConfig[:pui_hide][:counts] = false
```

The following determines globally whether the 'container inventory' navigation
tab/pill is hidden on resource/collection page

```
AppConfig[:pui_hide][:container_inventory] = false
```

#### `AppConfig[:pui_requests_permitted_for_types]`

Determine when the request button is displayed

`AppConfig[:pui_requests_permitted_for_types] = [:resource, :archival_object, :accession, :digital_object, :digital_object_component]`

#### `AppConfig[:pui_requests_permitted_for_containers_only]`

Set to 'true' if you want to disable if there is no top container

`AppConfig[:pui_requests_permitted_for_containers_only] = false`

#### `AppConfig[:pui_repos]`

Repository-specific examples. Replace {repo_code} with your repository code, i.e. 'foo' - note the lower-case

`AppConfig[:pui_repos] = {}`

Examples:

For a particular repository, only enable requests for certain record types (Note this configuration will override AppConfig[:pui_requests_permitted_for_types] for the repository)

```ruby
AppConfig[:pui_repos]['foo'][:requests_permitted_for_types] = [:resource, :archival_object, :accession, :digital_object, :digital_object_component]
```

For a particular repository, disable request

```ruby
AppConfig[:pui_repos]['foo'][:requests_permitted_for_containers_only] = true
```

Set the email address to send any repository requests:

```ruby
AppConfig[:pui_repos]['foo'][:request_email] = {email address}
```

> TODO - Needs more documentation here

```ruby
AppConfig[:pui_repos]['foo'][:hide] = {}
AppConfig[:pui_repos]['foo'][:hide][:counts] = true
```

#### `AppConfig[:pui_display_deaccessions]`

> TODO - Needs more documentation

`AppConfig[:pui_display_deaccessions] = true`

#### `AppConfig[:pui_page_actions_cite]`

Enable / disable PUI resource/archival object page 'cite' action

`AppConfig[:pui_page_actions_cite] = true`

#### `AppConfig[:pui_page_actions_bookmark]`

Enable / disable PUI resource/archival object page 'bookmark' action

`AppConfig[:pui_page_actions_bookmark] = true`

#### `AppConfig[:pui_page_actions_request]`

Enable / disable PUI resource/archival object page 'request' action

`AppConfig[:pui_page_actions_request] = true`

#### `AppConfig[:pui_page_actions_print]`

Enable / disable PUI resource/archival object page 'print' action

`AppConfig[:pui_page_actions_print] = true`

#### `AppConfig[:pui_enable_staff_link]`

When a user is authenticated, add a link back to the staff interface from the specified record

`AppConfig[:pui_enable_staff_link] = true`

#### `AppConfig[:pui_staff_link_mode]`

By default, staff link will open record in staff interface in edit mode,
change this to 'readonly' for it to open in readonly mode

`AppConfig[:pui_staff_link_mode] = 'edit'`

#### `AppConfig[:pui_page_custom_actions]`

Add page actions via the configuration

`AppConfig[:pui_page_custom_actions] = []`

Javascript action example:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'], # the jsonmodel type to show for
  'label' => 'actions.do_something', # the I18n path for the action button
  'icon' => 'fa-paw', # the font-awesome icon CSS class
  'onclick_javascript' => 'alert("do something grand");',
}
```

Hyperlink action example:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'], # the jsonmodel type to show for
  'label' => 'actions.do_something', # the I18n path for the action button
  'icon' => 'fa-paw', # the font-awesome icon CSS class
  'url_proc' => proc {|record| 'http://example.com/aspace?uri='+record.uri},
}
```

Form-POST action example:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'], # the jsonmodel type to show for
  'label' => 'actions.do_something', # the I18n path for the action button
  'icon' => 'fa-paw', # the font-awesome icon CSS class
  # 'post_params_proc' returns a hash of params which populates a form with hidden inputs ('name' => 'value')
  'post_params_proc' => proc {|record| {'uri' => record.uri, 'display_string' => record.display_string} },
  # 'url_proc' returns the URL for the form to POST to
  'url_proc' => proc {|record| 'http://example.com/aspace?uri='+record.uri},
  # 'form_id' as string to be used as the form's ID
  'form_id' => 'my_grand_action',
}
```

ERB action example:

```ruby
AppConfig[:pui_page_custom_actions] << {
  'record_type' => ['resource', 'archival_object'],
  # the jsonmodel type to show for
  # 'erb_partial' returns the path to an erb template from which the action will be rendered
  'erb_partial' => 'shared/my_special_action',
}
```

#### `AppConfig[:pui_email_enabled]`

PUI email settings (logs emails when disabled)

`AppConfig[:pui_email_enabled] = false`

#### `AppConfig[:pui_email_override]`

See above AppConfig[:pui_repos][{repo_code}][:request_email] for setting repository email overrides
'pui_email_override' for testing, this email will be the to-address for all sent emails

`AppConfig[:pui_email_override] = 'testing@example.com'`

#### `AppConfig[:pui_request_email_fallback_to_address]`

The 'to' email address for repositories that don't define their own email

`AppConfig[:pui_request_email_fallback_to_address] = 'testing@example.com'`

#### `AppConfig[:pui_request_email_fallback_from_address]`

The 'from' email address for repositories that don't define their own email

`AppConfig[:pui_request_email_fallback_from_address] = 'testing@example.com'`

#### `AppConfig[:pui_request_use_repo_email]`

Use the repository record email address for requests (overrides config email)

`AppConfig[:pui_request_use_repo_email] = false`

#### `AppConfig[:pui_email_delivery_method]`

`AppConfig[:pui_email_delivery_method] = :sendmail`

#### `AppConfig[:pui_email_sendmail_settings]`

```ruby
AppConfig[:pui_email_sendmail_settings] = {
  location: '/usr/sbin/sendmail',
  arguments: '-i'
}
```

#### `AppConfig[:pui_email_smtp_settings]`

Apply when `AppConfig[:pui_email_delivery_method]` set to `:smtp`

Example SMTP configuration:

```ruby
AppConfig[:pui_email_smtp_settings] = {
  address: 'smtp.gmail.com',
  port: 587,
  domain: 'gmail.com',
  user_name: '<username>',
  password: '<password>',
  authentication: 'plain',
  enable_starttls_auto: true,
}
```

#### `AppConfig[:pui_email_perform_deliveries]`

`AppConfig[:pui_email_perform_deliveries] = true`

#### `AppConfig[:pui_email_raise_delivery_errors]`

`AppConfig[:pui_email_raise_delivery_errors] = true`

#### `AppConfig[:pui_readmore_max_characters]`

The number of characters to truncate before showing the 'Read More' link on notes

`AppConfig[:pui_readmore_max_characters] = 450`

#### `AppConfig[:pui_expand_all]`

Whether to expand all additional information blocks at the bottom of record pages by default. `true` expands all blocks, `false` collapses all blocks.

`AppConfig[:pui_expand_all] = false`

#### `AppConfig[:max_search_columns]`

Use to specify the maximum number of columns to display when searching or browsing

`AppConfig[:max_search_columns] = 7`
