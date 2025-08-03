const fs = require('fs');
const path = require('path');

const envContent = `PORT=3000
MONGODB_URI=mongodb://localhost:27017/shadow_clash_db
JWT_SECRET=shadow_clash_jwt_secret_${Date.now()}`;

const envPath = path.join(__dirname, '.env');

try {
  if (!fs.existsSync(envPath)) {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully!');
    console.log('📝 Database: shadow_clash_db');
    console.log('🔑 JWT Secret: Generated automatically');
    console.log('🚀 Ready to start the server with: npm run dev');
  } else {
    console.log('⚠️  .env file already exists');
    console.log('📝 Current database: shadow_clash_db');
  }
} catch (error) {
  console.error('❌ Error creating .env file:', error.message);
}

console.log('\n📋 Setup Instructions:');
console.log('1. Make sure MongoDB is running on localhost:27017');
console.log('2. Run: npm install');
console.log('3. Run: npm run dev');
console.log('4. The database "shadow_clash_db" will be created automatically');