let travelData = null;

// Load JSON
fetch("data.json")
    .then(res => res.json())
    .then(data => {
        travelData = data;
    })
    .catch(err => console.log(err));

function getLocalTime(timeZone){
    return new Date().toLocaleTimeString('en-US', {
        timeZone,
        hour: "numeric",
        minute: 'numeric',
        second: 'numeric',
        hour12: true
    });
}

function getTimeZoneByPlace(placeName){
    const name = placeName.toLowerCase();

    if(name.includes("sydney")) return "Australia/Sydney";
    if(name.includes("melbourne")) return "Australia/Melbourne";
    if(name.includes("tokyo")) return "Asia/Tokyo";
    if(name.includes("kyoto")) return "Asia/Tokyo";
    if(name.includes("rio")) return "America/Sao_Paulo";
    if(name.includes("sao paulo")) return "America/Sao_Paulo";
    if(name.includes("taj")) return "Asia/Kolkata";
    if(name.includes("angkor")) return "Asia/Phnom_Penh";

    return "UTC"; // Fallback
}

function search(){
    const input = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv = document.getElementById("searchResults");
    resultsDiv.innerHTML = "";

    if(!travelData){
        resultsDiv.innerHTML = "<p>Data is still loading. Please try again.</p>";
        return;
    }

    if(!input){
        resultsDiv.innerHTML = `<p>Please enter a valid search query.</p>`;
        return;
    }

    let results = [];

    // Category Search
    if(input === "temple" || input === "temples"){
        results = travelData.temples;
    } else if (input === "beach" || input === "beaches"){
        results = travelData.beaches;
    } else if (input === "city" || input === "cities"){
        travelData.countries.forEach(country => {
            results.push(...country.cities);
        });
    }

    // Search cities
    travelData.countries?.forEach(country => {
        country.cities?.forEach(city => {
            if(city.name.toLowerCase().includes(input)){
                results.push(city);
            }
        });
    });

    // Search temples
    travelData.temples?.forEach(temple => {
        if(temple.name.toLowerCase().includes(input)){
            results.push(temple);
        }
    });

    // Search beaches
    travelData.beaches?.forEach(beach => {
        if(beach.name.toLowerCase().includes(input)){
            results.push(beach);
        }
    });

    if(results.length === 0){
        resultsDiv.innerHTML = `<p>No results found.</p>`;
        return;
    }

    // Show cards
    results.forEach(place => {
        const localTime = getLocalTime(getTimeZoneByPlace(place.name));

        resultsDiv.innerHTML += `
            <div class="results-card">
                <img src="${place.imageUrl}" alt="${place.name}">
                <div class="card-body">
                    <h3>${place.name}</h3>
                    <p>${place.description}</p>
                    <p><strong>Local Time:</strong> ${localTime}</p>
                    <button>Visit</button>
                </div>
            </div>
        `;
    });
}

function clearSearch(){
    document.getElementById("searchInput").value = "";
    document.getElementById("searchResults").innerHTML = "";
}
