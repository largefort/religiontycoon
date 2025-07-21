class ReligionTycoon {
    constructor() {
        this.gameState = {
            religionName: '',
            godName: '',
            divineEnergy: 0,
            followers: 0,
            temples: 0,
            miraclePower: 1,
            upgrades: {
                blessing: false,
                prophet: false,
                sanctuary: false,
                omnipresence: false,
                scriptures: false,
                flame: false
            },
            autoGenerators: {
                prophet: false,
                sanctuary: false,
                scriptures: false,
                flame: false
            }
        };
        
        this.costs = {
            follower: 10,
            temple: 50,
            blessing: 25,
            prophet: 100,
            sanctuary: 250,
            divineVision: 75,
            holyCrusade: 150,
            celestialStorm: 300,
            omnipresence: 500,
            scriptures: 750,
            flame: 1000
        };

        this.messages = [
            { type: 'divine', text: 'Your divine presence grows stronger...' },
            { type: 'divine', text: 'The cosmos trembles at your power!' },
            { type: 'divine', text: 'Divine energy surges through the realms!' },
            { type: 'follower', text: 'A new soul has found faith in your light!' },
            { type: 'follower', text: 'Your teachings spread among the people!' },
            { type: 'follower', text: 'Pilgrims journey from distant lands to serve you!' },
            { type: 'temple', text: 'A magnificent temple rises in your honor!' },
            { type: 'temple', text: 'Sacred architecture manifests your glory!' },
            { type: 'temple', text: 'A holy sanctuary becomes a beacon of faith!' },
            { type: 'divine', text: 'Your divine vision pierces through all realms!' },
            { type: 'follower', text: 'Holy warriors march in your sacred name!' },
            { type: 'divine', text: 'Celestial storms reshape the very heavens!' },
            { type: 'divine', text: 'Your omnipresent power flows through all creation!' },
            { type: 'divine', text: 'Sacred words spread your divine truth!' },
            { type: 'divine', text: 'The eternal flame of your power burns brighter!' }
        ];
        
        // Audio elements
        this.sounds = {
            miracle: new Audio('miracle-sound.mp3'),
            follower: new Audio('follower-sound.mp3'),
            temple: new Audio('temple-sound.mp3'),
            upgrade: new Audio('upgrade-sound.mp3'),
            ambient: new Audio('ambient-divine.mp3')
        };
        
        // Configure ambient music
        this.sounds.ambient.loop = true;
        this.sounds.ambient.volume = 0.3;
        
        this.init();
    }
    
    init() {
        this.loadGame();
        this.bindEvents();
        this.startGameLoop();
        
        // Show creation modal only if no saved game exists
        if (!this.gameState.religionName || !this.gameState.godName) {
            this.showCreationModal();
        } else {
            // If we have a saved game, show the game interface directly
            document.getElementById('religion-title').textContent = this.gameState.religionName;
            document.getElementById('god-title').textContent = this.gameState.godName;
            document.getElementById('creation-modal').style.display = 'none';
            document.getElementById('game-interface').classList.remove('hidden');
            this.sounds.ambient.play().catch(e => console.log('Audio autoplay prevented'));
            this.updateUI();
        }
    }
    
    saveGame() {
        try {
            localStorage.setItem('religionTycoonSave', JSON.stringify(this.gameState));
        } catch (error) {
            console.log('Failed to save game:', error);
        }
    }
    
    loadGame() {
        try {
            const savedGame = localStorage.getItem('religionTycoonSave');
            if (savedGame) {
                const loadedState = JSON.parse(savedGame);
                // Merge saved state with default state to handle new properties
                this.gameState = { ...this.gameState, ...loadedState };
                
                // Ensure all nested objects are properly merged
                if (loadedState.upgrades) {
                    this.gameState.upgrades = { ...this.gameState.upgrades, ...loadedState.upgrades };
                }
                if (loadedState.autoGenerators) {
                    this.gameState.autoGenerators = { ...this.gameState.autoGenerators, ...loadedState.autoGenerators };
                }
                
                console.log('Game loaded successfully');
            }
        } catch (error) {
            console.log('Failed to load game:', error);
        }
    }
    
    resetGame() {
        if (confirm('Are you sure you want to reset your divine empire? This cannot be undone!')) {
            localStorage.removeItem('religionTycoonSave');
            location.reload();
        }
    }
    
    bindEvents() {
        // Creation modal
        const createReligionBtn = document.getElementById('create-religion');
        if (createReligionBtn) {
            createReligionBtn.addEventListener('click', () => this.createReligion());
        }
        
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebar-toggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => this.toggleSidebar());
        }
        
        // Action buttons
        const createMiracleBtn = document.getElementById('create-miracle');
        if (createMiracleBtn) {
            createMiracleBtn.addEventListener('click', () => this.performMiracle());
        }
        
        const inspireFollowerBtn = document.getElementById('inspire-follower');
        if (inspireFollowerBtn) {
            inspireFollowerBtn.addEventListener('click', () => this.inspireFollower());
        }
        
        const buildTempleBtn = document.getElementById('build-temple');
        if (buildTempleBtn) {
            buildTempleBtn.addEventListener('click', () => this.buildTemple());
        }
        
        const divineVisionBtn = document.getElementById('divine-vision');
        if (divineVisionBtn) {
            divineVisionBtn.addEventListener('click', () => this.divineVision());
        }
        
        const holyCrusadeBtn = document.getElementById('holy-crusade');
        if (holyCrusadeBtn) {
            holyCrusadeBtn.addEventListener('click', () => this.holyCrusade());
        }
        
        const celestialStormBtn = document.getElementById('celestial-storm');
        if (celestialStormBtn) {
            celestialStormBtn.addEventListener('click', () => this.celestialStorm());
        }
        
        // Energy orb clicking
        const energyOrb = document.getElementById('energy-orb');
        if (energyOrb) {
            energyOrb.addEventListener('click', () => this.performMiracle());
        }
        
        // Upgrades
        const blessingUpgrade = document.querySelector('#upgrade-blessing .upgrade-btn');
        if (blessingUpgrade) {
            blessingUpgrade.addEventListener('click', () => this.purchaseUpgrade('blessing'));
        }
        
        const prophetUpgrade = document.querySelector('#upgrade-prophet .upgrade-btn');
        if (prophetUpgrade) {
            prophetUpgrade.addEventListener('click', () => this.purchaseUpgrade('prophet'));
        }
        
        const sanctuaryUpgrade = document.querySelector('#upgrade-sanctuary .upgrade-btn');
        if (sanctuaryUpgrade) {
            sanctuaryUpgrade.addEventListener('click', () => this.purchaseUpgrade('sanctuary'));
        }
        
        const omnipresenceUpgrade = document.querySelector('#upgrade-omnipresence .upgrade-btn');
        if (omnipresenceUpgrade) {
            omnipresenceUpgrade.addEventListener('click', () => this.purchaseUpgrade('omnipresence'));
        }
        
        const scripturesUpgrade = document.querySelector('#upgrade-scriptures .upgrade-btn');
        if (scripturesUpgrade) {
            scripturesUpgrade.addEventListener('click', () => this.purchaseUpgrade('scriptures'));
        }
        
        const flameUpgrade = document.querySelector('#upgrade-flame .upgrade-btn');
        if (flameUpgrade) {
            flameUpgrade.addEventListener('click', () => this.purchaseUpgrade('flame'));
        }
        
        // Enter key for creation
        document.addEventListener('keypress', (e) => {
            const creationModal = document.getElementById('creation-modal');
            if (e.key === 'Enter' && creationModal && !creationModal.classList.contains('hidden')) {
                this.createReligion();
            }
        });
    }
    
    toggleSidebar() {
        const sidebar = document.getElementById('game-sidebar');
        const toggle = document.getElementById('sidebar-toggle');
        
        sidebar.classList.toggle('collapsed');
        toggle.classList.toggle('active');
    }
    
    showCreationModal() {
        document.getElementById('creation-modal').style.display = 'flex';
    }
    
    createReligion() {
        const religionName = document.getElementById('religion-name').value.trim();
        const godName = document.getElementById('god-name').value.trim();
        
        if (!religionName || !godName) {
            this.showMessage('divine', 'Even gods need names to begin their reign...');
            return;
        }
        
        this.gameState.religionName = religionName;
        this.gameState.godName = godName;
        
        // Save the game after creating religion
        this.saveGame();
        
        // Update UI
        document.getElementById('religion-title').textContent = religionName;
        document.getElementById('god-title').textContent = godName;
        
        // Hide modal and show game
        document.getElementById('creation-modal').style.display = 'none';
        document.getElementById('game-interface').classList.remove('hidden');
        
        // Start ambient music
        this.sounds.ambient.play().catch(e => console.log('Audio autoplay prevented'));
        
        this.showMessage('divine', `Behold! ${godName} has awakened to rule over ${religionName}!`);
        this.updateUI();
    }
    
    performMiracle() {
        let energyGain = this.gameState.miraclePower;
        
        // Omnipresence bonus
        if (this.gameState.upgrades.omnipresence) {
            energyGain = Math.floor(energyGain * 1.5);
        }
        
        // Eternal flame effect
        if (this.gameState.upgrades.flame) {
            this.gameState.followers += 1;
        }
        
        this.gameState.divineEnergy += energyGain;
        
        // Save game after state change
        this.saveGame();
        
        // Enhanced click effect with particles
        const orb = document.getElementById('energy-orb');
        orb.classList.add('click-effect');
        this.createEnergyParticles(orb);
        
        setTimeout(() => orb.classList.remove('click-effect'), 600);
        
        // Play miracle sound
        this.playSound('miracle');
        
        const miracleMessages = this.messages.filter(m => m.type === 'divine');
        this.showMessage('divine', miracleMessages[Math.floor(Math.random() * miracleMessages.length)].text);
        
        this.updateUI();
    }
    
    createEnergyParticles(orbElement) {
        const particleCount = 8;
        const orbRect = orbElement.getBoundingClientRect();
        const orbCenter = {
            x: orbRect.left + orbRect.width / 2,
            y: orbRect.top + orbRect.height / 2
        };
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'energy-particle';
            
            const angle = (i / particleCount) * 2 * Math.PI;
            const distance = 100 + Math.random() * 50;
            const size = 4 + Math.random() * 6;
            
            particle.style.cssText = `
                position: fixed;
                width: ${size}px;
                height: ${size}px;
                background: radial-gradient(circle, #00d4ff, #ffd700);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${orbCenter.x}px;
                top: ${orbCenter.y}px;
                box-shadow: 0 0 10px rgba(0, 212, 255, 0.8);
            `;
            
            document.body.appendChild(particle);
            
            // Animate particle
            const endX = orbCenter.x + Math.cos(angle) * distance;
            const endY = orbCenter.y + Math.sin(angle) * distance;
            
            particle.animate([
                {
                    transform: 'translate(-50%, -50%) scale(0)',
                    opacity: 1
                },
                {
                    transform: `translate(${endX - orbCenter.x}px, ${endY - orbCenter.y}px) scale(1)`,
                    opacity: 1,
                    offset: 0.7
                },
                {
                    transform: `translate(${endX - orbCenter.x}px, ${endY - orbCenter.y}px) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            }).onfinish = () => {
                document.body.removeChild(particle);
            };
        }
    }
    
    inspireFollower() {
        if (this.gameState.divineEnergy >= this.costs.follower) {
            this.gameState.divineEnergy -= this.costs.follower;
            this.gameState.followers += 1;
            this.costs.follower = Math.floor(this.costs.follower * 1.2);
            
            // Save game after state change
            this.saveGame();
            
            // Play follower sound
            this.playSound('follower');
            
            const followerMessages = this.messages.filter(m => m.type === 'follower');
            this.showMessage('follower', followerMessages[Math.floor(Math.random() * followerMessages.length)].text);
            
            this.updateUI();
        }
    }
    
    buildTemple() {
        if (this.gameState.divineEnergy >= this.costs.temple) {
            this.gameState.divineEnergy -= this.costs.temple;
            this.gameState.temples += 1;
            this.costs.temple = Math.floor(this.costs.temple * 1.5);
            
            // Save game after state change
            this.saveGame();
            
            // Play temple sound
            this.playSound('temple');
            
            const templeMessages = this.messages.filter(m => m.type === 'temple');
            this.showMessage('temple', templeMessages[Math.floor(Math.random() * templeMessages.length)].text);
            
            this.updateUI();
        }
    }
    
    divineVision() {
        if (this.gameState.divineEnergy >= this.costs.divineVision) {
            this.gameState.divineEnergy -= this.costs.divineVision;
            
            // Reveals hidden potential - increases miracle power temporarily and grants bonus energy
            const bonus = Math.floor(this.gameState.followers * 0.5) + 5;
            this.gameState.divineEnergy += bonus;
            this.costs.divineVision = Math.floor(this.costs.divineVision * 1.3);
            
            // Save game after state change
            this.saveGame();
            
            this.playSound('miracle');
            this.showMessage('divine', `Your divine vision reveals hidden truths! Gained ${bonus} bonus energy!`);
            this.updateUI();
        }
    }
    
    holyCrusade() {
        if (this.gameState.divineEnergy >= this.costs.holyCrusade) {
            this.gameState.divineEnergy -= this.costs.holyCrusade;
            
            // Mass conversion - gains many followers at once
            const newFollowers = Math.floor(this.gameState.temples * 2) + 10;
            this.gameState.followers += newFollowers;
            this.costs.holyCrusade = Math.floor(this.costs.holyCrusade * 1.4);
            
            // Save game after state change
            this.saveGame();
            
            this.playSound('follower');
            this.showMessage('follower', `Your holy crusade converts ${newFollowers} souls to your cause!`);
            this.updateUI();
        }
    }
    
    celestialStorm() {
        if (this.gameState.divineEnergy >= this.costs.celestialStorm) {
            this.gameState.divineEnergy -= this.costs.celestialStorm;
            
            // Massive divine event - affects all resources
            const energyBonus = this.gameState.miraclePower * 50;
            const followerBonus = Math.floor(this.gameState.followers * 0.1) + 5;
            const templeBonus = Math.floor(this.gameState.temples * 0.2) + 1;
            
            this.gameState.divineEnergy += energyBonus;
            this.gameState.followers += followerBonus;
            this.gameState.temples += templeBonus;
            this.costs.celestialStorm = Math.floor(this.costs.celestialStorm * 1.5);
            
            // Save game after state change
            this.saveGame();
            
            this.playSound('temple');
            this.showMessage('divine', `Your celestial storm reshapes reality! Massive growth across all domains!`);
            this.updateUI();
        }
    }
    
    purchaseUpgrade(upgradeType) {
        const cost = this.costs[upgradeType];
        if (this.gameState.divineEnergy >= cost && !this.gameState.upgrades[upgradeType]) {
            this.gameState.divineEnergy -= cost;
            this.gameState.upgrades[upgradeType] = true;
            
            // Save game after state change
            this.saveGame();
            
            switch (upgradeType) {
                case 'blessing':
                    this.gameState.miraclePower = 2;
                    this.showMessage('divine', 'Your miracles now radiate with twice the power!');
                    break;
                case 'prophet':
                    this.gameState.autoGenerators.prophet = true;
                    this.showMessage('follower', 'Your prophet spreads your word across the lands!');
                    break;
                case 'sanctuary':
                    this.gameState.autoGenerators.sanctuary = true;
                    this.showMessage('temple', 'Your temples now generate divine energy automatically!');
                    break;
                case 'omnipresence':
                    this.gameState.autoGenerators.omnipresence = true;
                    this.showMessage('divine', 'Your omnipresent power multiplies all divine actions!');
                    break;
                case 'scriptures':
                    this.gameState.autoGenerators.scriptures = true;
                    this.showMessage('divine', 'Sacred scriptures allow followers to channel divine energy!');
                    break;
                case 'flame':
                    this.gameState.autoGenerators.flame = true;
                    this.showMessage('divine', 'The eternal flame spreads your influence with every miracle!');
                    break;
            }
            
            this.updateUI();
        }
    }
    
    playSound(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].currentTime = 0;
            this.sounds[soundName].play().catch(e => console.log('Audio play failed'));
        }
    }
    
    updateUI() {
        // Update stats
        document.getElementById('divine-energy').textContent = this.formatNumber(this.gameState.divineEnergy);
        document.getElementById('followers').textContent = this.formatNumber(this.gameState.followers);
        document.getElementById('temples').textContent = this.formatNumber(this.gameState.temples);
        document.getElementById('orb-energy').textContent = this.formatNumber(this.gameState.divineEnergy);
        
        // Update button states
        this.updateButton('inspire-follower', this.gameState.divineEnergy >= this.costs.follower, `Cost: ${this.costs.follower} Energy`);
        this.updateButton('build-temple', this.gameState.divineEnergy >= this.costs.temple, `Cost: ${this.costs.temple} Energy`);
        this.updateButton('divine-vision', this.gameState.divineEnergy >= this.costs.divineVision, `Cost: ${this.costs.divineVision} Energy`);
        this.updateButton('holy-crusade', this.gameState.divineEnergy >= this.costs.holyCrusade, `Cost: ${this.costs.holyCrusade} Energy`);
        this.updateButton('celestial-storm', this.gameState.divineEnergy >= this.costs.celestialStorm, `Cost: ${this.costs.celestialStorm} Energy`);
        
        // Update upgrades
        this.updateUpgrade('blessing', this.costs.blessing, this.gameState.upgrades.blessing);
        this.updateUpgrade('prophet', this.costs.prophet, this.gameState.upgrades.prophet);
        this.updateUpgrade('sanctuary', this.costs.sanctuary, this.gameState.upgrades.sanctuary);
        this.updateUpgrade('omnipresence', this.costs.omnipresence, this.gameState.upgrades.omnipresence);
        this.updateUpgrade('scriptures', this.costs.scriptures, this.gameState.upgrades.scriptures);
        this.updateUpgrade('flame', this.costs.flame, this.gameState.upgrades.flame);
    }
    
    updateButton(buttonId, canAfford, costText) {
        const button = document.getElementById(buttonId);
        if (!button) return;
        
        const costElement = button.querySelector('small');
        
        if (canAfford) {
            button.classList.remove('disabled');
        } else {
            button.classList.add('disabled');
        }
        
        if (costElement) {
            costElement.textContent = costText;
        }
    }
    
    updateUpgrade(upgradeId, cost, isPurchased) {
        const upgradeCard = document.getElementById(`upgrade-${upgradeId}`);
        if (!upgradeCard) return;
        
        const button = upgradeCard.querySelector('.upgrade-btn');
        const costElement = upgradeCard.querySelector('.upgrade-cost');
        
        if (isPurchased) {
            if (button) {
                button.textContent = 'Purchased';
                button.classList.add('disabled');
            }
            if (costElement) {
                costElement.textContent = 'Owned';
            }
            upgradeCard.style.opacity = '0.6';
        } else if (this.gameState.divineEnergy >= cost) {
            if (button) {
                button.classList.remove('disabled');
            }
        } else {
            if (button) {
                button.classList.add('disabled');
            }
        }
    }
    
    showMessage(type, text) {
        // Messages will now appear as toast notifications or in sidebar
        // For now, just log to console to maintain game functionality
        console.log(`${type.toUpperCase()}: ${text}`);
    }
    
    formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    }
    
    startGameLoop() {
        setInterval(() => {
            let stateChanged = false;
            
            // Auto-generate followers from prophet
            if (this.gameState.autoGenerators.prophet) {
                const oldFollowers = this.gameState.followers;
                this.gameState.followers += Math.floor(this.gameState.followers * 0.01) + 1;
                if (this.gameState.followers !== oldFollowers) stateChanged = true;
            }
            
            // Auto-generate energy from temples (base generation)
            if (this.gameState.temples > 0) {
                const baseEnergyGain = this.gameState.temples;
                this.gameState.divineEnergy += baseEnergyGain;
                stateChanged = true;
            }
            
            // Auto-generate energy from temples with sanctuary upgrade
            if (this.gameState.autoGenerators.sanctuary && this.gameState.temples > 0) {
                const bonusEnergyGain = this.gameState.temples * 2;
                this.gameState.divineEnergy += bonusEnergyGain;
                stateChanged = true;
            }
            
            // Auto-generate energy from followers with scriptures
            if (this.gameState.autoGenerators.scriptures && this.gameState.followers > 0) {
                const energyGain = Math.floor(this.gameState.followers * 0.1) + 1;
                this.gameState.divineEnergy += energyGain;
                stateChanged = true;
            }
            
            // Save game if state changed
            if (stateChanged) {
                this.saveGame();
            }
            
            this.updateUI();
        }, 1000);
    }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ReligionTycoon();
});