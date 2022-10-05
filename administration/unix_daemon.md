# Running ArchivesSpace as a Unix daemon

The `archivesspace.sh` startup script doubles as an init script.  If
you run:

     archivesspace.sh start

ArchivesSpace will run in the background as a daemon (logging to
`logs/archivesspace.out` by default, as before).  You can shut it down with:

     archivesspace.sh stop

You can even install it as a system-wide init script by creating a
symbolic link:

     cd /etc/init.d
     ln -s /path/to/your/archivesspace/archivesspace.sh archivesspace

Note: By default ArchivesSpace will overwrite the log file when restarted. You
can change that by modifying `archivesspace.sh` and changing the `$startup_cmd`
to include double greater than signs:

     $startup_cmd &>> \"$ARCHIVESSPACE_LOGS\" &


Then use the appropriate tool for your distribution to set up the
run-level symbolic links (such as `chkconfig` for RedHat or
`update-rc.d` for Debian-based distributions).

Note that you may want to edit archivesspace.sh to set the account
that the system runs under, JVM options, and so on.

For systems that use systemd you may wish to use a Systemd unit file for ArchivesSpace

Something similar to this should work:
```
[Unit]
Description=ArchivesSpace Application
After=syslog.target network.target
[Service]
Type=simple
ExecStart=/path/to/your/archivesspace/archivesspace.sh
ExecStop=/path/to/your/archivesspace/archivesspace.sh
PIDFile=/path/to/your/archivesspace/archivesspace.pid
User=archivesspacespace
Group=archivesspacespace
[Install]
WantedBy=multi-user.target
```
