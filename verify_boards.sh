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

# Extract board ID (Assuming response is array and taking the first one's id)
# Response: [{"id":"uuid",...}]
echo -e "\n\nGetting board ID..."
BOARDS=$(curl -s -X GET http://localhost:8888/boards -H "Authorization: Bearer $TOKEN")
BOARD_ID=$(echo $BOARDS | sed -n 's/.*"id":"\([^"]*\)".*/\1/p')

if [ -z "$BOARD_ID" ]; then
  echo "Failed to get board ID"
  exit 1
fi
echo "Board ID: $BOARD_ID"

# Delete Board
echo -e "\nDeleting board..."
DELETE_STATUS=$(curl -s -o /dev/null -w "%{http_code}" -X DELETE http://localhost:8888/boards/$BOARD_ID \
  -H "Authorization: Bearer $TOKEN")

echo "Delete Status: $DELETE_STATUS"

if [ "$DELETE_STATUS" != "204" ]; then
  echo "Failed to delete board"
  exit 1
fi

# List Boards again to verify
echo -e "\nListing boards after deletion (should be empty or not contain the deleted board)..."
curl -s -X GET http://localhost:8888/boards \
  -H "Authorization: Bearer $TOKEN"
