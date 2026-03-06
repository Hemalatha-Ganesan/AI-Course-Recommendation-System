import os

# Prompt for actual database credentials
mongo_uri = input("Enter your MongoDB URI (e.g., mongodb+srv://user:pass@cluster.mongodb.net/dbname): ").strip()
jwt_secret = input("Enter your JWT Secret: ").strip()
port = input("Enter PORT (default: 5000): ").strip() or "5000"
node_env = input("Enter NODE_ENV (default: development): ").strip() or "development"

if not mongo_uri:
    print("Error: MongoDB URI is required!")
    exit(1)

content = f"""PORT={port}
MONGO_URI={mongo_uri}
JWT_SECRET={jwt_secret}
NODE_ENV={node_env}"""

with open("d:/AI-Driven-CourseRecommendation System/server/.env", "w") as f:
    f.write(content)

print("✓ .env file created successfully!")
