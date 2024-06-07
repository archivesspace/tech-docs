# Upgrading Rack for ArchivesSpace

- Install local JRuby (match aspace version, currently: 9.2.12.0) and switch to it.
- Install Maven.
- Download jruby-rack.

```
git checkout 1.1-stable
# install bundler version to match 1.1-stable Gemfile.lock
gem install bundler --version=1.14.6
```

Should result in:

```
Fetching bundler-1.14.6.gem
Successfully installed bundler-1.14.6
Parsing documentation for bundler-1.14.6
Installing ri documentation for bundler-1.14.6
Done installing documentation for bundler after 5 seconds
1 gem installed
```

Set environment to target rack version (the version being upgraded to):

```
export RACK_VERSION=2.2.3
bundle
```

Should result in:

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

This will have bumped the Rack version in Gemfile.lock:

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

Build the jruby-rack jar:

```
bundle exec jruby -S rake clean gem SKIP_SPECS=true
```

This creates `target/jruby-rack-1.1.21.jar` with Rack 2.2.3.

Upload the jar to the public s3 bucket, specifying the rack version:

```bash
aws s3 cp target/jruby-rack-1.1.21.jar \
  s3://as-public-shared-files/jruby-rack-1.1.21_rack-2.2.3.jar \
  --profile archivesspace
```

Finally, update `rack_version` in the aspace `build.xml` file.
