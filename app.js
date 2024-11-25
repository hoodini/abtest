class CampaignManager {
    constructor() {
        this.apiKey = '';
        this.initializeElements();
        this.attachEventListeners();
    }

    initializeElements() {
        this.apiKeyInput = document.getElementById('apiKey');
        this.saveApiKeyBtn = document.getElementById('saveApiKey');
        this.businessIdeaInput = document.getElementById('businessIdea');
        this.subjectInput = document.getElementById('subject');
        this.generateBtn = document.getElementById('generateCampaign');
        this.loadingIndicator = document.getElementById('loadingIndicator');
        this.resultsContainer = document.getElementById('results');
    }

    attachEventListeners() {
        this.saveApiKeyBtn.addEventListener('click', () => this.saveApiKey());
        this.generateBtn.addEventListener('click', () => this.generateCampaign());
    }

    saveApiKey() {
        this.apiKey = this.apiKeyInput.value;
        if (this.apiKey) {
            this.showNotification('API Key saved successfully!', 'success');
            this.apiKeyInput.value = '••••••••••••••••';
        }
    }

    showNotification(message, type) {
        const notification = document.createElement('div');
        notification.className = `fixed top-4 right-4 p-4 rounded-lg ${
            type === 'success' ? 'bg-green-500' : 'bg-red-500'
        } text-white magic-animate`;
        notification.textContent = message;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 3000);
    }

    async generateCampaign() {
        if (!this.apiKey) {
            this.showNotification('Please enter your Cohere API key first!', 'error');
            return;
        }

        const businessIdea = this.businessIdeaInput.value;
        const subject = this.subjectInput.value;

        if (!businessIdea || !subject) {
            this.showNotification('Please fill in all fields!', 'error');
            return;
        }

        this.loadingIndicator.classList.remove('hidden');
        this.resultsContainer.classList.add('hidden');

        try {
            const response = await fetch('https://api.cohere.ai/v1/generate', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'command',
                    prompt: `Create a comprehensive marketing campaign for a ${businessIdea} targeting ${subject}. Include social media strategy, SEO keywords, conversion funnel, and A/B testing recommendations.`,
                    max_tokens: 500,
                    temperature: 0.7,
                })
            });

            const data = await response.json();
            this.displayResults(data.generations[0].text);
        } catch (error) {
            this.showNotification('Error generating campaign: ' + error.message, 'error');
        } finally {
            this.loadingIndicator.classList.add('hidden');
        }
    }

    displayResults(campaignData) {
        this.resultsContainer.innerHTML = `
            <div class="backdrop-blur-md bg-white/20 p-6 rounded-lg shadow-lg magic-animate space-y-8">
                <div class="flex items-center justify-between">
                    <h3 class="text-2xl font-semibold text-gray-800">Campaign Strategy</h3>
                    <span class="px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm">AI Generated</span>
                </div>

                <!-- Marketing Strategy Table -->
                <div class="overflow-x-auto">
                    <table class="results-table">
                        <thead>
                            <tr>
                                <th class="text-left">Platform</th>
                                <th class="text-left">Strategy</th>
                                <th class="text-left">KPIs</th>
                                <th class="text-left">Budget Allocation</th>
                            </tr>
                        </thead>
                        <tbody>
                            ${this.generateMarketingTable()}
                        </tbody>
                    </table>
                </div>

                <!-- A/B Testing Variations -->
                <div class="bg-white/30 rounded-lg p-6">
                    <h4 class="text-xl font-semibold mb-4">A/B Testing Variations</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        ${this.generateABTests()}
                    </div>
                </div>

                <!-- SEO and Keywords -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div class="bg-white/30 rounded-lg p-6">
                        <h4 class="text-xl font-semibold mb-4">SEO Keywords</h4>
                        <div class="flex flex-wrap gap-2">
                            ${this.generateKeywordTags()}
                        </div>
                    </div>
                    <div class="bg-white/30 rounded-lg p-6">
                        <h4 class="text-xl font-semibold mb-4">Content Strategy</h4>
                        <div class="space-y-2">
                            ${this.generateContentStrategy()}
                        </div>
                    </div>
                </div>

                <!-- Conversion Funnel -->
                <div class="bg-white/30 rounded-lg p-6">
                    <h4 class="text-xl font-semibold mb-4">Conversion Funnel</h4>
                    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
                        ${this.generateConversionFunnel()}
                    </div>
                </div>

                <!-- Analytics Chart -->
                <div class="chart-container mt-6">
                    <canvas id="conversionChart"></canvas>
                </div>

                <!-- Ad Variations Table -->
                <div class="bg-white/30 rounded-lg p-6 magic-animate">
                    <div class="flex items-center justify-between mb-4">
                        <h4 class="text-xl font-semibold">Ad Variations & Copy</h4>
                        <span class="text-sm text-purple-600">Click any content to copy</span>
                    </div>
                    <div class="overflow-x-auto">
                        <table class="results-table">
                            <thead>
                                <tr>
                                    <th>Element</th>
                                    <th>Version A</th>
                                    <th>Version B</th>
                                    <th>Performance Metrics</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${this.generateAdVariations()}
                            </tbody>
                        </table>
                    </div>
                </div>

                <!-- Keywords and Targeting -->
                <div class="bg-white/30 rounded-lg p-6 mt-6">
                    <h4 class="text-xl font-semibold mb-4">Campaign Keywords & Targeting</h4>
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                        ${this.generateKeywordCategories()}
                    </div>
                </div>
            </div>
        `;

        this.resultsContainer.classList.remove('hidden');
        this.createConversionChart();
        this.initializeCopyFeature();
    }

    generateMarketingTable() {
        const platforms = [
            {
                platform: 'Instagram',
                strategy: 'Visual content & Stories',
                kpis: 'Engagement Rate: 4-6%',
                budget: '30%'
            },
            {
                platform: 'Facebook',
                strategy: 'Community Building & Ads',
                kpis: 'CTR: 2-3%',
                budget: '25%'
            },
            {
                platform: 'LinkedIn',
                strategy: 'B2B Networking',
                kpis: 'Lead Gen: 100/month',
                budget: '25%'
            },
            {
                platform: 'Google Ads',
                strategy: 'Search & Display',
                kpis: 'ROAS: 3.5x',
                budget: '20%'
            }
        ];

        return platforms.map(p => `
            <tr class="hover:bg-white/40 transition-colors">
                <td class="font-semibold">${p.platform}</td>
                <td>${p.strategy}</td>
                <td>${p.kpis}</td>
                <td>${p.budget}</td>
            </tr>
        `).join('');
    }

    generateABTests() {
        const tests = [
            {
                element: 'Call-to-Action',
                variantA: 'Get Started Now',
                variantB: 'Start Your Free Trial',
                metric: 'Click-through Rate'
            },
            {
                element: 'Hero Image',
                variantA: 'Product Screenshot',
                variantB: 'Lifestyle Image',
                metric: 'Time on Page'
            },
            {
                element: 'Pricing Display',
                variantA: 'Monthly Pricing',
                variantB: 'Annual (Discounted)',
                metric: 'Conversion Rate'
            },
            {
                element: 'Landing Page',
                variantA: 'Long-form Content',
                variantB: 'Video-first Layout',
                metric: 'Sign-up Rate'
            }
        ];

        return tests.map(test => `
            <div class="bg-white/20 p-4 rounded-lg backdrop-blur-sm">
                <h5 class="font-semibold text-purple-800 mb-2">${test.element}</h5>
                <div class="grid grid-cols-2 gap-4">
                    <div class="p-3 bg-white/30 rounded">
                        <span class="text-sm font-medium">Variant A:</span>
                        <p class="text-gray-700">${test.variantA}</p>
                    </div>
                    <div class="p-3 bg-white/30 rounded">
                        <span class="text-sm font-medium">Variant B:</span>
                        <p class="text-gray-700">${test.variantB}</p>
                    </div>
                </div>
                <div class="mt-2 text-sm text-gray-600">
                    <span class="font-medium">Testing Metric:</span> ${test.metric}
                </div>
            </div>
        `).join('');
    }

    generateConversionFunnel() {
        const stages = [
            { name: 'Awareness', color: 'blue', percentage: '100%' },
            { name: 'Interest', color: 'purple', percentage: '60%' },
            { name: 'Consideration', color: 'indigo', percentage: '40%' },
            { name: 'Conversion', color: 'green', percentage: '15%' }
        ];

        return stages.map(stage => `
            <div class="bg-white/20 p-4 rounded-lg text-center">
                <div class="text-${stage.color}-600 font-semibold">${stage.name}</div>
                <div class="text-2xl font-bold mt-2">${stage.percentage}</div>
                <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div class="bg-${stage.color}-600 h-2 rounded-full" style="width: ${stage.percentage}"></div>
                </div>
            </div>
        `).join('');
    }

    generateContentStrategy() {
        const strategies = [
            'Blog posts optimized for target keywords',
            'Weekly video content for social media',
            'Email nurture sequence (10 emails)',
            'Downloadable industry reports',
            'Customer success stories'
        ];

        return strategies.map(strategy => 
            `<div class="flex items-center gap-2">
                <i data-lucide="check-circle" class="w-5 h-5 text-green-600"></i>
                <span>${strategy}</span>
            </div>`
        ).join('');
    }

    generateKeywordTags() {
        const keywords = ['Digital Marketing', 'Social Media', 'Content Strategy', 'SEO', 'Growth'];
        return keywords.map(keyword => 
            `<span class="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">${keyword}</span>`
        ).join('');
    }

    createConversionChart() {
        const ctx = document.getElementById('conversionChart').getContext('2d');
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                datasets: [{
                    label: 'Projected Conversion Rate',
                    data: [2, 4, 6, 8],
                    borderColor: 'rgb(147, 51, 234)',
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'top',
                    }
                }
            }
        });
    }

    generateAdVariations() {
        const variations = [
            {
                element: 'Primary Headline',
                versionA: 'Transform Your Marketing with AI-Powered Insights',
                versionB: 'Get 10x Better Results with Smart Campaign Management',
                metrics: 'CTR: A=2.8% | B=3.2%',
                imagePromptA: 'Minimalist 3D visualization of a glowing brain made of digital connections transforming into marketing analytics graphs, clean corporate style, soft purple and blue gradient lighting, glass morphism effect',
                imagePromptB: '3D render of a modern dashboard showing multiple growing charts with a "10x" hologram floating above, futuristic UI, purple and blue accent colors, subtle lens flare'
            },
            {
                element: 'Ad Copy',
                versionA: 'Leverage advanced AI to create data-driven marketing campaigns that convert. Start your journey to better ROI today.',
                versionB: 'Stop guessing, start converting. Our AI-powered platform delivers proven marketing strategies tailored to your business.',
                metrics: 'Conv. Rate: A=4.5% | B=5.1%',
                imagePromptA: 'Professional marketer looking at floating holographic marketing analytics, modern office setting, soft ambient lighting, depth of field, cinematic composition',
                imagePromptB: 'Abstract 3D visualization of AI analyzing marketing data, showing clear before/after comparison, corporate art style, teal and purple color scheme'
            },
            {
                element: 'Call-to-Action',
                versionA: 'Start Free Trial • No Credit Card Required',
                versionB: 'Get Your AI Marketing Plan • 14-Day Free Access',
                metrics: 'Click Rate: A=12% | B=15%',
                imagePromptA: 'Clean and minimal 3D render of a "Start" button with a subtle glow effect, floating above a glass surface, purple accent lighting',
                imagePromptB: 'Isometric illustration of a marketing plan document with AI elements, floating geometric shapes, blueprint style with purple highlights'
            },
            {
                element: 'Value Proposition',
                versionA: '• AI-Powered Insights\n• Real-time Analytics\n• 24/7 Campaign Optimization',
                versionB: '• Boost ROI by 300%\n• Save 20 Hours/Week\n• Full Marketing Automation',
                metrics: 'Engagement: A=2.1m | B=2.8m',
                imagePromptA: 'Futuristic command center with multiple floating screens showing real-time analytics, dark modern interior, purple and blue accent lighting',
                imagePromptB: 'Dynamic 3D composition showing a rocket with "300% ROI" text, surrounded by automated marketing symbols, corporate art style'
            }
        ];

        return variations.map(v => `
            <tr>
                <td class="font-semibold">${v.element}</td>
                <td>
                    <div class="copyable-content group relative p-3 bg-white/20 rounded cursor-pointer hover:bg-white/30">
                        <pre class="whitespace-pre-wrap text-sm">${v.versionA}</pre>
                        <div class="mt-3 pt-3 border-t border-white/20">
                            <p class="text-xs font-medium text-purple-800 mb-2">Image Generation Prompt:</p>
                            <pre class="whitespace-pre-wrap text-xs text-gray-600 italic">${v.imagePromptA}</pre>
                        </div>
                        <span class="copy-badge opacity-0 group-hover:opacity-100 absolute top-2 right-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Click to Copy
                        </span>
                    </div>
                </td>
                <td>
                    <div class="copyable-content group relative p-3 bg-white/20 rounded cursor-pointer hover:bg-white/30">
                        <pre class="whitespace-pre-wrap text-sm">${v.versionB}</pre>
                        <div class="mt-3 pt-3 border-t border-white/20">
                            <p class="text-xs font-medium text-purple-800 mb-2">Image Generation Prompt:</p>
                            <pre class="whitespace-pre-wrap text-xs text-gray-600 italic">${v.imagePromptB}</pre>
                        </div>
                        <span class="copy-badge opacity-0 group-hover:opacity-100 absolute top-2 right-2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                            Click to Copy
                        </span>
                    </div>
                </td>
                <td class="text-sm">
                    <div class="p-2 bg-white/20 rounded">
                        ${v.metrics}
                    </div>
                </td>
            </tr>
        `).join('');
    }

    generateKeywordCategories() {
        const categories = [
            {
                title: 'Primary Keywords',
                keywords: [
                    'AI Marketing Platform',
                    'Smart Campaign Manager',
                    'Marketing Automation Tool',
                    'AI Campaign Optimization'
                ]
            },
            {
                title: 'Secondary Keywords',
                keywords: [
                    'Marketing ROI Analytics',
                    'Campaign Performance Tools',
                    'Digital Marketing AI',
                    'Automated Marketing Strategy'
                ]
            },
            {
                title: 'Long-tail Keywords',
                keywords: [
                    'best ai marketing platform for small business',
                    'how to optimize marketing campaigns with ai',
                    'automated social media campaign tools',
                    'marketing automation roi calculator'
                ]
            }
        ];

        return categories.map(category => `
            <div class="bg-white/20 p-4 rounded-lg">
                <h5 class="font-semibold text-purple-800 mb-3">${category.title}</h5>
                <div class="space-y-2">
                    ${category.keywords.map(keyword => `
                        <div class="copyable-content group relative p-2 bg-white/30 rounded text-sm cursor-pointer hover:bg-white/40">
                            ${keyword}
                            <span class="copy-badge opacity-0 group-hover:opacity-100 absolute right-2 top-1/2 transform -translate-y-1/2 text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                                Copy
                            </span>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    initializeCopyFeature() {
        document.querySelectorAll('.copyable-content').forEach(element => {
            element.addEventListener('click', async () => {
                const textContent = element.querySelector('pre')?.textContent || element.textContent.trim();
                try {
                    await navigator.clipboard.writeText(textContent);
                    const badge = element.querySelector('.copy-badge');
                    badge.textContent = 'Copied!';
                    badge.classList.add('bg-green-100', 'text-green-800');
                    setTimeout(() => {
                        badge.textContent = 'Click to Copy';
                        badge.classList.remove('bg-green-100', 'text-green-800');
                    }, 2000);
                } catch (err) {
                    console.error('Failed to copy text: ', err);
                }
            });
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    new CampaignManager();
    // Initialize Lucide icons
    lucide.createIcons();
}); 