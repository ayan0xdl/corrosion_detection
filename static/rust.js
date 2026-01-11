// Simple file name display - no complex logic
document.addEventListener('DOMContentLoaded', function() {
    const fileInput = document.getElementById("imageInput");
    const uploadText = document.querySelector(".upload-text");
    
    if (fileInput && uploadText) {
        fileInput.addEventListener('change', function(e) {
            if (e.target.files.length > 0) {
                uploadText.textContent = e.target.files[0].name;
            } else {
                uploadText.textContent = "Upload Image";
            }
        });
    }
});
