// Get all plants and terrarium
const plants = document.querySelectorAll('.plant');
const plantsArea = document.getElementById('plants-area');
const resetBtn = document.getElementById('reset-btn');

// Array to store plants in terrarium
let plantsInTerrarium = [];

// Setup drag and drop for all plants
plants.forEach(plant => {
	plant.addEventListener('dragstart', handleDragStart);
	plant.addEventListener('dragend', handleDragEnd);
});

// Setup terrarium drop zone
plantsArea.addEventListener('dragover', handleDragOver);
plantsArea.addEventListener('dragleave', handleDragLeave);
plantsArea.addEventListener('drop', handleDrop);

// Reset button
resetBtn.addEventListener('click', resetTerrarium);

// DRAG FUNCTIONS
function handleDragStart(e) {
	e.dataTransfer.effectAllowed = 'copy';
	e.dataTransfer.setData('text/html', this.innerHTML);
	e.dataTransfer.setData('plantEmoji', this.getAttribute('data-plant'));
	this.style.opacity = '0.6';
}

function handleDragEnd(e) {
	this.style.opacity = '1';
	plantsArea.classList.remove('drag-over');
}

function handleDragOver(e) {
	e.preventDefault();
	e.dataTransfer.dropEffect = 'copy';
	plantsArea.classList.add('drag-over');
}

function handleDragLeave(e) {
	if (e.target === plantsArea) {
		plantsArea.classList.remove('drag-over');
	}
}

function handleDrop(e) {
	e.preventDefault();
	plantsArea.classList.remove('drag-over');
	
	const plantEmoji = e.dataTransfer.getData('plantEmoji');
	
	if (plantEmoji) {
		addPlantToTerrarium(plantEmoji);
	}
}

// Add plant to terrarium
function addPlantToTerrarium(emoji) {
	// Create a plant element in terrarium
	const plantDiv = document.createElement('div');
	plantDiv.className = 'plant-in-terrarium';
	plantDiv.textContent = emoji;
	
	// Add to array
	plantsInTerrarium.push(emoji);
	
	// Add to DOM
	plantsArea.appendChild(plantDiv);
	
	// Remove hint if it exists
	const hint = plantsArea.querySelector('.drop-hint');
	if (hint) {
		hint.style.display = 'none';
	}
	
	// Add class to plants-area if it has plants
	plantsArea.classList.add('has-plants');
	
	// Add animation by removing and re-adding class
	plantDiv.style.animation = 'none';
	setTimeout(() => {
		plantDiv.style.animation = '';
	}, 10);
}

// Reset terrarium
function resetTerrarium() {
	plantsInTerrarium = [];
	plantsArea.innerHTML = '<p class="drop-hint">Drop plants here!</p>';
	plantsArea.classList.remove('has-plants');
}
