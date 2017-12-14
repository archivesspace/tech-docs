# Serving ArchivesSpace user-facing applications over HTTPS

This document describes the approach for those wishing to install
ArchivesSpace in such a manner that all end-user requests (i.e., URLs)
are served over HTTPS rather than HTTP. For the purposes of this documentation, the URLs for the staff and public interfaces will be:

  * `https://staff.myarchive.org` - staff interface
  * `https://public.myarchive.org` - public interface

The configuration described in this document is one possible approach,
and to keep things simple the following are assumed:

  * ArchivesSpace is running on a single Linux server
  * The server is running Apache or Nginx
  * You have obtained an SSL certificate and key from an authority
  * You have ensured that appropriate firewall ports have been opened (80 and 443).

1. [Configuring the Web Server](#step-1-configure-web-server-apache-or-nginx)
   - [Apache](#apache)
     - [Setting up SSL](#setting-up-ssl)
     - [Setting up Redirects](#setting-up-redirects)
   - [Nginx](#nginx)
2. [Configuring ArchivesSpace](#step-2-configure-archivesspace)


## Step 1: Configure Web Server (Apache or Nginx)

### Apache
Information about configuring Apache for SSL can be found at http://httpd.apache.org/docs/current/ssl/ssl_howto.html.  You should read
that documentation before attempting to configure SSL.
     
#### Setting up SSL


Use the `NameVirtualHost` and `VirtualHost` directives to proxy
requests to the actual application urls. This requires the use of the `mod_proxy` module in Apache.

     NameVirtualHost *:443

     <VirtualHost *:443>
       ServerName staff.myarchive.org
       SSLEngine On
       SSLCertificateFile "/path/to/your/cert.crt"
       SSLCertificateKeyFile "/path/to/your/key.key"
       RequestHeader set X-Forwarded-Proto "https"
       ProxyPreserveHost On
       ProxyPass / http://localhost:8080/
       ProxyPassReverse / http://localhost:8080/
     </VirtualHost>
     
     <VirtualHost *:443>
       ServerName public.myarchive.org
       SSLEngine On
       SSLCertificateFile "/path/to/your/cert.crt"
       SSLCertificateKeyFile "/path/to/your/key.key"
       RequestHeader set X-Forwarded-Proto "https"
       ProxyPreserveHost On
       ProxyPass / http://localhost:8081/
       ProxyPassReverse / http://localhost:8081/
     </VirtualHost>



#### Setting up Redirects
When running a site over HTTPS, it's a good idea to set up a redirect to ensure any outdated HTTP requests are routed to the correct URL. This can be done through Apache as follows:

```
<VirtualHost *:80>
ServerName staff.myarchive.org
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule (.*) https://staff.myarchive.org$1 [R,L]
</VirtualHost>

<VirtualHost *:80>
ServerName public.myarchive.org
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule (.*) https://public.myarchive.org$1 [R,L]
</VirtualHost>
```

### Nginx


## Step 2: Configure ArchivesSpace

The following lines need to be altered in the config.rb file:
```
AppConfig[:frontend_proxy_url] = "https://staff.myarchive.org"
AppConfig[:public_proxy_url] = "https://public.myarchive.org"
```
These lines don't need to be altered and should remain with their default values. E.g.:
```
AppConfig[:frontend_url] = "http://localhost:8080"
AppConfig[:public_url] = "http://localhost:8081"
AppConfig[:frontend_proxy_prefix] = proc { "#{URI(AppConfig[:frontend_proxy_url]).path}/".gsub(%r{/+$}, "/") }
AppConfig[:public_proxy_prefix] = proc { "#{URI(AppConfig[:public_proxy_url]).path}/".gsub(%r{/+$}, "/") }
```
