const { exec } = require('child_process');

const runSeedScript = (script) => {
    return new Promise((resolve, reject) => {
        exec(`node ${script}`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing ${script}:`, error);
                reject(error);
                return;
            }
            console.log(stdout);
            if (stderr) {
                console.error(stderr);
            }
            resolve();
        });
    });
};

const seedAll = async () => {
    try {
        console.log('Seeding problems...');
        await runSeedScript('server/seed.js');
        console.log('Seeding users...');
        await runSeedScript('server/seedUsers.js');
        console.log('Seeding submissions...');
        await runSeedScript('server/seedSubmissions.js');
        console.log('All seed scripts executed successfully.');
    } catch (error) {
        console.error('Seeding failed:', error);
    }
};

seedAll();
