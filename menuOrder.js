// READ URL PARAMETER when page loads
var urlParams = new URLSearchParams(window.location.search);
var categoryFromURL = urlParams.get('category');

// Get all the category buttons
var tabButtons = document.querySelectorAll('.tab');

// Add click event to each tab button
for (var i = 0; i < tabButtons.length; i++) {
    tabButtons[i].addEventListener('click', function() {
        // Remove active from all buttons
        for (var j = 0; j < tabButtons.length; j++) {
            tabButtons[j].classList.remove('active');
        }
        
        // Add active to clicked button
        this.classList.add('active');
        
        // Get category and filter
        var category = this.dataset.category;
        filterItems(category);
    });
}

// FUNCTION: Filter items by category
function filterItems(category) {
    var allItems = document.querySelectorAll('.item-card');
    
    for (var i = 0; i < allItems.length; i++) {
        var item = allItems[i];
        var itemCategory = item.dataset.category;
        
        // Show all items if "all" is selected
        if (category === 'all') {
            item.style.display = 'block';
        }
        // Show only matching items
        else if (itemCategory === category) {
            item.style.display = 'block';
        }
        // Hide non-matching items
        else {
            item.style.display = 'none';
        }
    }
}