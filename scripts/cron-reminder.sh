#!/bin/bash
# Daily travel reminder cron script
# Add to VPS crontab: 0 8 * * * /path/to/cron-reminder.sh >> /var/log/igholidays-cron.log 2>&1

curl -s -X GET \
  "https://igholidays.com/api/cron/reminders" \
  -H "authorization: Bearer igholidays-cron-reminders-secret-2026" \
  | echo "$(date): $(cat)"
