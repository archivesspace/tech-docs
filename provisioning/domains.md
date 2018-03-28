# Serving ArchivesSpace over subdomains

This document describes how to configure ArchivesSpace and your web server to serve the application over subdomains. The recommended
practice is to serve each user-facing ArchivesSpace application on its own subdomain, e.g.:

    http://staff.myarchive.org/
    http://public.myarchive.org/

Separate documentation is available if you wish to [serve ArchivesSpace under a prefix](prefix.md) (e.g., `http://aspace.myarchive.org/staff` and
`http://aspace.myarchive.org/public`).

1. [Configuring Your Firewall]()
2. [Configuring Your Web Server]()
   - [Apache]()
   - [Nginx]()
3. [Configuring ArchivesSpace]()



## Step 1: Configuring Your Firewall

Since using subdomains negates the need for users to access the application directly on ports 8080 and 8081, these should be locked down 

## Step 3: Configuring ArchivesSpace

The only configuration that needs to occur is adding your domain names to the following lines in config.rb:

     AppConfig[:frontend_proxy_url] = 'http://staff.myarchive.org'
     AppConfig[:public_proxy_url] = 'http://public.myarchive.org'

This configuration allows the staff edit links to appear on the public site to users logged in to the staff interface. 

Do **not** change `AppConfig[:public_url]` or `AppConfig[:frontend_url]`; these must retain their port numbers in order for the application to run.
