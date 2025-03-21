document.addEventListener("DOMContentLoaded", () => {
    const BASE_URL = "http://localhost:3000/dogs";
    const tableBody = document.getElementById("table-body");
    const form = document.getElementById("dog-form");

    let selectedDogId = null;

    // Fetch and Display Dogs
    function fetchDogs() {
        fetch(BASE_URL)
            .then(response => response.json())
            .then(dogs => {
                tableBody.innerHTML = ""; 
                dogs.forEach(dog => renderDogRow(dog));
            })
            .catch(error => console.error("Error fetching dogs:", error));
    }
    

    function renderDogRow(dog) {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
        `;

        tableBody.appendChild(tr);

        
        tr.querySelector(".edit-btn").addEventListener("click", () => {
            selectedDogId = dog.id;
            form.name.value = dog.name;
            form.breed.value = dog.breed;
            form.sex.value = dog.sex;
        });
    }
    

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        if (selectedDogId === null) return;

        const updatedDog = {
            name: form.name.value,
            breed: form.breed.value,
            sex: form.sex.value,
        };

        fetch(`${BASE_URL}/${selectedDogId}`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedDog),
        })
            .then(response => response.json())
            .then(() => {
                selectedDogId = null; // Reset selected ID
                form.reset(); // Clear the form
                fetchDogs(); // Refresh the table
            })
            .catch(error => console.error("Error updating dog:", error));
    });

    fetchDogs();
});
