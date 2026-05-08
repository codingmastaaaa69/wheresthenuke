const gamesData = {
    games: [
        {
            id: "2048",
            title: "2048",
            description: "Join the numbers and get to the 2048 tile!",
            iframeUrl: "https://play2048.co/",
            thumbnail: "https://upload.wikimedia.org/wikipedia/commons/1/18/2048_logo.svg",
            category: "Puzzle"
        },
        {
            id: "tetris",
            title: "Tetris",
            description: "The classic block-stacking puzzle game.",
            iframeUrl: "https://tetris.com/play-tetris",
            thumbnail: "https://upload.wikimedia.org/wikipedia/commons/7/7c/Tetris_logo.svg",
            category: "Classic"
        },
        {
            id: "flappy-bird",
            title: "Flappy Bird",
            description: "Flap your wings and fly through the pipes.",
            iframeUrl: "https://flappybird.io/",
            thumbnail: "https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png",
            category: "Arcade"
        },
        {
            id: "snake",
            title: "Snake",
            description: "Eat the food and grow longer without hitting the walls.",
            iframeUrl: "https://www.google.com/logos/2010/pacman10-i.html",
            thumbnail: "https://upload.wikimedia.org/wikipedia/commons/4/43/Snake_icon.svg",
            category: "Classic"
        }
    ]
};

const gamesGrid = document.getElementById('gamesGrid');
const searchInput = document.getElementById('searchInput');
const homeView = document.getElementById('homeView');
const playerView = document.getElementById('playerView');
const gameIframe = document.getElementById('gameIframe');
const currentGameTitle = document.getElementById('currentGameTitle');

function renderGames(filter = '') {
    gamesGrid.innerHTML = '';
    const filtered = gamesData.games.filter(game => 
        game.title.toLowerCase().includes(filter.toLowerCase())
    );

    filtered.forEach(game => {
        const card = document.createElement('div');
        card.className = 'group relative cursor-pointer';
        card.onclick = () => playLevel(game);
        card.innerHTML = `
            <div class="bg-white/5 border border-white/10 rounded-[2rem] overflow-hidden transition-all duration-500 game-card">
                <div class="aspect-[4/3] bg-white/5 relative overflow-hidden">
                    <img src="${game.thumbnail}" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                         <div class="w-12 h-12 bg-[var(--primary)] rounded-full flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                         </div>
                    </div>
                </div>
                <div class="p-6">
                    <h3 class="text-xl font-bold tracking-tight text-display group-hover:text-[var(--primary)] transition-colors">${game.title}</h3>
                    <p class="text-xs text-white/30 uppercase font-black tracking-widest mt-1">${game.category}</p>
                </div>
            </div>
        `;
        gamesGrid.appendChild(card);
    });
}

function playLevel(game) {
    homeView.classList.add('hidden');
    playerView.classList.remove('hidden');
    gameIframe.src = game.iframeUrl;
    currentGameTitle.innerText = game.title;
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function showHome() {
    homeView.classList.remove('hidden');
    playerView.classList.add('hidden');
    gameIframe.src = '';
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('wt_theme_simple', theme);
    
    // Update theme dots
    document.querySelectorAll('.theme-dot').forEach(dot => {
        dot.classList.remove('active');
        if (dot.getAttribute('onclick').includes(theme)) {
            dot.classList.add('active');
        }
    });

    // Simple hack to trigger tailwind colors
    document.body.style.display = 'none';
    document.body.offsetHeight; // force reflow
    document.body.style.display = 'block';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
}

searchInput.addEventListener('input', (e) => {
    renderGames(e.target.value);
});

// Init
const savedTheme = localStorage.getItem('wt_theme_simple') || 'radiation';
setTheme(savedTheme);
renderGames();
