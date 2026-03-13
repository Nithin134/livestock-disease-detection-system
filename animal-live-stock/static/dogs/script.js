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

    fetch("/dogs/predict", {
        method: "POST",
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById("predictionResult").innerHTML = `<h3>Predicted Disease: ${data.prediction}</h3>`;
    })
    .catch(error => console.error("Error:", error));
}
