const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, 'data');
const MOVIES_FILE = path.join(DATA_DIR, 'movies.json');
const RESERVATIONS_FILE = path.join(DATA_DIR, 'reservations.json');

// ==========================================
// DATABASE INITIALIZATION
// ==========================================
function initDatabase() {
    if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR);
    if (!fs.existsSync(RESERVATIONS_FILE)) fs.writeFileSync(RESERVATIONS_FILE, JSON.stringify([]));
    if (!fs.existsSync(MOVIES_FILE)) {
        const defaultMovies = [ { id: 1, title: "The Legend of Maula Jatt", price: 800, totalSeats: 50, availableSeats: 50 }, { id: 2, title: "Inception", price: 600, totalSeats: 40, availableSeats: 40 }, { id: 3, title: "Interstellar", price: 700, totalSeats: 60, availableSeats: 60 } ];
        fs.writeFileSync(MOVIES_FILE, JSON.stringify(defaultMovies, null, 2));
    }
}

// Database Helpers
function loadData(filePath) { return JSON.parse(fs.readFileSync(filePath, 'utf8')); }
function saveData(filePath, data) { fs.writeFileSync(filePath, JSON.stringify(data, null, 2)); }


// ==========================================
// CORE FEATURES
// ==========================================

// List Movies
function listMovies() {
    const movies = loadData(MOVIES_FILE);
    console.log("\n🎬 --- AVAILABLE MOVIES --- 🎬");
    movies.forEach(m => console.log(`[ID: ${m.id}] ${m.title} | Rs.${m.price} | ${m.availableSeats > 0 ? `${m.availableSeats} seats left` : "❌ SOLD OUT"}`));
    console.log("------------------------------\n");
}

// Book Ticket
function bookTicket(movieId, userName) {
    if (!movieId || !userName) return console.log("❌ Error: Usage: book <movie_id> <name>");
    const movies = loadData(MOVIES_FILE);
    const reservations = loadData(RESERVATIONS_FILE);
    const movie = movies.find(m => m.id === parseInt(movieId));
    if (!movie) return console.log(`❌ Error: Movie ID ${movieId} not found.`);
    if (movie.availableSeats <= 0) return console.log(`❌ Sorry! '${movie.title}' is SOLD OUT.`);
    const ticketId = reservations.length > 0 ? reservations[reservations.length - 1].id + 1 : 1;
    reservations.push({ id: ticketId, movieId: movie.id, movieTitle: movie.title, customerName: userName, bookedAt: new Date().toLocaleString() });
    movie.availableSeats -= 1;
    saveData(MOVIES_FILE, movies);
    saveData(RESERVATIONS_FILE, reservations);
    console.log(`\n🎉 TICKET CONFIRMED for ${userName} (ID: ${ticketId}) for '${movie.title}' 🎉\n`);
}

// FEATURE 3: Apni Bookings Dikhana
function viewMyBookings(userName) {
    if (!userName) return console.log("❌ Error: Usage: view <name>");
    const reservations = loadData(RESERVATIONS_FILE);
    const myTickets = reservations.filter(r => r.customerName.toLowerCase() === userName.toLowerCase());

    if (myTickets.length === 0) return console.log(`📭 No tickets found for '${userName}'.`);
    
    console.log(`\n--- Bookings for ${userName} ---`);
    myTickets.forEach(t => console.log(`🎫 Ticket ID: ${t.id} | Movie: ${t.movieTitle}`));
    console.log("----------------------------\n");
}

// FEATURE 4: Ticket Cancel Karna (The Reverse Transaction)
function cancelTicket(ticketId) {
    if (!ticketId) return console.log("❌ Error: Usage: cancel <ticket_id>");
    const reservations = loadData(RESERVATIONS_FILE);
    const movies = loadData(MOVIES_FILE);
    
    const reservationIndex = reservations.findIndex(r => r.id === parseInt(ticketId));
    if (reservationIndex === -1) return console.log(`❌ Error: Ticket ID ${ticketId} not found.`);

    const cancelledReservation = reservations[reservationIndex];
    const movie = movies.find(m => m.id === cancelledReservation.movieId);

    // THE REVERSE TRANSACTION
    reservations.splice(reservationIndex, 1); // Reservation delete ki
    if (movie) movie.availableSeats += 1;   // Movie mein seat wapis daali

    saveData(RESERVATIONS_FILE, reservations);
    saveData(MOVIES_FILE, movies);
    
    console.log(`\n✅ Ticket ID ${ticketId} has been successfully cancelled.\n`);
}


// ==========================================
// COMMAND ROUTER
// ==========================================
initDatabase();
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case "list":
        listMovies();
        break;
    case "book":
        bookTicket(args[1], args[2]);
        break;
    case "view":
        viewMyBookings(args[1]);
        break;
    case "cancel":
        cancelTicket(args[1]);
        break;
    default:
        console.log("\n--- Movie Reservation CLI ---");
        console.log("  list                   - Show all available movies");
        console.log("  book <movie_id> <name> - Book a ticket");
        console.log("  view <name>            - View your booked tickets");
        console.log("  cancel <ticket_id>     - Cancel a ticket\n");
}