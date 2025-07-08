const http = require('http');

// Check if a server is running on a specific port
const checkServer = (port, name) => {
    return new Promise((resolve, reject) => {
        const req = http.request({
            hostname: 'localhost',
            port: port,
            path: '/',
            method: 'GET',
            timeout: 2000
        }, (res) => {
            console.log(`✅ ${name} server is running on port ${port}`);
            resolve(true);
        });

        req.on('error', (err) => {
            console.log(`❌ ${name} server is NOT running on port ${port}`);
            resolve(false);
        });

        req.on('timeout', () => {
            console.log(`⏱️ ${name} server timeout on port ${port}`);
            req.destroy();
            resolve(false);
        });

        req.end();
    });
};

// Main check function
const checkAllServers = async () => {
    console.log('Checking server status...\n');
    
    const frontendRunning = await checkServer(3000, 'Frontend (React)');
    const backendRunning = await checkServer(8000, 'Backend (PHP)');
    
    console.log('\n--- Server Status Summary ---');
    console.log(`Frontend: ${frontendRunning ? '✅ Running' : '❌ Not Running'}`);
    console.log(`Backend: ${backendRunning ? '✅ Running' : '❌ Not Running'}`);
    
    if (frontendRunning && backendRunning) {
        console.log('\n🎉 All servers are running! You can access:');
        console.log('- Frontend: http://localhost:3000');
        console.log('- Backend API: http://localhost:8000');
    } else {
        console.log('\n⚠️ Some servers are not running. Please start them:');
        if (!frontendRunning) {
            console.log('- Frontend: npm run dev');
        }
        if (!backendRunning) {
            console.log('- Backend: php -S localhost:8000 -t public/');
        }
    }
};

// Run the check
checkAllServers();