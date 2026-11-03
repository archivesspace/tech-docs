---
title: Rack upgraden
description: Een handleiding voor het upgraden van Rack.
---

- Installeer JRuby lokaal (gebruik dezelfde versie als de aspace-versie, momenteel: 9.2.12.0) en schakel ernaar over.
- Installeer Maven.
- Download jruby-rack.

```shell
git checkout 1.1-stable
# install bundler version to match 1.1-stable Gemfile.lock
gem install bundler --version=1.14.6
```

Dit zou het volgende moeten opleveren:

```
Fetching bundler-1.14.6.gem
Successfully installed bundler-1.14.6
Parsing documentation for bundler-1.14.6
Installing ri documentation for bundler-1.14.6
Done installing documentation for bundler after 5 seconds
1 gem installed
```

Stel de omgeving in op de beoogde Rack-versie (de versie waarnaar u wilt upgraden):

```shell
export RACK_VERSION=2.2.3
bundle
```

Dit zou het volgende moeten opleveren:

```
Fetching gem metadata from https://rubygems.org/.............
Fetching version metadata from https://rubygems.org/..
Resolving dependencies...
Installing rake 10.4.2
Using bundler 1.14.6
Using diff-lcs 1.2.5
Installing jruby-openssl 0.9.21 (java)
Using rack 2.2.3 (was 1.6.8)
Using rspec-core 2.14.8
Using rspec-mocks 2.14.6
Using appraisal 0.5.2
Using rspec-expectations 2.14.5
Using rspec 2.14.1
Bundle complete! 5 Gemfile dependencies, 10 gems now installed.
Use `bundle show [gemname]` to see where a bundled gem is installed.
```

Hiermee is de Rack-versie in Gemfile.lock verhoogd:

```diff
diff --git a/Gemfile.lock b/Gemfile.lock
index 493c667..f016925 100644
--- a/Gemfile.lock
+++ b/Gemfile.lock
@@ -6,7 +6,7 @@ GEM
       rake
     diff-lcs (1.2.5)
     jruby-openssl (0.9.21-java)
-    rack (1.6.8)
+    rack (2.2.3)
     rake (10.4.2)
     rspec (2.14.1)
       rspec-core (~> 2.14.0)
@@ -23,7 +23,7 @@ PLATFORMS
 DEPENDENCIES
   appraisal
   jruby-openssl (~> 0.9.20)
-  rack (~> 1.6.8)
+  rack (= 2.2.3)
   rake (~> 10.4.2)
   rspec (~> 2.14.1)
```

Bouw het jruby-rack-jarbestand:

```bash
bundle exec jruby -S rake clean gem SKIP_SPECS=true
```

Hiermee wordt `target/jruby-rack-1.1.21.jar` gemaakt met Rack 2.2.3.

Upload het jarbestand naar de openbare S3-bucket en geef de Rack-versie op:

```bash
aws s3 cp target/jruby-rack-1.1.21.jar \
  s3://as-public-shared-files/jruby-rack-1.1.21_rack-2.2.3.jar \
  --profile archivesspace
```

Werk ten slotte `rack_version` bij in het aspace-bestand `build.xml`.
