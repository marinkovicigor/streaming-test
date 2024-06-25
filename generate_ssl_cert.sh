#!/bin/bash

# Set variables
DAYS_VALID=365
KEY_SIZE=2048
COUNTRY="US"
STATE="California"
LOCALITY="San Francisco"
ORGANIZATION="My Organization"
ORGANIZATIONAL_UNIT="IT Department"
COMMON_NAME="localhost"

# Create private key
openssl genrsa -out key.pem $KEY_SIZE

# Create Certificate Signing Request (CSR)
openssl req -new -key key.pem -out csr.pem -subj "/C=$COUNTRY/ST=$STATE/L=$LOCALITY/O=$ORGANIZATION/OU=$ORGANIZATIONAL_UNIT/CN=$COMMON_NAME"

# Create self-signed certificate
openssl x509 -req -days $DAYS_VALID -in csr.pem -signkey key.pem -out cert.pem

# Remove CSR (no longer needed)
rm csr.pem

echo "Self-signed SSL certificate has been created."
echo "  - Private Key: key.pem"
echo "  - Certificate: cert.pem"