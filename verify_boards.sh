#!/bin/bash
# Generate random email
EMAIL="test_$(date +%s)@example.com"

# Signup
echo "Signing up with $EMAIL..."
RESPONSE=$(curl -s -X POST http://localhost:8888/auth/signup \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Test User\",\"email\":\"$EMAIL\",\"password\":\"password123\"}")

echo "Response: $RESPONSE"

# Extract token
# Assuming response format: {"user":{...},"token":"..."}
TOKEN=$(echo $RESPONSE | sed -n 's/.*"token":"\([^"]*\)".*/\1/p')

if [ -z "$TOKEN" ]; then
  echo "Failed to get token"
  exit 1
fi

echo "Token: $TOKEN"

# Create Board
echo "Creating board..."
curl -s -X POST http://localhost:8888/boards \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"name":"My First Board"}'

# List Boards
echo -e "\nListing boards..."
curl -s -X GET http://localhost:8888/boards \
  -H "Authorization: Bearer $TOKEN"
