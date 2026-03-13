function previewImage() {
    const fileInput = document.getElementById("fileInput");
    const previewContainer = document.getElementById("previewContainer");
    const imagePreview = document.getElementById("imagePreview");
    const buttonContainer = document.getElementById("buttonContainer");
    
    if (!fileInput.files || !fileInput.files[0]) {
        previewContainer.style.display = "none";
        buttonContainer.style.display = "none";
        document.getElementById("predictionResult").innerHTML = "";
        imagePreview.src = "";
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        imagePreview.src = e.target.result;
        previewContainer.style.display = "block";
        buttonContainer.style.display = "block";
        // Clear previous result
        document.getElementById("predictionResult").innerHTML = "";
    };

    reader.readAsDataURL(file);
}

function uploadImage() {
    const fileInput = document.getElementById("fileInput");
    if (!fileInput.files || !fileInput.files[0]) {
        alert("Please select an image first!");
        return;
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    // Show loading state
    document.getElementById("predictionResult").innerHTML = "<p>Analyzing...</p>";

    fetch("/cattle/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            document.getElementById("predictionResult").innerHTML = `<p style="color:red;">Error: ${data.error}</p>`;
        } else {
            // Display prediction and confidence
            document.getElementById("predictionResult").innerHTML = `<h3>Predicted Disease: ${data.prediction}</h3><p>Confidence: ${data.confidence}%</p>`;
        }
    })
    .catch(error => {
        console.error("Error:", error);
        document.getElementById("predictionResult").innerHTML = `<p style="color:red;">An error occurred.</p>`;
    });
}
