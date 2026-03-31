#!/usr/bin/env node

const https = require('https');

// Terminal Colors for a professional CLI UI
const colors = {
    reset: "\x1b[0m",
    cyan: "\x1b[36m",
    green: "\x1b[32m",
    yellow: "\x1b[33m",
    red: "\x1b[31m",
    dim: "\x1b[2m"
};

const username = process.argv[2];

if (!username) {
    console.log(`\n${colors.red}✖ Error: Missing username.${colors.reset}`);
    console.log(`${colors.yellow}Usage: github-activity <username>${colors.reset}\n`);
    process.exit(1);
}

const options = {
    hostname: 'api.github.com',
    path: `/users/${username}/events`,
    method: 'GET',
    headers: {
        'User-Agent': 'GitHub-Activity-CLI'
    }
};

// Optional: Use a token to fetch private repository activity
if (process.env.GITHUB_TOKEN) {
    options.headers['Authorization'] = `Bearer ${process.env.GITHUB_TOKEN}`;
}

const req = https.request(options, (res) => {
    let data = '';

    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        if (res.statusCode === 404) {
            console.log(`\n${colors.red}✖ User '${username}' not found.${colors.reset}\n`);
            process.exit(1);
        }

        if (res.statusCode === 403) {
            console.log(`\n${colors.red}✖ API Rate Limit Exceeded.${colors.reset} Try again later.\n`);
            process.exit(1);
        }

        try {
            const events = JSON.parse(data);

            if (events.length === 0) {
                console.log(`\n${colors.yellow}ℹ No recent public activity found for '${username}'.${colors.reset}\n`);
                return;
            }

            console.log(`\n${colors.cyan}🚀 Recent Activity for @${username}${colors.reset}\n`);

            events.slice(0, 15).forEach(event => {
                let action = '';
                const repoName = `${colors.green}${event.repo.name}${colors.reset}`;
                const date = `${colors.dim}[${new Date(event.created_at).toLocaleDateString()}]${colors.reset}`;
                
                switch (event.type) {
                    case 'PushEvent':
                        const commits = event.payload.commits ? event.payload.commits.length : 0;
                        if (commits === 0) {
                            action = `Pushed a branch update to ${repoName}`;
                        } else {
                            action = `Pushed ${commits} commit(s) to ${repoName}`;
                        }
                        break;
                    case 'IssuesEvent':
                        action = `${event.payload.action === 'opened' ? 'Opened' : 'Closed'} an issue in ${repoName}`;
                        break;
                    case 'WatchEvent':
                        action = `Starred ${repoName}`;
                        break;
                    case 'ForkEvent':
                        action = `Forked ${repoName}`;
                        break;
                    case 'CreateEvent':
                        action = `Created a ${event.payload.ref_type} in ${repoName}`;
                        break;
                    case 'PullRequestEvent':
                        action = `${event.payload.action === 'opened' ? 'Opened' : 'Closed'} a pull request in ${repoName}`;
                        break;
                    default:
                        action = `${event.type.replace('Event', '')} action in ${repoName}`;
                        break;
                }
                
                console.log(`  ${colors.yellow}→${colors.reset} ${action} ${date}`);
            });
            console.log('\n');

        } catch (err) {
            console.log(`\n${colors.red}✖ Failed to parse data.${colors.reset}\n`);
        }
    });
});

req.on('error', (error) => {
    console.log(`\n${colors.red}✖ Network Error: ${error.message}${colors.reset}\n`);
});

req.end();