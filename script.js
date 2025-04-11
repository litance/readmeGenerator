document.addEventListener('DOMContentLoaded', () => {
    // Initialize marked.js with options
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {}
            }
            return hljs.highlightAuto(code).value;
        },
        breaks: true,
        gfm: true
    });

    // Get DOM elements
    const form = document.getElementById('readmeForm');
    const preview = document.getElementById('preview');
    const rawPreview = document.getElementById('rawPreview');
    const copyBtn = document.getElementById('copyBtn');
    const downloadBtn = document.getElementById('downloadBtn');
    const resetBtn = document.getElementById('resetBtn');
    const previewBtn = document.getElementById('previewBtn');
    const toggleRawBtn = document.getElementById('toggleRaw');
    const printPreviewBtn = document.getElementById('printPreview');
    const themeToggleBtn = document.getElementById('themeToggle');
    const templateBtns = document.querySelectorAll('[data-template]');
    const formTabs = document.querySelectorAll('.tab-btn');
    const nextTabBtns = document.querySelectorAll('.next-tab');
    const prevTabBtns = document.querySelectorAll('.prev-tab');
    const badgeBtns = document.querySelectorAll('.badge-btn');
    const badgesPreview = document.getElementById('badgesPreview');
    const selectedBadgesInput = document.getElementById('selectedBadges');

    // Feature management
    const featuresContainer = document.getElementById('featuresContainer');
    const addFeatureBtn = document.getElementById('addFeature');
    
    // Screenshot management
    const screenshotsContainer = document.getElementById('screenshotsContainer');
    const addScreenshotBtn = document.getElementById('addScreenshot');

    // Keep track of selected badges
    let selectedBadges = [];

    // Function to handle tab switching
    function switchTab(tabId) {
        // Hide all tab contents
        document.querySelectorAll('.tab-content').forEach(tab => {
            tab.classList.remove('active');
            tab.classList.add('hidden');
        });
        
        // Show selected tab content
        const activeTab = document.getElementById(tabId);
        activeTab.classList.remove('hidden');
        activeTab.classList.add('active');
        
        // Update tab button styles
        formTabs.forEach(btn => {
            if (btn.getAttribute('data-tab') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });
    }

    // Function to add a new feature input
    function addFeatureInput(value = '') {
        const featureDiv = document.createElement('div');
        featureDiv.className = 'flex items-center';
        featureDiv.innerHTML = `
            <input type="text" value="${value}" class="feature-input">
            <button type="button" class="btn-sm remove-feature ml-2" style="color: var(--color-danger);">
                <i class="fas fa-times"></i>
            </button>
        `;
        featuresContainer.appendChild(featureDiv);
        
        // Add event listener to the remove button
        const removeBtn = featureDiv.querySelector('.remove-feature');
        removeBtn.addEventListener('click', () => {
            featureDiv.remove();
            generateReadme();
        });
        
        // Add event listener to the input for real-time updates
        const input = featureDiv.querySelector('.feature-input');
        input.addEventListener('input', generateReadme);
        
        return featureDiv;
    }
    
    // Function to add a new screenshot input
    function addScreenshotInput(value = '') {
        const screenshotDiv = document.createElement('div');
        screenshotDiv.className = 'flex items-center';
        screenshotDiv.innerHTML = `
            <input type="text" value="${value}" class="screenshot-input" placeholder="https://example.com/screenshot.png">
            <button type="button" class="btn-sm remove-screenshot ml-2" style="color: var(--color-danger);">
                <i class="fas fa-times"></i>
            </button>
        `;
        screenshotsContainer.appendChild(screenshotDiv);
        
        // Add event listener to the remove button
        const removeBtn = screenshotDiv.querySelector('.remove-screenshot');
        removeBtn.addEventListener('click', () => {
            screenshotDiv.remove();
            generateReadme();
        });
        
        // Add event listener to the input for real-time updates
        const input = screenshotDiv.querySelector('.screenshot-input');
        input.addEventListener('input', generateReadme);
        
        return screenshotDiv;
    }

    // Function to add a badge
    function addBadge(badgeType) {
        if (!selectedBadges.includes(badgeType)) {
            selectedBadges.push(badgeType);
            updateBadgesPreview();
            selectedBadgesInput.value = JSON.stringify(selectedBadges);
            generateReadme();
        }
    }

    // Function to remove a badge
    function removeBadge(badgeType) {
        const index = selectedBadges.indexOf(badgeType);
        if (index > -1) {
            selectedBadges.splice(index, 1);
            updateBadgesPreview();
            selectedBadgesInput.value = JSON.stringify(selectedBadges);
            generateReadme();
        }
    }

    // Update badges preview
    function updateBadgesPreview() {
        badgesPreview.innerHTML = '';
        
        selectedBadges.forEach(badge => {
            const badgeEl = document.createElement('span');
            badgeEl.className = 'badge';
            
            // Set badge style based on type
            switch(badge) {
                case 'npm':
                    badgeEl.classList.add('badge-blue');
                    break;
                case 'license':
                    badgeEl.classList.add('badge-green');
                    break;
                case 'stars':
                    badgeEl.classList.add('badge-yellow');
                    break;
                case 'issues':
                    badgeEl.classList.add('badge-purple');
                    break;
                case 'build':
                    badgeEl.classList.add('badge-red');
                    break;
                case 'coverage':
                    badgeEl.classList.add('badge-indigo');
                    break;
            }
            
            badgeEl.innerHTML = `
                ${badge}
                <button type="button" class="ml-1 text-xs remove-badge" data-badge="${badge}">
                    <i class="fas fa-times"></i>
                </button>
            `;
            badgesPreview.appendChild(badgeEl);
            
            // Add event listener to remove badge button
            badgeEl.querySelector('.remove-badge').addEventListener('click', () => {
                removeBadge(badge);
            });
        });
    }
    
    // Generate README.md content
    function generateReadme() {
        const projectName = document.getElementById('projectName').value || 'Project Name';
        const description = document.getElementById('description').value || 'Project description goes here.';
        const author = document.getElementById('author').value || '';
        const version = document.getElementById('version').value || '';
        const installation = document.getElementById('installation').value;
        const usage = document.getElementById('usage').value;
        const structure = document.getElementById('structure').value;
        const license = document.getElementById('license').value;
        const contributing = document.getElementById('contributing').value;
        const dependencies = document.getElementById('dependencies').value;
        const acknowledgements = document.getElementById('acknowledgements').value;
        const demoGif = document.getElementById('demoGif').value;
        const liveDemo = document.getElementById('liveDemo').value;
        const templateStyle = document.getElementById('template').value;
        
        // Get all features
        const featureInputs = document.querySelectorAll('.feature-input');
        let featuresContent = '';
        let featuresCount = 0;
        
        featureInputs.forEach(input => {
            if (input.value.trim() !== '') {
                featuresContent += `- ${input.value.trim()}\n`;
                featuresCount++;
            }
        });
        
        if (featuresCount === 0) {
            featuresContent = '- Feature one\n- Feature two\n- Feature three\n';
        }
        
        // Get all screenshots
        const screenshotInputs = document.querySelectorAll('.screenshot-input');
        let screenshotsContent = '';
        let screenshotsCount = 0;
        
        screenshotInputs.forEach((input, index) => {
            if (input.value.trim() !== '') {
                screenshotsContent += `### Screenshot ${index + 1}\n\n![Screenshot ${index + 1}](${input.value.trim()})\n\n`;
                screenshotsCount++;
            }
        });
        
        // Build README content based on template style
        let readmeContent = '';
        
        // Generate badges content
        let badgesContent = '';
        if (selectedBadges.length > 0) {
            selectedBadges.forEach(badge => {
                switch(badge) {
                    case 'npm':
                        badgesContent += `[![NPM Version](https://img.shields.io/npm/v/${projectName.toLowerCase().replace(/\s+/g, '-')})](https://npmjs.org/package/${projectName.toLowerCase().replace(/\s+/g, '-')}) `;
                        break;
                    case 'license':
                        badgesContent += `[![License](https://img.shields.io/badge/license-${license}-green.svg)](https://github.com/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')}/blob/master/LICENSE) `;
                        break;
                    case 'stars':
                        badgesContent += `[![Stars](https://img.shields.io/github/stars/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')})](https://github.com/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')}/stargazers) `;
                        break;
                    case 'issues':
                        badgesContent += `[![Issues](https://img.shields.io/github/issues/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')})](https://github.com/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')}/issues) `;
                        break;
                    case 'build':
                        badgesContent += `[![Build Status](https://img.shields.io/travis/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')})](https://travis-ci.org/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')}) `;
                        break;
                    case 'coverage':
                        badgesContent += `[![Coverage](https://img.shields.io/codecov/c/github/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')})](https://codecov.io/gh/litancehi/${projectName.toLowerCase().replace(/\s+/g, '-')}) `;
                        break;
                }
            });
            badgesContent = badgesContent.trim() + '\n\n';
        }
        
        // Standard template (default)
        readmeContent = `# ${projectName}\n\n`;
        
        if (badgesContent) {
            readmeContent += badgesContent;
        }
        
        readmeContent += `${description}\n\n`;
        
        // Add demo GIF if provided
        if (demoGif) {
            readmeContent += `![Demo](${demoGif})\n\n`;
        }
        
        // Add live demo link if provided
        if (liveDemo) {
            readmeContent += `## Demo\n\n[Live Demo](${liveDemo})\n\n`;
        }
        
        if (installation) {
            readmeContent += `## Installation\n\n\`\`\`bash\n${installation}\n\`\`\`\n\n`;
        }
        
        if (usage) {
            readmeContent += `## Usage\n\n\`\`\`javascript\n${usage}\n\`\`\`\n\n`;
        }
        
        readmeContent += `## Features\n\n${featuresContent}\n`;
        
        if (structure) {
            readmeContent += `## Project Structure\n\n\`\`\`\n${structure}\n\`\`\`\n\n`;
        }
        
        if (screenshotsCount > 0) {
            readmeContent += `## Screenshots\n\n${screenshotsContent}`;
        }
        
        if (dependencies) {
            readmeContent += `## Dependencies\n\n${dependencies}\n\n`;
        }
        
        if (license !== 'None') {
            readmeContent += `## License\n\nThis project is licensed under the ${license} License. See the [LICENSE](LICENSE) file for details.\n\n`;
        }
        
        if (contributing) {
            readmeContent += `## Contributing\n\n${contributing}\n\n`;
        }
        
        if (acknowledgements) {
            readmeContent += `## Acknowledgements\n\n${acknowledgements}\n\n`;
        }
        
        if (author) {
            readmeContent += `## Author\n\n${author}\n`;
            if (version) {
                readmeContent += `\nVersion: ${version}\n`;
            }
        }
        
        // Add timestamp
        readmeContent += `\n---\n\n*Last updated: 2025-04-11 15:34:18*\n`;
        
        // Update preview
        preview.innerHTML = marked.parse(readmeContent);
        rawPreview.textContent = readmeContent;
        
        // Highlight code blocks in preview
        document.querySelectorAll('pre code').forEach(block => {
            hljs.highlightBlock(block);
        });
        
        return readmeContent;
    }
    
    // Add first feature input
    addFeatureInput();
    
    // Add first screenshot input
    addScreenshotInput();
    
    // Add event listener to add feature button
    addFeatureBtn.addEventListener('click', () => {
        const newFeature = addFeatureInput();
        newFeature.querySelector('.feature-input').focus();
        generateReadme();
    });
    
    // Add event listener to add screenshot button
    addScreenshotBtn.addEventListener('click', () => {
        const newScreenshot = addScreenshotInput();
        newScreenshot.querySelector('.screenshot-input').focus();
        generateReadme();
    });
    
    // Tab switching
    formTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
        });
    });
    
    // Next tab buttons
    nextTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const nextTabId = btn.getAttribute('data-next');
            switchTab(nextTabId);
        });
    });
    
    // Previous tab buttons
    prevTabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prevTabId = btn.getAttribute('data-prev');
            switchTab(prevTabId);
        });
    });

    // Badge buttons
    badgeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const badgeType = btn.getAttribute('data-badge');
            addBadge(badgeType);
        });
    });
    
    // Add event listeners for all form inputs
    document.querySelectorAll('input, textarea, select').forEach(input => {
        input.addEventListener('input', generateReadme);
    });
    
    // Copy to clipboard functionality
    copyBtn.addEventListener('click', () => {
        const readmeContent = generateReadme();
        navigator.clipboard.writeText(readmeContent).then(() => {
            const originalHTML = copyBtn.innerHTML;
            copyBtn.innerHTML = '<i class="fas fa-check mr-2"></i> Copied!';
            copyBtn.classList.add('btn-success');
            copyBtn.classList.remove('btn-primary');
            setTimeout(() => {
                copyBtn.innerHTML = originalHTML;
                copyBtn.classList.remove('btn-success');
                copyBtn.classList.add('btn-primary');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Failed to copy text. Please try again.');
        });
    });
    
    // Download README.md functionality
    downloadBtn.addEventListener('click', () => {
        const readmeContent = generateReadme();
        const blob = new Blob([readmeContent], { type: 'text/markdown' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'README.md';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    });

    // Reset form functionality
    resetBtn.addEventListener('click', () => {
        if (confirm('Are you sure you want to reset the form? All your inputs will be lost.')) {
            form.reset();
            featuresContainer.innerHTML = '';
            addFeatureInput();
            screenshotsContainer.innerHTML = '';
            addScreenshotInput();
            selectedBadges = [];
            updateBadgesPreview();
            generateReadme();
        }
    });

    // Preview button (mobile)
    previewBtn.addEventListener('click', () => {
        const previewContainer = document.querySelector('.card:has(#preview)');
        const formContainer = document.querySelector('.card:has(#readmeForm)');
        
        if (previewContainer.style.display === 'none') {
            previewContainer.style.display = 'block';
            formContainer.style.display = 'none';
            previewBtn.innerHTML = '<i class="fas fa-edit mr-2"></i> Edit';
        } else {
            previewContainer.style.display = 'none';
            formContainer.style.display = 'block';
            previewBtn.innerHTML = '<i class="fas fa-eye mr-2"></i> Preview';
        }
    });

    // Toggle raw markdown view
    toggleRawBtn.addEventListener('click', () => {
        if (rawPreview.classList.contains('hidden')) {
            rawPreview.classList.remove('hidden');
            document.getElementById('previewContainer').classList.add('hidden');
            toggleRawBtn.innerHTML = '<i class="fas fa-eye mr-1"></i> View Rendered';
        } else {
            rawPreview.classList.add('hidden');
            document.getElementById('previewContainer').classList.remove('hidden');
            toggleRawBtn.innerHTML = '<i class="fas fa-code mr-1"></i> Toggle Raw';
        }
    });

    // Print preview functionality
    printPreviewBtn.addEventListener('click', () => {
        window.print();
    });

    // Theme toggle functionality
    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark');
        
        if (document.body.classList.contains('dark')) {
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
            localStorage.setItem('theme', 'dark');
        } else {
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
            localStorage.setItem('theme', 'light');
        }
    });

    // Set theme based on localStorage
    if (localStorage.getItem('theme') === 'dark' || 
        (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        document.body.classList.add('dark');
        themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
    }

    // Template selection
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const templateType = btn.getAttribute('data-template');
            loadTemplate(templateType);
        });
    });

    // Function to load templates
    function loadTemplate(templateType) {
        // Clear current form
        form.reset();
        featuresContainer.innerHTML = '';
        screenshotsContainer.innerHTML = '';
        selectedBadges = [];
        updateBadgesPreview();

        // Set template based on type
        switch(templateType) {
            case 'simple':
                document.getElementById('projectName').value = 'Simple Project';
                document.getElementById('description').value = 'A simple and lightweight utility that solves a common problem.';
                document.getElementById('installation').value = 'npm install simple-project';
                document.getElementById('usage').value = 'const simpleProject = require(\'simple-project\');\n\nsimpleProject.doSomething();';
                addFeatureInput('Simple and easy to use');
                addFeatureInput('Lightweight with no dependencies');
                addFeatureInput('Cross-platform compatibility');
                document.getElementById('license').value = 'MIT';
                addBadge('npm');
                addBadge('license');
                break;
                
            case 'fullstack':
                document.getElementById('projectName').value = 'Full Stack Application';
                document.getElementById('description').value = 'A comprehensive full-stack application with a React frontend and Node.js backend.';
                document.getElementById('installation').value = '# Clone the repository\ngit clone https://github.com/litancehi/fullstack-app.git\ncd fullstack-app\n\n# Install dependencies\nnpm install\n\n# Set up environment variables\ncp .env.example .env\n\n# Start development server\nnpm run dev';
                document.getElementById('usage').value = '# Start the frontend\nnpm run client\n\n# Start the backend\nnpm run server\n\n# Or start both concurrently\nnpm run dev';
                document.getElementById('structure').value = 'client/\n  src/\n    components/\n    pages/\n    App.js\n    index.js\nserver/\n  routes/\n  models/\n  controllers/\n  server.js\npackage.json\n.env';
                addFeatureInput('React frontend with modern UI components');
                addFeatureInput('Express.js RESTful API');
                addFeatureInput('MongoDB database integration');
                addFeatureInput('JWT authentication');
                addFeatureInput('Responsive design for all devices');
                document.getElementById('dependencies').value = '- react: ^18.2.0\n- react-dom: ^18.2.0\n- express: ^4.18.2\n- mongoose: ^7.0.0\n- jsonwebtoken: ^9.0.0\n- bcryptjs: ^2.4.3';
                document.getElementById('license').value = 'MIT';
                document.getElementById('contributing').value = 'Contributions are welcome! Please feel free to submit a Pull Request.';
                addScreenshotInput('https://example.com/screenshot1.png');
                addScreenshotInput('https://example.com/screenshot2.png');
                document.getElementById('liveDemo').value = 'https://fullstack-app-demo.herokuapp.com';
                addBadge('build');
                addBadge('issues');
                break;
                
            case 'library':
                document.getElementById('projectName').value = 'JavaScript Utility Library';
                document.getElementById('description').value = 'A modern JavaScript utility library delivering modularity, performance, and extras.';
                document.getElementById('installation').value = 'npm install js-utility-lib --save';
                document.getElementById('usage').value = '// ES Module\nimport { formatDate, sortArray } from \'js-utility-lib\';\n\n// CommonJS\nconst { formatDate, sortArray } = require(\'js-utility-lib\');\n\n// Usage\nconst date = formatDate(new Date(), \'YYYY-MM-DD\');\nconst sortedArray = sortArray([3, 1, 4, 2]);';
                document.getElementById('structure').value = 'src/\n  utils/\n  helpers/\n  index.js\ndist/\n  library.js\n  library.min.js\ntests/\ndocs/\npackage.json';
                addFeatureInput('Tree-shakable modules');
                addFeatureInput('TypeScript definitions included');
                addFeatureInput('Zero dependencies');
                addFeatureInput('Comprehensive API documentation');
                addFeatureInput('100% test coverage');
                document.getElementById('dependencies').value = 'Dev dependencies only:\n- typescript: ^5.0.0\n- jest: ^29.5.0\n- rollup: ^3.20.0\n- eslint: ^8.36.0';
                document.getElementById('license').value = 'MIT';
                document.getElementById('version').value = '1.2.0';
                document.getElementById('author').value = 'litancehi <litancehi@example.com>';
                document.getElementById('contributing').value = 'Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct, and the process for submitting pull requests to us.';
                document.getElementById('acknowledgements').value = '- Inspired by [lodash](https://lodash.com)\n- Special thanks to all contributors';
                addBadge('npm');
                addBadge('license');
                addBadge('coverage');
                break;
        }
        
        // Generate the README with the template data
        generateReadme();
    }

    // Function to create a table of contents
    function generateTOC(content) {
        const headings = content.match(/^#{2,3} .+$/gm);
        if (!headings || headings.length === 0) return '';
        
        let toc = '## Table of Contents\n\n';
        headings.forEach(heading => {
            const level = (heading.match(/^#{2,3}/)[0]).length;
            const text = heading.replace(/^#{2,3} /, '');
            const slug = text.toLowerCase().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-');
            const indent = level > 2 ? '  ' : '';
            toc += `${indent}- [${text}](#${slug})\n`;
        });
        
        return toc + '\n';
    }

    // Initialize the preview
    generateReadme();
});