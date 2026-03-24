#!/bin/bash
# Daily travel reminder cron script
# Add to VPS crontab: 0 8 * * * /path/to/cron-reminder.sh >> /var/log/myperfecttrips-cron.log 2>&1

curl -s -X GET \
  "https://myperfecttrips.com/api/cron/reminders" \
  -H "authorization: Bearer myperfecttrips-cron-reminders-secret-2026" \
  | echo "$(date): $(cat)"
