function toggleForm(id) {

    var div = document.getElementById("edit_" + id);
    if (div.style.display == "none") {
        div.style.display = "block";
    } else {
        div.style.display = "none";
    }
}