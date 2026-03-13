function previewImage() {
    const fileInput = document.getElementById("fileInput");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const buttonContainer = document.getElementById("buttonContainer");
    
    if (!fileInput.files || !fileInput.files[0]) {
        previewContainer.style.display = "none";
        buttonContainer.style.display = "none";
        document.getElementById("predictionResult").innerHTML = "";
        return;
    }
    
    const reader = new FileReader();
    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewContainer.style.display = "block";
        buttonContainer.style.display = "block";
        document.getElementById("predictionResult").innerHTML = "";
    };
    reader.readAsDataURL(fileInput.files[0]);
}

function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files || !fileInput.files[0]) {
        alert("Please choose an image first.");
        return;
    }
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // Show loading text
    document.getElementById("predictionResult").innerHTML = "Analyzing...";

    fetch("/goats/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("predictionResult").innerHTML = `<h3 style="color:red;">Error: ${data.error}</h3>`;
        } else {
            // Using backticks for cleaner formatting
            const disease = data.prediction;
            const confidence = data.confidence ? ` (Confidence: ${data.confidence}%)` : "";
            document.getElementById("predictionResult").innerHTML = `<h3>Predicted Disease: ${disease}${confidence}</h3>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("predictionResult").innerHTML = `<h3 style="color:red;">An error occurred. Please try again.</h3>`;
    });
}
