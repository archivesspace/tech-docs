# Serving ArchivesSpace over subdomains

This document describes how to configure ArchivesSpace and your web server to serve the application over subdomains (e.g., `http://staff.myarchive.org/` and `http://public.myarchive.org/`), which is the  recommended
practice. Separate documentation is available if you wish to [serve ArchivesSpace under a prefix](prefix.md) (e.g., `http://aspace.myarchive.org/staff` and
`http://aspace.myarchive.org/public`).

1. [Configuring Your Firewall]()
2. [Configuring Your Web Server]()
   - [Apache]()
   - [Nginx]()
3. [Configuring ArchivesSpace]()



## Step 1: Configuring Your Firewall

Since using subdomains negates the need for users to access the application directly on ports 8080 and 8081, these should be locked down to access by localhost only. On a Linux server, this can be done using iptables:

     iptables -A INPUT -p tcp -s localhost --dport 8080 -j ACCEPT
     iptables -A INPUT -p tcp --dport 8080 -j DROP
     iptables -A INPUT -p tcp -s localhost --dport 8081 -j ACCEPT
     iptables -A INPUT -p tcp --dport 8081 -j DROP

## Step 3: Configuring ArchivesSpace

The only configuration that needs to occur is adding your domain names to the following lines in config.rb:

     AppConfig[:frontend_proxy_url] = 'http://staff.myarchive.org'
     AppConfig[:public_proxy_url] = 'http://public.myarchive.org'

This configuration allows the staff edit links to appear on the public site to users logged in to the staff interface. 

Do **not** change `AppConfig[:public_url]` or `AppConfig[:frontend_url]`; these must retain their port numbers in order for the application to run.
