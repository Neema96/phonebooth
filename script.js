const API_URL = "http://localhost:3000/contacts";
const contactList = document.getElementById("contactList");
const form = document.getElementById("contactForm");
const searchInput = document.getElementById("search");

async function fetchContacts() {
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        displayContacts(contacts);
    } catch (error) {
        console.error("Error fetching contacts:", error);
    }
}

// Display contacts
function displayContacts(contacts) {
    contactList.innerHTML = "";
    contacts.forEach(contact => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `
      <div>
        <strong>${contact.name}</strong><br>
        <small>${contact.phone}</small> | <small>${contact.email || ""}</small>
      </div>
      <div>
        <button class="btn btn-sm btn-warning me-2" onclick="updateContact('${contact.id}', '${contact.name}', '${contact.phone}', '${contact.email}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteContact('${contact.id}')">Delete</button>
      </div>
    `;
        contactList.appendChild(li);
    });
}

//Add new contact
form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = form.name.value;
    const phone = form.phone.value;
    const email = form.email.value;

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone, email })
        });
        if (response.ok) {
            fetchContacts();
            form.reset();
        } else {
            console.error("Error adding contact");
        }
    } catch (error) {
        console.error("Error adding contact:", error);
    }
});

// Delete contact

async function deleteContact(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: "DELETE" });
        console.log(response);
        
        fetchContacts();
    } catch (error) {
        console.error("Error deleting contact:", error);
    }
}

// Search contacts
searchInput.addEventListener("input", async(e) => {
    const query = e.target.value.toLowerCase();
    try {
        const response = await fetch(API_URL);
        const contacts = await response.json();
        const filteredContacts = contacts.filter(contact =>
            contact.name.toLowerCase().includes(query) ||
            contact.phone.toLowerCase().includes(query) ||
            (contact.email && contact.email.toLowerCase().includes(query))
        );
        displayContacts(filteredContacts);
    } catch (error) {
        console.error("Error searching contacts:", error);
    }
});

// Update contact
async function updateContact(id, currentName, currentName, currentEmail) {
    const name = prompt("Enter new name:", currentName);
    const phone = prompt("Enter new phone number:", currentName);
    const email = prompt("Enter new email (optional):", currentEmail);

    if (!name || !phone) {
        alert("Name and phone number are required.");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, phone, email })
        });
        if (response.ok) {
            fetchContacts();
        } else {
            console.error("Error updating contact");
        }
    } catch (error) {
        console.error("Error updating contact:", error);
    }
}
// Initial load
fetchContacts();