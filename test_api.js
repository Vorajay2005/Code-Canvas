// Test script to verify API endpoints
const testApiEndpoint = async () => {
    try {
        const response = await fetch('http://localhost:8000/generate-code', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                shapes: [
                    {
                        id: 'start1',
                        type: 'start',
                        text: 'Start',
                        x: 100,
                        y: 100
                    },
                    {
                        id: 'process1',
                        type: 'process',
                        text: 'Process data',
                        x: 100,
                        y: 200
                    },
                    {
                        id: 'end1',
                        type: 'end',
                        text: 'End',
                        x: 100,
                        y: 300
                    }
                ],
                connections: [
                    {
                        id: 'conn1',
                        fromId: 'start1',
                        toId: 'process1'
                    },
                    {
                        id: 'conn2',
                        fromId: 'process1',
                        toId: 'end1'
                    }
                ],
                language: 'javascript'
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('API Response:', data);
        console.log('Generated Code:');
        console.log(data.code);
        
        return data;
    } catch (error) {
        console.error('API Test Error:', error);
        throw error;
    }
};

// Run the test
testApiEndpoint()
    .then(data => {
        console.log('\n✅ API test successful!');
        console.log('Code generation is working properly.');
    })
    .catch(error => {
        console.log('\n❌ API test failed!');
        console.error('Error:', error.message);
    });