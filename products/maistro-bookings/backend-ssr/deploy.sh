# 1. deploy lambda
# terraform apply

# 2. Update satic JS in bucket
# cd dist
# aws s3 rm --recursive s3://maistro-bookings-www-production --profile atlantic-blue
# aws s3 cp --recursive . s3://maistro-bookings-www-production --profile atlantic-blue
