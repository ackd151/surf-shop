// client side image count limiting
let postEditForm = document.getElementById('postEditForm');
postEditForm.addEventListener('submit', function(event){
    let uploading = document.getElementById('imageUpload').files.length;
    let existingImages = document.querySelectorAll('.imageDeleteCheckbox').length;
    let deleting = document.querySelectorAll('.imageDeleteCheckbox:checked').length;
    let newTotal = existingImages + uploading - deleting;
    if (newTotal > 4) {
        event.preventDefault();
        alert(`You need to remove at least ${newTotal - 4} (more) image(s)`);
    }
});