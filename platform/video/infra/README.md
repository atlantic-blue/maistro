## Cloudfront Public Key

# Generate a private key
openssl genrsa -out private_key.pem 2048

# Derive the public key from the private key
openssl rsa -pubout -in private_key.pem -out public_key.pem

