const eventForm = document.getElementById('eventForm');
const eventsList = document.getElementById('eventsList');
const eventTitleInput = document.getElementById('eventTitle');
const eventDateInput = document.getElementById('eventDate');
const eventDescriptionInput = document.getElementById('eventDescription');


let events = [];
let eventIdCounter = 0;


function init() {
    loadEvents();
    setupEventListeners();
}


function setupEventListeners() {

    eventForm.addEventListener('submit', handleAddEvent);
    

    eventsList.addEventListener('click', handleEventCardClick);
}


function handleAddEvent(e) {
    e.preventDefault();
    
    const title = eventTitleInput.value.trim();
    const date = eventDateInput.value;
    const description = eventDescriptionInput.value.trim();
    
    if (!title || !date || !description) {
        alert('Please fill in all fields');
        return;
    }
    
    const newEvent = {
        id: ++eventIdCounter,
        title,
        date,
        description
    };
    
    events.push(newEvent);
    saveEvents();
    renderEventCard(newEvent);
    
 
    eventForm.reset();
}


function handleEventCardClick(e) {
    const target = e.target;
    const card = target.closest('.event-card');
    
    if (!card) return;
    
    const eventId = parseInt(card.dataset.eventId);
    const event = events.find(evt => evt.id === eventId);
    
    if (target.classList.contains('delete-btn')) {
        deleteEvent(eventId);
    } else if (target.classList.contains('edit-btn')) {
        showEditForm(card, event);
    } else if (target.classList.contains('save-btn')) {
        saveEdit(card, event);
    } else if (target.classList.contains('cancel-btn')) {
        cancelEdit(card, event);
    }
}


function deleteEvent(eventId) {
    if (confirm('Are you sure you want to delete this event?')) {
        events = events.filter(evt => evt.id !== eventId);
        saveEvents();
        const card = document.querySelector(`[data-event-id="${eventId}"]`);
        if (card) {
            card.remove();
        }
    }
}


function showEditForm(card, event) {
    const editForm = card.querySelector('.edit-form');
    const titleInput = editForm.querySelector('.edit-title');
    const dateInput = editForm.querySelector('.edit-date');
    const descInput = editForm.querySelector('.edit-description');
    

    titleInput.value = event.title;
    dateInput.value = event.date;
    descInput.value = event.description;

    editForm.style.display = 'block';
    card.querySelector('.card-content').style.display = 'none';
}


function saveEdit(card, event) {
    const editForm = card.querySelector('.edit-form');
    const titleInput = editForm.querySelector('.edit-title');
    const dateInput = editForm.querySelector('.edit-date');
    const descInput = editForm.querySelector('.edit-description');
    
    const newTitle = titleInput.value.trim();
    const newDate = dateInput.value;
    const newDescription = descInput.value.trim();
    
    if (!newTitle || !newDate || !newDescription) {
        alert('Please fill in all fields');
        return;
    }
    

    event.title = newTitle;
    event.date = newDate;
    event.description = newDescription;
    
    saveEvents();
    updateCardDisplay(card, event);
    
t
    editForm.style.display = 'none';
    card.querySelector('.card-content').style.display = 'block';
}


function cancelEdit(card, event) {
    const editForm = card.querySelector('.edit-form');
    editForm.style.display = 'none';
    card.querySelector('.card-content').style.display = 'block';
}


function renderEventCard(event) {
    const card = document.createElement('div');
    card.className = 'event-card';
    card.dataset.eventId = event.id;
    
    card.innerHTML = `
        <div class="card-content">
            <h3>${event.title}</h3>
            <p class="date">Date: ${formatDate(event.date)}</p>
            <p class="description">${event.description}</p>
            <div class="card-actions">
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
            </div>
        </div>
        <div class="edit-form">
            <input type="text" class="edit-title" placeholder="Event Title" required>
            <input type="date" class="edit-date" required>
            <textarea class="edit-description" rows="3" placeholder="Description" required></textarea>
            <div class="form-actions">
                <button class="save-btn">Save</button>
                <button class="cancel-btn">Cancel</button>
            </div>
        </div>
    `;
    
    eventsList.appendChild(card);
}


function updateCardDisplay(card, event) {
    const content = card.querySelector('.card-content');
    content.innerHTML = `
        <h3>${event.title}</h3>
        <p class="date">Date: ${formatDate(event.date)}</p>
        <p class="description">${event.description}</p>
        <div class="card-actions">
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        </div>
    `;
}


function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}


function saveEvents() {
    localStorage.setItem('events', JSON.stringify(events));
}

function loadEvents() {
    const storedEvents = localStorage.getItem('events');
    if (storedEvents) {
        events = JSON.parse(storedEvents);
        eventIdCounter = events.length > 0 ? Math.max(...events.map(e => e.id)) : 0;
        events.forEach(renderEventCard);
    }
}


document.addEventListener('DOMContentLoaded', init);