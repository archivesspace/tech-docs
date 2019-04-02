# Log Rotation

it is important to set up log rotation to prevent your log file from growing excessivly 

here is an example of the contents of a logrotate config file that would be located in 
`/etc/logrotate.d/`

````
  /<install location>/archivesspace/logs/archivesspace.out {
          daily
          rotate 7
          compress
          notifempty
          missingok
          copytruncate
   }
   ````
   this configuration will:
   * rotate the logs daily
   * keep 7 days worth of logs
   * compress the logs so they take up less space
   * ignore (not rotate) empty logs
   * not report errors if the log file is missing
   and most importantly for archivesspace
   * create a copy of the original log file for rotation before truncating the contents of the original file
   
