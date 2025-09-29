function openSidebar() {
    document.getElementById('sidebar').classList.add('visible');
    document.getElementById('menuBtn').style.display = 'none';
}

function closeSidebar() {
    document.getElementById('sidebar').classList.remove('visible');
    document.getElementById('menuBtn').style.display = 'block';
}
